import { NextRequest, NextResponse } from "next/server";

interface ClipItem {
  id: string;
  text: string;
  sourceUrl?: string;
  sourceTitle: string;
  tags: string[];
  summary?: string;
  createdAt: string;
  userId: string;
}

// In-memory buffer for local development sync between Extension and Web App
const clipsBuffer: ClipItem[] = [
  {
    id: "clip-seed-1",
    text: "Chrome Built-in AI Prompt API enables zero-roundtrip inference directly inside browser service workers and client pages with Gemini Nano.",
    sourceUrl: "https://developer.chrome.com/docs/ai/built-in",
    sourceTitle: "Chrome Built-in AI Documentation",
    tags: ["chrome-ai", "gemini-nano", "api"],
    summary: "Built-in AI prompt API execution details for client pages.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userId: "local-user",
  },
  {
    id: "clip-seed-2",
    text: "Firebase AI Logic provides dynamic hybrid routing, falling back to Gemini 3.8 Flash whenever token windows or reasoning complexity exceed on-device constraints.",
    sourceUrl: "https://firebase.google.com/docs/ai",
    sourceTitle: "Firebase AI Logic Overview",
    tags: ["firebase", "hybrid-ai", "gemini-flash"],
    summary: "Dynamic hybrid inference switching between device and cloud models.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    userId: "local-user",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Clip text is required." },
        { status: 400 }
      );
    }

    const clip: ClipItem = {
      id: body.id || `clip-${Date.now()}`,
      text: body.text.trim(),
      sourceUrl: body.sourceUrl || "",
      sourceTitle: body.sourceTitle || "Web Clip",
      tags: Array.isArray(body.tags) ? body.tags : ["web-clip"],
      summary: body.summary || body.text.slice(0, 150) + "...",
      createdAt: new Date().toISOString(),
      userId: "local-user",
    };

    clipsBuffer.unshift(clip);

    return NextResponse.json(
      { success: true, clip, total: clipsBuffer.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create clip:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process clip" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    clips: clipsBuffer,
    total: clipsBuffer.length,
  });
}
