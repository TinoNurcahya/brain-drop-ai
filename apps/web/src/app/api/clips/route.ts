import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const clip = {
      id: crypto.randomUUID(),
      text: body.text,
      sourceUrl: body.sourceUrl,
      sourceTitle: body.sourceTitle || "Untitled",
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
    };

    // TODO: Save to Firestore via @braindrop/core
    console.log("Clip received:", clip);

    return NextResponse.json(
      { success: true, clip },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create clip:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create clip" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO: Fetch clips from Firestore
  return NextResponse.json({ clips: [], total: 0 });
}
