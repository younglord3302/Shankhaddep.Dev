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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = getAdminClient();
    const { data: result, error } = await client.database.from("projects").insert([data]).select();
    if (error) throw error;
    return NextResponse.json(result[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    
    const client = getAdminClient();
    const { data: result, error } = await client.database.from("projects").update(data).eq("id", id).select();
    if (error) throw error;
    return NextResponse.json(result[0]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const client = getAdminClient();
    const { error } = await client.database.from("projects").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
