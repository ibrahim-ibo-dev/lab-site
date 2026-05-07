"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const WeightCanvas = dynamic(() => import("@/components/WeightOfThePast"), { ssr: false });

export default function WeightPage() {
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-primary text-white">
      {/* Nav */}
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
            The Weight of the Past
          </span>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="overline text-green-400/70">Live</span>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <WeightCanvas />

        {/* Hints */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center gap-3 transition-opacity duration-1000"
          style={{ opacity: hint ? 1 : 0 }}
        >
          <div className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/[0.07]">
            <p className="text-[10px] font-mono text-white/35 tracking-wider uppercase">
              move fast — feel the weight
            </p>
            <p className="text-[10px] font-mono text-white/25 tracking-wider uppercase">
              stop — let go
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
