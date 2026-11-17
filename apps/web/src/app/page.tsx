export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-blue)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-purple)]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)] pulse-dot" />
              <span className="text-[var(--text-secondary)]">Built for</span>
              <span className="font-semibold gradient-text">#BuildHybridAI 2026</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-[var(--text-primary)]">Capture anything.</span>
              <span className="block gradient-text">Forget nothing.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed">
              Your second brain that clips, tags, links, and visualizes your research —{" "}
              <span className="text-[var(--accent-emerald)] font-medium">
                all on-device, all private
              </span>
              . Cloud AI steps in only when you need deep synthesis.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/notes"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent-blue)]/25"
              >
                Start Capturing →
              </a>
              <a
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl glass text-[var(--text-primary)] font-medium text-base hover:border-[var(--border-hover)] transition-colors"
              >
                View Demo Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Privacy-first AI that processes your knowledge on-device — cloud only when needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "✂️",
              title: "Clip from Anywhere",
              description: "Highlight text on any webpage → one-click save to BrainDrop. Chrome Extension captures context, URL, and metadata automatically.",
              badge: "Extension",
              color: "blue",
            },
            {
              icon: "🏷️",
              title: "AI Auto-Tagging",
              description: "Gemini Nano 4 tags and categorizes your clips instantly on-device. Your content never leaves your browser.",
              badge: "On-Device",
              color: "emerald",
            },
            {
              icon: "🔗",
              title: "Smart Linking",
              description: "AI discovers connections between your notes. Watch your knowledge graph grow as relationships emerge.",
              badge: "On-Device",
              color: "emerald",
            },
            {
              icon: "🧪",
              title: "Deep Synthesis",
              description: "Select multiple notes → Gemini 3.8 Flash weaves them into a comprehensive research brief with citations.",
              badge: "Cloud",
              color: "blue",
            },
            {
              icon: "🃏",
              title: "Flashcard Generation",
              description: "Turn any note into study flashcards. AI extracts key concepts and creates Q&A pairs for spaced repetition.",
              badge: "Cloud",
              color: "blue",
            },
            {
              icon: "🔒",
              title: "Privacy Telemetry",
              description: "Real-time dashboard shows exactly what runs on-device vs cloud. PII is auto-redacted before any cloud request.",
              badge: "Hybrid",
              color: "purple",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 glow-${feature.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{feature.icon}</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    feature.color === "emerald"
                      ? "bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
                      : feature.color === "blue"
                      ? "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]"
                      : "bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]"
                  }`}
                >
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Hybrid AI Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* On-Device */}
            <div className="rounded-xl bg-[var(--accent-emerald)]/5 border border-[var(--accent-emerald)]/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[var(--accent-emerald)]" />
                <h3 className="font-semibold text-[var(--accent-emerald)]">On-Device</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">Gemini Nano 4 • ~50ms • FREE</p>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>✓ Auto-tag clips</li>
                <li>✓ Quick summarize</li>
                <li>✓ Semantic search</li>
                <li>✓ Smart linking</li>
                <li>✓ PII detection</li>
              </ul>
            </div>

            {/* Router */}
            <div className="rounded-xl bg-[var(--accent-purple)]/5 border border-[var(--accent-purple)]/20 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-[var(--accent-purple)] mb-2">Hybrid Router</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Firebase AI Logic routes each task to the best model. Privacy-sensitive tasks always stay on-device.
              </p>
              <div className="mt-4 text-xs text-[var(--text-muted)]">
                PII auto-redacted before cloud
              </div>
            </div>

            {/* Cloud */}
            <div className="rounded-xl bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[var(--accent-blue)]" />
                <h3 className="font-semibold text-[var(--accent-blue)]">Cloud Fallback</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">Gemini 3.8 Flash • ~650ms • Free tier</p>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>✓ Deep synthesis</li>
                <li>✓ Multi-doc analysis</li>
                <li>✓ Flashcard generation</li>
                <li>✓ Translation</li>
                <li>✓ Expand & elaborate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center text-xs text-[var(--text-muted)]">
        <p>
          Built with ❤️ by{" "}
          <a href="https://tinonurcahya.dev" className="text-[var(--accent-blue)] hover:underline">
            Tino Nurcahya
          </a>{" "}
          for{" "}
          <a href="https://firebasehybridaihackathon.devpost.com/" className="text-[var(--accent-purple)] hover:underline">
            #BuildHybridAI 2026
          </a>
        </p>
        <p className="mt-1">Firebase AI Logic • Gemini Nano 4 • Gemini 3.8 Flash</p>
      </footer>
    </div>
  );
}
