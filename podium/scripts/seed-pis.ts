import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { PERFORMANCE_INDICATORS } from "../data/performance-indicators";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function seedPIs() {
  const grouped = PERFORMANCE_INDICATORS.reduce(
    (acc, pi) => {
      if (!acc[pi.eventId]) acc[pi.eventId] = [];
      acc[pi.eventId].push(pi);
      return acc;
    },
    {} as Record<string, typeof PERFORMANCE_INDICATORS>
  );

  for (const [eventId, pis] of Object.entries(grouped)) {
    console.log(`Seeding ${pis.length} PIs for ${eventId}...`);
    const batch = db.batch();
    for (const pi of pis) {
      const { id, ...data } = pi;
      batch.set(
        db.collection("events").doc(eventId).collection("performanceIndicators").doc(id),
        data
      );
    }
    await batch.commit();
  }

  console.log(`✓ Seeded ${PERFORMANCE_INDICATORS.length} PIs across ${Object.keys(grouped).length} events`);
}

seedPIs().catch(console.error);
