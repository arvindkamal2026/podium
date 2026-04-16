#!/usr/bin/env node
/**
 * map-pis-to-events.js
 *
 * For each DECA event, calls the Anthropic API to identify which Performance
 * Indicators from that event's cluster are relevant, then writes the result
 * to data/mapped-pis.json.
 *
 * Usage:  node scripts/map-pis-to-events.js
 *
 * Reads:  data/extracted-pis.json
 * Writes: data/mapped-pis.json
 *
 * Progress is checkpointed after each event so the script is resumable
 * if interrupted — just re-run and it will skip already-processed events.
 */

const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

// Load env vars from .env.local (project standard) or .env as fallback
function loadEnv() {
  const candidates = [".env.local", ".env"];
  for (const file of candidates) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    break;
  }
}
loadEnv();

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const INPUT_FILE = path.join(__dirname, "../data/extracted-pis.json");
const OUTPUT_FILE = path.join(__dirname, "../data/mapped-pis.json");
const CHECKPOINT_FILE = path.join(__dirname, "../data/.map-checkpoint.json");

// ---------------------------------------------------------------------------
// Cluster name mapping  (events.ts cluster id → extracted-pis.json cluster)
// ---------------------------------------------------------------------------
const CLUSTER_MAP = {
  "finance": "Finance",
  "marketing": "Marketing",
  "entrepreneurship": "Entre",
  "business-mgmt": "BMA",
  "hospitality": "Hospitality",
  "personal-finance": "Personal Finance",
};

// ---------------------------------------------------------------------------
// All 60 DECA HS events (id, name, cluster)
// ---------------------------------------------------------------------------
const EVENTS = [
  { id: "act",   name: "Accounting Applications Series",                          cluster: "finance" },
  { id: "aam",   name: "Apparel and Accessories Marketing Series",                cluster: "marketing" },
  { id: "asm",   name: "Automotive Services Marketing Series",                    cluster: "marketing" },
  { id: "bfs",   name: "Business Finance Series",                                 cluster: "finance" },
  { id: "ebg",   name: "Business Growth Plan",                                    cluster: "entrepreneurship" },
  { id: "bltdm", name: "Business Law and Ethics Team Decision Making",            cluster: "business-mgmt" },
  { id: "bsm",   name: "Business Services Marketing Series",                      cluster: "marketing" },
  { id: "bor",   name: "Business Services Operations Research",                   cluster: "business-mgmt" },
  { id: "pmbs",  name: "Business Solutions Project",                              cluster: "business-mgmt" },
  { id: "bmor",  name: "Buying and Merchandising Operations Research",            cluster: "business-mgmt" },
  { id: "btdm",  name: "Buying and Merchandising Team Decision Making",           cluster: "business-mgmt" },
  { id: "pmcd",  name: "Career Development Project",                              cluster: "business-mgmt" },
  { id: "pmca",  name: "Community Awareness Project",                             cluster: "business-mgmt" },
  { id: "pmcg",  name: "Community Giving Project",                                cluster: "business-mgmt" },
  { id: "ent",   name: "Entrepreneurship Series",                                 cluster: "entrepreneurship" },
  { id: "etdm",  name: "Entrepreneurship Team Decision Making",                   cluster: "entrepreneurship" },
  { id: "for",   name: "Finance Operations Research",                             cluster: "finance" },
  { id: "fce",   name: "Financial Consulting",                                    cluster: "finance" },
  { id: "pmfl",  name: "Financial Literacy Project",                              cluster: "business-mgmt" },
  { id: "ftdm",  name: "Financial Services Team Decision Making",                 cluster: "finance" },
  { id: "fms",   name: "Food Marketing Series",                                   cluster: "marketing" },
  { id: "efb",   name: "Franchise Business Plan",                                 cluster: "entrepreneurship" },
  { id: "htdm",  name: "Hospitality Services Team Decision Making",               cluster: "hospitality" },
  { id: "htor",  name: "Hospitality and Tourism Operations Research",             cluster: "hospitality" },
  { id: "htps",  name: "Hospitality and Tourism Professional Selling",            cluster: "hospitality" },
  { id: "hlm",   name: "Hotel and Lodging Management Series",                     cluster: "hospitality" },
  { id: "hrm",   name: "Human Resources Management Series",                       cluster: "business-mgmt" },
  { id: "eib",   name: "Independent Business Plan",                               cluster: "entrepreneurship" },
  { id: "eip",   name: "Innovation Plan",                                         cluster: "entrepreneurship" },
  { id: "imce",  name: "Integrated Marketing Campaign-Event",                     cluster: "marketing" },
  { id: "imcp",  name: "Integrated Marketing Campaign-Product",                   cluster: "marketing" },
  { id: "imcs",  name: "Integrated Marketing Campaign-Service",                   cluster: "marketing" },
  { id: "ibp",   name: "International Business Plan",                             cluster: "entrepreneurship" },
  { id: "mcs",   name: "Marketing Communications Series",                         cluster: "marketing" },
  { id: "mtdm",  name: "Marketing Management Team Decision Making",               cluster: "marketing" },
  { id: "pfl",   name: "Personal Financial Literacy",                             cluster: "personal-finance" },
  { id: "pbm",   name: "Principles of Business Management and Administration",    cluster: "business-mgmt" },
  { id: "pen",   name: "Principles of Entrepreneurship",                          cluster: "entrepreneurship" },
  { id: "pfn",   name: "Principles of Finance",                                   cluster: "finance" },
  { id: "pht",   name: "Principles of Hospitality and Tourism",                   cluster: "hospitality" },
  { id: "pmk",   name: "Principles of Marketing",                                 cluster: "marketing" },
  { id: "pse",   name: "Professional Selling",                                    cluster: "marketing" },
  { id: "qsrm",  name: "Quick Serve Restaurant Management Series",                cluster: "marketing" },
  { id: "rfsm",  name: "Restaurant and Food Service Management Series",           cluster: "marketing" },
  { id: "rms",   name: "Retail Merchandising Series",                             cluster: "marketing" },
  { id: "pmsp",  name: "Sales Project",                                           cluster: "business-mgmt" },
  { id: "seor",  name: "Sports and Entertainment Marketing Operations Research",  cluster: "marketing" },
  { id: "sem",   name: "Sports and Entertainment Marketing Series",               cluster: "marketing" },
  { id: "stdm",  name: "Sports and Entertainment Marketing Team Decision Making", cluster: "marketing" },
  { id: "esb",   name: "Start-Up Business Plan",                                  cluster: "entrepreneurship" },
  { id: "smg",   name: "Stock Market Game",                                       cluster: "finance" },
  { id: "ttdm",  name: "Travel and Tourism Team Decision Making",                 cluster: "hospitality" },
  { id: "vbcac", name: "Virtual Business Challenge-Accounting",                   cluster: "finance" },
  { id: "vbcen", name: "Virtual Business Challenge-Entrepreneurship",             cluster: "entrepreneurship" },
  { id: "vbcfa", name: "Virtual Business Challenge-Fashion",                      cluster: "marketing" },
  { id: "vbchm", name: "Virtual Business Challenge-Hotel Management",             cluster: "hospitality" },
  { id: "vbcpf", name: "Virtual Business Challenge-Personal Finance",             cluster: "personal-finance" },
  { id: "vbcrs", name: "Virtual Business Challenge-Restaurant",                   cluster: "hospitality" },
  { id: "vbcrt", name: "Virtual Business Challenge-Retail",                       cluster: "marketing" },
  { id: "vbcsp", name: "Virtual Business Challenge-Sports",                       cluster: "marketing" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract a JSON array from Claude's response text, which may contain
 * surrounding prose or markdown code fences.
 */
function parseJsonArray(text) {
  // Try to find a JSON array anywhere in the response
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Ask Claude which PI IDs from the given list are relevant to the event.
 * Returns an array of PI IDs (strings).
 */
async function getRelevantPIIds(client, event, clusterPIs) {
  const piList = clusterPIs
    .map((pi) => `${pi.id}: ${pi.text}`)
    .join("\n");

  const prompt = `You are a DECA competition expert helping students prepare for their events.

Below is a list of DECA Performance Indicators (PIs) from the ${CLUSTER_MAP[event.cluster]} cluster. Each line is formatted as:
<id>: <PI text>

PI LIST:
${piList}

TASK: A student is competing in "${event.name}" (a ${event.cluster} event).
Identify which PIs from the list above are relevant and likely to appear on this event's exam or role-play scenarios.

Return ONLY a valid JSON array containing the IDs of relevant PIs, like this:
["id1", "id2", "id3"]

No explanation. No markdown. Just the JSON array.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0]?.text ?? "";
  return parseJsonArray(text);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY not set. Add it to .env.local");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Load PIs — start from checkpoint if one exists
  const pis = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  const piById = Object.fromEntries(pis.map((p) => [p.id, p]));

  // Load checkpoint if it exists (allows resuming interrupted runs)
  let processedEvents = new Set();
  if (fs.existsSync(CHECKPOINT_FILE)) {
    const checkpoint = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf8"));
    processedEvents = new Set(checkpoint.processedEvents ?? []);
    // Restore accumulated events data
    for (const pi of checkpoint.pis ?? []) {
      if (piById[pi.id]) piById[pi.id].events = pi.events;
    }
    console.log(
      `Resuming from checkpoint — ${processedEvents.size}/${EVENTS.length} events already done.\n`
    );
  }

  // Group PIs by cluster for efficient lookup
  const pisByCluster = {};
  for (const pi of Object.values(piById)) {
    const key = pi.cluster;
    if (!pisByCluster[key]) pisByCluster[key] = [];
    pisByCluster[key].push(pi);
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < EVENTS.length; i++) {
    const event = EVENTS[i];

    if (processedEvents.has(event.id)) {
      console.log(`[${i + 1}/${EVENTS.length}] Skipping ${event.name} (already done)`);
      continue;
    }

    const clusterName = CLUSTER_MAP[event.cluster];
    if (!clusterName) {
      console.warn(`[${i + 1}/${EVENTS.length}] Unknown cluster "${event.cluster}" for ${event.name} — skipping`);
      processedEvents.add(event.id);
      continue;
    }

    const clusterPIs = pisByCluster[clusterName] ?? [];
    if (clusterPIs.length === 0) {
      console.warn(`[${i + 1}/${EVENTS.length}] No PIs found for cluster "${clusterName}" — skipping ${event.name}`);
      processedEvents.add(event.id);
      continue;
    }

    console.log(
      `[${i + 1}/${EVENTS.length}] ${event.name}  (${clusterName}, ${clusterPIs.length} PIs)`
    );

    try {
      const relevantIds = await getRelevantPIIds(client, event, clusterPIs);

      let matched = 0;
      for (const id of relevantIds) {
        if (piById[id] && !piById[id].events.includes(event.id)) {
          piById[id].events.push(event.id);
          matched++;
        }
      }

      console.log(`  → ${relevantIds.length} IDs returned, ${matched} PIs updated`);
      successCount++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      errorCount++;
    }

    processedEvents.add(event.id);

    // Save checkpoint after every event
    fs.writeFileSync(
      CHECKPOINT_FILE,
      JSON.stringify(
        {
          processedEvents: [...processedEvents],
          pis: Object.values(piById).map(({ id, events }) => ({ id, events })),
        },
        null,
        2
      )
    );

    // Rate-limit delay (skip after the last event)
    if (i < EVENTS.length - 1) await sleep(500);
  }

  // Write final output
  const result = Object.values(piById);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), "utf8");

  // Clean up checkpoint file on success
  if (fs.existsSync(CHECKPOINT_FILE)) fs.unlinkSync(CHECKPOINT_FILE);

  console.log(`\nDone. ${successCount} succeeded, ${errorCount} failed.`);
  console.log(`Output: ${OUTPUT_FILE}`);
  console.log(`PIs with at least one event: ${result.filter((p) => p.events.length > 0).length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
