#!/usr/bin/env node
/**
 * extract-pis.js
 * Reads all PDFs from data/cluster-pdfs/, extracts Performance Indicators,
 * tags each with its source cluster, and writes data/extracted-pis.json.
 *
 * Usage: node scripts/extract-pis.js
 *
 * DECA PI PDF format (as of 2025):
 *   Each PI is a line ending with  (XX:NNN) (LEVEL)
 *   where XX = 2-letter instructional area code, NNN = 3-digit number,
 *   and LEVEL = PQ | CS | SP.
 *   Example:  "Comply with the spirit and intent of laws and regulations (BL:163) (CS)"
 *
 *   Multi-line PIs: when pdf-parse wraps a long PI across two lines, the first
 *   line has no trailing code/level tag — we detect this and join it with the
 *   next line.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");

const PDF_DIR = path.join(__dirname, "../data/cluster-pdfs");
const OUTPUT_FILE = path.join(__dirname, "../data/extracted-pis.json");

// All level codes used across DECA PI PDFs
const LEVELS = "PQ|CS|SP|SU|MN|ON";

// Matches a complete DECA PI line:  "Some text here (AB:123) (SP)"
// Capture group 1 = the PI text (without the code/level tags)
const COMPLETE_PI_RE = new RegExp(`^(.+?)\\s+\\([A-Z]{2}:\\d{3,4}[A-Z]?\\)\\s+\\((?:${LEVELS})\\)\\s*$`);

// Matches the trailing tag only, used to check if a line has one
const TRAILING_TAG_RE = new RegExp(`\\([A-Z]{2}:\\d{3,4}[A-Z]?\\)\\s+\\((?:${LEVELS})\\)\\s*$`);

// Matches a Jump$tart/National Standards benchmark line, e.g.:
//   "4-1a .   Define the concept of opportunity cost ."
//   "12-3c.   Evaluate different types of insurance..."
// Capture group 1 = the benchmark text
const JUMPSTART_PI_RE = /^\d{1,2}-\d+[a-z]\s*\.?\s{2,}(.+\S)\s*\.?\s*$/;

/**
 * Derive a human-readable cluster name from a PDF filename.
 *
 * Handles DECA CDN filenames like:
 *   "6865320c38d796da3d00fd65_25_High School_Performance Indicators_Finance.pdf" → "Finance"
 *   "business-management.pdf" → "Business Management"
 */
function clusterFromFilename(filename) {
  let base = path.basename(filename, path.extname(filename));

  // Remove leading hex hash (16+ hex chars followed by _ or -)
  base = base.replace(/^[0-9a-f]{16,}[-_]?/i, "");

  // Normalise separators to spaces
  base = base.replace(/[-_]/g, " ");

  // Strip boilerplate tokens
  const BOILERPLATE = [
    /\b25\b/g,
    /\bHS\b/g,
    /\bHigh School\b/gi,
    /\bPerformance Indicators?\b/gi,
  ];
  for (const re of BOILERPLATE) base = base.replace(re, " ");

  return base.replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extract benchmarks from Jump$tart / National Standards PDFs.
 *
 * These PDFs have a two-column table layout where pdf-parse sometimes
 * concatenates entire table rows into a single line, so we scan the
 * full raw text and split on grade-level code tokens (e.g. "4-1a .").
 */
function extractJumpstartPIs(rawText) {
  // Split the text on every occurrence of a benchmark code like "4-1a ." or "12-3c."
  // Regex: digit(s) - digit(s) letter  optionally followed by space and period
  const SPLIT_RE = /(?=\d{1,2}-\d+[a-z]\s*\.)/g;
  const chunks = rawText.split(SPLIT_RE);

  const results = [];
  for (const chunk of chunks) {
    const m = chunk.match(/^\d{1,2}-\d+[a-z]\s*\.?\s{1,}(.+)/s);
    if (!m) continue;

    // The text after the code may contain another benchmark code embedded
    // (when the table rows got concatenated). Strip from the next code onward.
    let text = m[1]
      .replace(/\d{1,2}-\d+[a-z]\s*\.?.*$/s, "") // cut at next embedded code
      .replace(/\s+/g, " ")
      .replace(/\s*\.\s*$/, "")
      .trim();

    if (text.length >= 15 && text.length <= 300 && /[a-z]/.test(text) && !ARTEFACT_RE.test(text)) {
      results.push(text);
    }
  }
  return results;
}

// Lines that are section headers or boilerplate — filter from results
const HEADER_RE = /^Performance Indicators?:\s*$/i;
// Corrupted OCR / font-encoding artefacts found in Jump$tart PDFs
const ARTEFACT_RE = /\d+Ster|\bED3\b|23Ster/;

/**
 * Extract all PIs from the raw text of one DECA PI PDF.
 * Returns an array of clean PI text strings (no code/level tags).
 */
function extractPIs(rawText) {
  const normalized = rawText.replace(/\r\n/g, "\n").replace(/\f/g, "\n");
  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results = [];
  let pending = null; // holds partial first line of a wrapped PI

  for (const line of lines) {
    if (pending !== null) {
      // Try to complete the pending partial line
      const combined = pending + " " + line;
      const m = combined.match(COMPLETE_PI_RE);
      if (m) {
        results.push(m[1].trim());
        pending = null;
        continue;
      }
      // If still no match after combining, discard the pending fragment
      pending = null;
    }

    const m = line.match(COMPLETE_PI_RE);
    if (m) {
      results.push(m[1].trim());
      continue;
    }

    // Check if this looks like the start of a wrapped PI:
    // — contains at least one verb-like word (lowercase), no trailing tag yet,
    //   and is at least 10 chars long, and is not a section header
    if (
      line.length >= 10 &&
      /[a-z]/.test(line) &&
      !TRAILING_TAG_RE.test(line) &&
      !HEADER_RE.test(line)
    ) {
      pending = line;
    }
  }

  // Filter out section header lines and artefacts that leaked through
  const clean = results.filter((t) => !HEADER_RE.test(t) && !ARTEFACT_RE.test(t));

  // If the standard DECA format found nothing, try Jump$tart / National Standards format
  if (clean.length === 0) {
    return extractJumpstartPIs(normalized);
  }

  return clean;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(PDF_DIR)) {
    console.error(`PDF directory not found: ${PDF_DIR}`);
    process.exit(1);
  }

  const pdfFiles = fs
    .readdirSync(PDF_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    console.error(`No PDF files found in ${PDF_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${pdfFiles.length} PDF(s) to process.\n`);

  const allPIs = [];

  for (const filename of pdfFiles) {
    const filepath = path.join(PDF_DIR, filename);
    const cluster = clusterFromFilename(filename);

    console.log(`Processing: ${filename} → cluster "${cluster}"`);

    const buffer = fs.readFileSync(filepath);
    let parsed;
    try {
      parsed = await pdfParse(buffer);
    } catch (err) {
      console.error(`  ERROR parsing ${filename}: ${err.message}`);
      continue;
    }

    const piTexts = extractPIs(parsed.text);
    console.log(`  Extracted ${piTexts.length} performance indicators.`);

    for (const text of piTexts) {
      const cleaned = text.replace(/\s+/g, " ").trim();
      if (cleaned.length < 10) continue;

      allPIs.push({
        id: crypto.randomUUID(),
        text: cleaned,
        cluster,
        events: [],
      });
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPIs, null, 2), "utf8");
  console.log(`\nDone. ${allPIs.length} total PIs written to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
