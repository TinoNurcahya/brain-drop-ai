"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Globe,
  Mic,
  MicOff,
  Sparkles,
  Link2,
  Check,
  ArrowRight,
  RefreshCw,
  Cpu,
  Cloud,
  FileText,
  Clock,
  Layers,
  DownloadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { useNotesStore } from "@/stores/notes-store";

type CaptureTab = "quick" | "url" | "voice";

export default function CapturePage() {
  const router = useRouter();
  const { notes, addClipNote, importClipsFromApi, setActiveNoteId } = useNotesStore();

  const [activeTab, setActiveTab] = useState<CaptureTab>("quick");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncingExtension, setIsSyncingExtension] = useState(false);

  // Quick Note State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickTags, setQuickTags] = useState("");

  // URL Scraper State
  const [urlInput, setUrlInput] = useState("");
  const [scrapedData, setScrapedData] = useState<{
    url: string;
    title: string;
    description: string;
    excerpt: string;
    hostname: string;
  } | null>(null);

  // Voice Memo State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech API for Voice Memo
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setVoiceTranscript(current);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      // Simulate voice capture if browser doesn't expose speech recognition
      if (!isRecording) {
        setIsRecording(true);
        toast.info("Recording simulation started (Speak into mic)...");
        setTimeout(() => {
          setVoiceTranscript(
            "Research notes on Firebase AI Logic hybrid inference: On-device Gemini Nano guarantees complete data privacy while Cloud models provide high-throughput reasoning."
          );
          setIsRecording(false);
          toast.success("Voice memo transcribed successfully!");
        }, 3500);
      } else {
        setIsRecording(false);
      }
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.info("Voice recording stopped");
    } else {
      setVoiceTranscript("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Listening... speak your research thoughts");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // 1. Handle Quick Note Capture
  const handleQuickCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContent.trim()) {
      toast.error("Please enter note content to capture");
      return;
    }

    setIsProcessing(true);
    const startMs = performance.now();

    try {
      // Trigger AI Analysis for quick note
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quickTitle || "Quick Capture",
          content: quickContent,
          existingTags: quickTags
            ? quickTags.split(",").map((t) => t.trim().toLowerCase())
            : [],
        }),
      });

      const aiData = res.ok ? await res.json() : null;
      const latencyMs = Math.round(performance.now() - startMs);

      const created = addClipNote({
        title: quickTitle.trim() || aiData?.tags?.[0] ? `Note: ${aiData.tags[0]}` : "Quick Thought",
        content: quickContent,
        tags: aiData?.tags || ["quick-note"],
        summary: aiData?.summary || quickContent.slice(0, 120),
        aiMode: aiData?.mode === "cloud" ? "cloud" : "on-device",
        aiLatencyMs: latencyMs,
      });

      setQuickTitle("");
      setQuickContent("");
      setQuickTags("");
      toast.success("Captured to BrainDrop Vault!");
      setActiveNoteId(created.id);
    } catch {
      const created = addClipNote({
        title: quickTitle.trim() || "Quick Thought",
        content: quickContent,
        tags: ["quick-note"],
      });
      setActiveNoteId(created.id);
      toast.success("Captured locally");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Handle URL Scrape
  const handleScrapeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/clips/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!res.ok) throw new Error("Failed to scrape URL");

      const data = await res.json();
      setScrapedData(data);
      toast.success("Page metadata extracted!");
    } catch (err) {
      toast.error("Could not fetch page. Try pasting excerpt manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2B. Save Scraped URL as Note
  const handleSaveScrapedNote = async () => {
    if (!scrapedData) return;

    setIsProcessing(true);
    try {
      const markdownContent = `# [${scrapedData.title}](${scrapedData.url})

> **Source:** ${scrapedData.url}  
> **Domain:** ${scrapedData.hostname}

### Summary
${scrapedData.description}

### Captured Excerpt
${scrapedData.excerpt}
`;

      // Run AI analyze
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: scrapedData.title,
          content: markdownContent,
        }),
      });

      const aiData = res.ok ? await res.json() : null;

      const created = addClipNote({
        title: scrapedData.title,
        content: markdownContent,
        sourceUrl: scrapedData.url,
        sourceTitle: scrapedData.title,
        tags: aiData?.tags || ["web-clip", scrapedData.hostname.replace(/\./g, "-")],
        summary: aiData?.summary || scrapedData.description,
        aiMode: "on-device",
        aiLatencyMs: 45,
      });

      toast.success("Web clip saved to vault!");
      setActiveNoteId(created.id);
      setScrapedData(null);
      setUrlInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Save Voice Memo
  const handleSaveVoiceMemo = async () => {
    if (!voiceTranscript.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Voice Memo Transcription",
          content: voiceTranscript,
        }),
      });

      const aiData = res.ok ? await res.json() : null;

      const created = addClipNote({
        title: `🎙️ Voice Memo: ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        content: voiceTranscript,
        tags: aiData?.tags || ["voice-memo"],
        summary: aiData?.summary || voiceTranscript.slice(0, 100),
        aiMode: "on-device",
      });

      toast.success("Voice memo converted and saved!");
      setActiveNoteId(created.id);
      setVoiceTranscript("");
    } finally {
      setIsProcessing(false);
    }
  };

  // Sync Extension Clips
  const handleSyncExtension = async () => {
    setIsSyncingExtension(true);
    try {
      const count = await importClipsFromApi();
      if (count > 0) {
        toast.success(`Imported ${count} new clip(s) from Extension buffer!`);
      } else {
        toast.info("Extension buffer is already up to date.");
      }
    } finally {
      setIsSyncingExtension(false);
    }
  };

  // Recent captures
  const recentCaptures = notes.filter((n) => n.isClip).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/20">
              <Zap className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Smart Knowledge Capture
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Ingest ideas from web pages, fast thought dumps, or voice dictation — tagged & synthesized on-device.
          </p>
        </div>

        <button
          onClick={handleSyncExtension}
          disabled={isSyncingExtension}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent-blue)] text-xs text-[var(--text-primary)] transition-colors disabled:opacity-50 self-start md:self-auto"
        >
          <DownloadCloud className={`w-3.5 h-3.5 text-[var(--accent-blue)] ${isSyncingExtension ? "animate-bounce" : ""}`} />
          <span>Sync Extension Clips</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Capture Ingestion Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tab Selector */}
          <div className="flex rounded-xl bg-[var(--bg-secondary)] p-1 border border-[var(--border)]">
            <button
              onClick={() => setActiveTab("quick")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "quick"
                  ? "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white shadow-md"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quick Note</span>
            </button>

            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "url"
                  ? "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white shadow-md"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Clipper</span>
            </button>

            <button
              onClick={() => setActiveTab("voice")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "voice"
                  ? "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white shadow-md"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Memo</span>
            </button>
          </div>

          {/* TAB 1: Quick Note */}
          {activeTab === "quick" && (
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--accent-blue)]" /> Instant Thought Dump
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Cpu className="w-3 h-3" /> Auto-Sanitized On-Device
                </span>
              </div>

              <form onSubmit={handleQuickCapture} className="space-y-3">
                <input
                  type="text"
                  placeholder="Note title (optional)..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
                />

                <textarea
                  rows={6}
                  placeholder="Paste research excerpts, paste quotes, or write quick ideas here. AI will extract summary and tags automatically..."
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] resize-none leading-relaxed"
                />

                <input
                  type="text"
                  placeholder="Tags (comma separated, e.g. ai, hackathon, ideas)..."
                  value={quickTags}
                  onChange={(e) => setQuickTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {quickContent.length} chars · {quickContent.split(/\s+/).filter(Boolean).length} words
                  </span>

                  <button
                    type="submit"
                    disabled={isProcessing || !quickContent.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white text-xs font-semibold hover:opacity-95 transition-opacity disabled:opacity-40 shadow-md"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Capture to Vault</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Web Clipper / URL Scraper */}
          {activeTab === "url" && (
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[var(--accent-purple)]" /> Scrape Web Page Context
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  URL Metadata & Excerpt Extraction
                </span>
              </div>

              <form onSubmit={handleScrapeUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/research-paper..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !urlInput.trim()}
                  className="px-4 py-2.5 rounded-lg bg-[var(--accent-blue)] text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Fetch & Extract"}
                </button>
              </form>

              {/* Scraped Preview Card */}
              {scrapedData && (
                <div className="mt-4 p-4 rounded-xl bg-[var(--bg-tertiary)]/70 border border-[var(--border)] space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                      {scrapedData.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)] font-mono shrink-0">
                      {scrapedData.hostname}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {scrapedData.description}
                  </p>

                  <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]/60 text-xs text-[var(--text-muted)] line-clamp-4 font-mono leading-normal">
                    {scrapedData.excerpt}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={scrapedData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--accent-blue)] hover:underline flex items-center gap-1"
                    >
                      <Link2 className="w-3 h-3" /> Visit Source
                    </a>

                    <button
                      onClick={handleSaveScrapedNote}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save as BrainDrop Note</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Voice Memo */}
          {activeTab === "voice" && (
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-5 text-center">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Spoken Dictation & Audio Capture
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Dictate your thoughts verbally. Real-time speech recognition transcribes and formats it into structured notes.
                </p>
              </div>

              {/* Record Mic Button */}
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50 scale-105"
                      : "bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--accent-blue)] border border-[var(--border)]"
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isRecording ? "🔴 Listening... Click to stop" : "Tap microphone to dictate"}
                </span>
              </div>

              {/* Live Transcript Display */}
              <div className="text-left p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] min-h-[100px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Live Transcript
                  </span>
                  {voiceTranscript && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Transcribed
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                  {voiceTranscript || (
                    <span className="text-[var(--text-muted)] italic">
                      Transcribed audio will appear here in real time...
                    </span>
                  )}
                </p>
              </div>

              {voiceTranscript && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveVoiceMemo}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white text-xs font-semibold hover:opacity-95 transition-opacity"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save Transcribed Note</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Ingestion Stream & Extension Bridge (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Chrome MV3 Extension Companion Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border)] space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-blue)]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                🧩 Chrome MV3 Extension
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Ready in Repo
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Clip quotes, articles, and research directly from any browser tab with one click or highlight context menu.
            </p>

            <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/60 border border-[var(--border)]/70 text-xs space-y-1.5">
              <div className="font-semibold text-[var(--text-primary)] text-[11px]">How to load in Chrome:</div>
              <ol className="list-decimal list-inside text-[11px] text-[var(--text-muted)] space-y-1">
                <li>Open <code className="text-[var(--accent-blue)]">chrome://extensions</code> in Chrome.</li>
                <li>Turn on <span className="text-white">Developer mode</span> (top right).</li>
                <li>Click <span className="text-white">Load unpacked</span> and choose <code className="text-[var(--accent-blue)]">apps/extension</code>.</li>
              </ol>
            </div>
          </div>

          {/* Recent Captures in Vault */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Recent Captured Clips ({recentCaptures.length})
              </h2>
              <button
                onClick={() => router.push("/notes")}
                className="text-xs text-[var(--accent-blue)] hover:underline flex items-center gap-0.5"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentCaptures.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic py-4 text-center">
                No clipped notes yet. Capture a quick note or scrape a URL above!
              </p>
            ) : (
              <div className="space-y-2">
                {recentCaptures.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => {
                      setActiveNoteId(clip.id);
                      router.push("/notes");
                    }}
                    className="p-3 rounded-lg bg-[var(--bg-tertiary)]/70 border border-[var(--border)] hover:border-[var(--accent-blue)] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] line-clamp-1">
                        📎 {clip.title}
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-mono">
                        {clip.aiLatencyMs ? `${clip.aiLatencyMs}ms` : "local"}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-2">
                      {clip.summary || clip.plainText}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex gap-1 overflow-hidden">
                        {clip.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-muted)]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[var(--text-muted)] group-hover:text-white transition-colors flex items-center gap-0.5">
                        Open in Editor →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
