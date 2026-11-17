"use client";

const STATS = {
  totalNotes: 47,
  totalClips: 32,
  totalFlashcards: 28,
  totalConnections: 19,
  onDeviceOps: 156,
  cloudOps: 23,
  bytesKeptLocal: 284672,
  avgOnDeviceLatency: 52,
  avgCloudLatency: 834,
};

const TOPIC_DATA = [
  { topic: "Firebase", count: 12, color: "var(--accent-amber)" },
  { topic: "React", count: 9, color: "var(--accent-blue)" },
  { topic: "TypeScript", count: 8, color: "var(--accent-purple)" },
  { topic: "AI/ML", count: 7, color: "var(--accent-emerald)" },
  { topic: "Privacy", count: 5, color: "var(--accent-rose)" },
  { topic: "Other", count: 6, color: "var(--text-muted)" },
];

const ACTIVITY_DAYS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  clips: Math.floor(Math.random() * 5),
}));

export default function DashboardPage() {
  const totalTopics = TOPIC_DATA.reduce((s, t) => s + t.count, 0);
  const privacyRatio = Math.round(
    (STATS.onDeviceOps / (STATS.onDeviceOps + STATS.cloudOps)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">📊 Research Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">Your knowledge at a glance</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm glass hover:border-[var(--border-hover)]">
          📥 Export All Notes (MD)
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Notes", value: STATS.totalNotes, icon: "📝", color: "blue" },
          { label: "Web Clips", value: STATS.totalClips, icon: "📎", color: "purple" },
          { label: "Flashcards", value: STATS.totalFlashcards, icon: "🃏", color: "amber" },
          { label: "Connections", value: STATS.totalConnections, icon: "🔗", color: "emerald" },
        ].map((stat) => (
          <div key={stat.label} className={`glass rounded-xl p-5 glow-${stat.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold text-[var(--accent-${stat.color})]`}>
                {stat.value}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Privacy Telemetry */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">🔒 Privacy Telemetry</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">On-Device Operations</span>
                <span className="font-mono text-[var(--accent-emerald)]">{STATS.onDeviceOps}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-emerald)]"
                  style={{ width: `${privacyRatio}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">Cloud Operations</span>
                <span className="font-mono text-[var(--accent-blue)]">{STATS.cloudOps}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-blue)]"
                  style={{ width: `${100 - privacyRatio}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Privacy Ratio</span>
                <span className="font-bold text-[var(--accent-emerald)]">{privacyRatio}%</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {privacyRatio}% of all AI operations ran locally on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Latency Comparison */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">⚡ Latency Comparison</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">On-Device (Nano 4)</span>
                <span className="font-mono text-sm text-[var(--accent-emerald)]">{STATS.avgOnDeviceLatency}ms</span>
              </div>
              <div className="h-8 rounded-lg bg-[var(--bg-tertiary)] relative overflow-hidden">
                <div
                  className="h-full rounded-lg bg-[var(--accent-emerald)]/20 border border-[var(--accent-emerald)]/30 flex items-center px-3"
                  style={{ width: `${(STATS.avgOnDeviceLatency / STATS.avgCloudLatency) * 100}%` }}
                >
                  <span className="text-xs font-mono text-[var(--accent-emerald)]">
                    {STATS.avgOnDeviceLatency}ms
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">Cloud (Flash)</span>
                <span className="font-mono text-sm text-[var(--accent-blue)]">{STATS.avgCloudLatency}ms</span>
              </div>
              <div className="h-8 rounded-lg bg-[var(--bg-tertiary)] relative overflow-hidden">
                <div
                  className="h-full rounded-lg bg-[var(--accent-blue)]/20 border border-[var(--accent-blue)]/30 flex items-center px-3"
                  style={{ width: "100%" }}
                >
                  <span className="text-xs font-mono text-[var(--accent-blue)]">
                    {STATS.avgCloudLatency}ms
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              On-device inference is <strong className="text-[var(--accent-emerald)]">{Math.round(STATS.avgCloudLatency / STATS.avgOnDeviceLatency)}x faster</strong> than cloud.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Distribution */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">🏷️ Topic Distribution</h2>
          <div className="space-y-3">
            {TOPIC_DATA.map((topic) => (
              <div key={topic.topic} className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: topic.color }}
                />
                <span className="text-sm text-[var(--text-secondary)] flex-1">{topic.topic}</span>
                <div className="w-32 h-2 rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(topic.count / totalTopics) * 100}%`, background: topic.color }}
                  />
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] w-6 text-right">
                  {topic.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">📅 Clip Activity (Last 30 Days)</h2>
          <div className="grid grid-cols-10 gap-1.5">
            {ACTIVITY_DAYS.map((day) => (
              <div
                key={day.day}
                className="aspect-square rounded-sm"
                style={{
                  background:
                    day.clips === 0
                      ? "var(--bg-tertiary)"
                      : `rgba(79, 143, 247, ${0.2 + day.clips * 0.2})`,
                }}
                title={`Day ${day.day}: ${day.clips} clips`}
              />
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[10px] text-[var(--text-muted)]">Less</span>
            {[0.1, 0.3, 0.5, 0.7, 1].map((opacity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ background: `rgba(79, 143, 247, ${opacity})` }}
              />
            ))}
            <span className="text-[10px] text-[var(--text-muted)]">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
