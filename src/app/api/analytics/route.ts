import { NextRequest, NextResponse } from "next/server";
import { analyticsApi } from "@/lib/insforge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, page, metadata } = body;

    if (!eventType || !page) {
      return NextResponse.json(
        { error: "eventType and page are required" },
        { status: 400 },
      );
    }

    // Track via InSForge
    await analyticsApi.track({ eventType, page, metadata });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    // Don't fail the request if analytics tracking fails
    return NextResponse.json({ success: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token =
      request.cookies.get("admin_token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await analyticsApi.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
