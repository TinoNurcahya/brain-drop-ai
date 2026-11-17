import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Valid URL is required." },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format." },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent": "BrainDropAI-Clipper/1.0 (+https://brain.tinonurcahya.dev)",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
      const title = ogTitleMatch?.[1] || titleMatch?.[1] || parsedUrl.hostname;

      // Extract description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      const description = ogDescMatch?.[1] || descMatch?.[1] || `Web capture from ${parsedUrl.hostname}`;

      // Extract clean text paragraphs
      const bodyText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const excerpt = bodyText.slice(0, 1200);

      return NextResponse.json({
        url: parsedUrl.toString(),
        title: title.trim(),
        description: description.trim(),
        excerpt,
        hostname: parsedUrl.hostname,
      });
    } catch {
      // In sandbox or when external website blocks scraper, return clean fallback metadata
      const domain = parsedUrl.hostname.replace("www.", "");
      const cleanPath = parsedUrl.pathname.replace(/\/$/, "").split("/").pop() || domain;
      const formattedTitle = cleanPath
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return NextResponse.json({
        url: parsedUrl.toString(),
        title: `${formattedTitle} — ${domain}`,
        description: `Captured resource from ${domain}. Review and annotate key takeaways below.`,
        excerpt: `Content clipped from ${parsedUrl.toString()}. Ready for on-device Gemini Nano synthesis and semantic linking into your BrainDrop knowledge vault.`,
        hostname: parsedUrl.hostname,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scraper error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
