import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

const INSFORGE_BASE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  "https://v96ifskx.ap-southeast.insforge.app";
const INSFORGE_API_KEY =
  process.env.NEXT_PUBLIC_INSFORGE_API_KEY || "";

async function getResumeUrl(): Promise<string | null> {
  try {
    const client = createClient({
      baseUrl: INSFORGE_BASE_URL,
      anonKey: INSFORGE_API_KEY,
    });
    const { data } = await client.database
      .from("profile")
      .select("resume_url")
      .limit(1)
      .single();
    return data?.resume_url || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const resumeUrl = await getResumeUrl();

  if (!resumeUrl) {
    return NextResponse.json(
      { error: "No resume uploaded yet. Please upload your resume in the Admin Profile Options tab." },
      { status: 404 }
    );
  }

  try {
    const pdfRes = await fetch(resumeUrl, { cache: "no-store" });

    if (!pdfRes.ok) {
      console.error(`Failed to fetch PDF. URL: ${resumeUrl}, Status: ${pdfRes.status}`);
      return NextResponse.json(
        { error: `Cannot access resume file (HTTP ${pdfRes.status}). Please re-upload your resume in Profile Options.` },
        { status: 502 }
      );
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Shankhadeep_Resume.pdf"',
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("Download proxy error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
