import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="font-mono text-xs text-[var(--spatial-amber,#E8A838)] uppercase tracking-wider mb-3">
        404 // Coordinate Out of Bounds
      </span>
      <h1 className="text-4xl sm:text-5xl font-serif text-[var(--text-primary,#EDF3F5)] mb-4">
        Void Detected
      </h1>
      <p className="text-[var(--text-muted,#8C9EAA)] max-w-md mb-8">
        The neural coordinate or note fragment you are looking for does not exist in the active knowledge topology.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8A838] text-[#08090D] font-medium text-sm hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={16} /> Return to Universe
      </Link>
    </div>
  );
}
