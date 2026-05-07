"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const IllusionCanvas = dynamic(() => import("@/components/IllusionCanvas"), { ssr: false });

export default function IllusionPage() {
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-primary text-white">
      {/* Nav — matches archive-site exactly */}
      <header className="shrink-0 border-b border-border bg-primary/80 backdrop-blur-2xl shadow-card z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-subtle hover:text-white transition-all duration-400 ease-premium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>The Lab</span>
          </Link>

          <span className="overline text-accent/50">
            The Illusion of Opportunity
          </span>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="overline text-green-400/70">Live</span>
          </div>
        </div>
      </header>

      {/* Canvas — fills everything below the bar */}
      <div className="flex-1 relative overflow-hidden">
        <IllusionCanvas />

        {/* Fade-out interaction hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-1000 z-10"
          style={{ opacity: hint ? 1 : 0 }}
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.08]">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <span className="text-[10px] font-mono text-white/40 tracking-wider">
              move cursor toward a door
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
