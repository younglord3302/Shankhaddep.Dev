import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

const INSFORGE_BASE_URL =
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  "https://v96ifskx.ap-southeast.insforge.app";
const INSFORGE_API_KEY =
  process.env.NEXT_PUBLIC_INSFORGE_API_KEY || process.env.INSFORGE_API_KEY || "";

function getAdminClient() {
  return createClient({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_API_KEY,
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...payload } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing profile ID" }, { status: 400 });
    }

    const client = getAdminClient();
    const { data, error } = await client.database
      .from("profile")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) {
      console.error("InsForge update error:", error);
      return NextResponse.json({ error: error.message || JSON.stringify(error) }, { status: 500 });
    }

    return NextResponse.json({ profile: Array.isArray(data) ? data[0] : data });
  } catch (err: any) {
    console.error("Profile PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
