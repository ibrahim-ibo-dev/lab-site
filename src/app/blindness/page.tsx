"use client";
import ExperimentHeader from "@/components/ExperimentHeader";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const BlindnessCanvas = dynamic(() => import("@/components/SelectiveBlindness"), { ssr: false });

export default function BlindnessPage() {
  const [hint, setHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setHint(false), 5000); return () => clearTimeout(t); }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white">
      <ExperimentHeader title="Selective Blindness"/>
      <div className="flex-1 relative overflow-hidden">
        <BlindnessCanvas />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-opacity duration-1000" style={{ opacity: hint ? 1 : 0 }}>
          <div className="px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/[0.06] text-center">
            <p className="text-[10px] font-mono text-white/30 tracking-wider uppercase">move your mouse — play with the light</p>
            <p className="text-[10px] font-mono text-white/15 tracking-wider uppercase mt-1">sweep fast to reveal what you&apos;ve been missing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
