import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { parsePdfText } from "@/lib/parsers/pdf-questions";

// Ensure Node.js runtime — pdf-parse requires it (not compatible with Edge)
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Auth: verify session cookie (same pattern as Server Actions)
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await getAdminAuth().verifySessionCookie(session, true);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Convert to Buffer
  const arrayBuffer = await (file as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Run pdf-parse
  // Using the lib path avoids pdf-parse's test-file resolution issue in Next.js
  let pdfText: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdfParse(buffer);
    pdfText = data.text as string;
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't parse this PDF — make sure it's a text-based PDF with questions in A/B/C/D format and an answer key.",
      },
      { status: 422 }
    );
  }

  // Extract questions
  const result = parsePdfText(pdfText);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ questions: result.questions });
}
