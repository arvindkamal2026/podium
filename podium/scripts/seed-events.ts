import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DECA_EVENTS } from "../data/events";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function seedEvents() {
  console.log(`Seeding ${DECA_EVENTS.length} events...`);

  const batch = db.batch();
  for (const event of DECA_EVENTS) {
    const { id, ...data } = event;
    batch.set(db.collection("events").doc(id), data);
  }

  await batch.commit();
  console.log(`✓ Seeded ${DECA_EVENTS.length} events`);
}

seedEvents().catch(console.error);
