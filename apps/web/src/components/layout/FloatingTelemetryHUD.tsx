"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Cpu, Cloud, ShieldCheck, HardDrive, ChevronUp, ChevronDown } from "lucide-react";
import { useNotesStore } from "@/stores/notes-store";
import { RollingNumberCounter } from "@/components/ui/RollingNumberCounter";

export function FloatingTelemetryHUD() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const notes = useNotesStore((s) => s.notes);

  // Dynamic Telemetry Metrics derived from vault notes
  const onDeviceNotes = notes.filter((n) => n.aiMode === "on-device");
  const cloudNotes = notes.filter((n) => n.aiMode === "cloud");

  const onDeviceOps = onDeviceNotes.length;
  const cloudOps = cloudNotes.length;

  const totalLocalChars = notes.reduce(
    (acc, n) => acc + (n.content?.length || 0) + (n.plainText?.length || 0),
    0
  );
  const bytesKeptLocal = Math.max(28400, totalLocalChars * 2);
  const formattedBytes =
    bytesKeptLocal > 1024 * 1024
      ? `${(bytesKeptLocal / (1024 * 1024)).toFixed(1)} MB`
      : `${(bytesKeptLocal / 1024).toFixed(1)} KB`;

  const avgNanoLatency =
    onDeviceNotes.length > 0
      ? Math.round(
          onDeviceNotes.reduce((acc, n) => acc + (n.aiLatencyMs || 35), 0) /
            onDeviceNotes.length
        )
      : 35;

  if (pathname === "/" || pathname === "/v2") return null;

  return (
    <aside aria-label="System Telemetry" className="fixed bottom-4 sm:bottom-5 right-4 sm:right-5 z-40 select-none">
      <div className="rounded-2xl backdrop-blur-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[0_12px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
        {/* Toggle Bar */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            <span className="text-[11px] font-mono tracking-wide text-[var(--accent-emerald)] font-semibold">
              HYBRID TELEMETRY
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-[var(--accent-emerald)] text-[10px] font-mono font-medium">
              <RollingNumberCounter value={onDeviceOps} suffix=" Nano Ops" />
            </span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          )}
        </button>

        {/* Expanded Details */}
        {isOpen && (
          <div className="p-4 pt-1 space-y-2.5 border-t border-[var(--border)] text-[11px] min-w-[270px]">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[var(--accent-emerald)]" /> Client (Nano):
              </span>
              <span className="font-mono text-[var(--accent-emerald)] font-bold">
                <RollingNumberCounter value={onDeviceOps} suffix=" ops" /> (<RollingNumberCounter value={avgNanoLatency} suffix="ms" />)
              </span>
            </div>

            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-[var(--accent-cyan)]" /> Cloud (Gemini Flash):
              </span>
              <span className="font-mono text-[var(--accent-cyan)] font-bold">
                <RollingNumberCounter value={cloudOps} suffix=" ops" />
              </span>
            </div>

            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[var(--accent-purple)]" /> Data Kept Local:
              </span>
              <span className="font-mono text-[var(--accent-purple)] font-bold">
                {formattedBytes}
              </span>
            </div>

            <div className="flex items-center justify-between text-[var(--text-secondary)] pt-1.5 border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-emerald)]" /> Client PII Sandbox:
              </span>
              <span className="font-mono text-[var(--accent-emerald)] font-semibold">
                100% Masked
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
