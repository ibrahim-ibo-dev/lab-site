"use client";
import ExperimentHeader from "@/components/ExperimentHeader";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const HorizonCanvas = dynamic(() => import("@/components/EndlessHorizon"), { ssr: false });

export default function HorizonPage() {
  const [hint, setHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setHint(false), 4500); return () => clearTimeout(t); }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white">
      <ExperimentHeader title="The Endless Horizon"/>
      <div className="flex-1 relative overflow-hidden">
        <HorizonCanvas />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-opacity duration-1000" style={{ opacity: hint ? 1 : 0 }}>
          <div className="px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.07] text-center">
            <p className="text-[10px] font-mono text-white/35 tracking-wider uppercase">chase the diamond — watch the world bloom</p>
            <p className="text-[10px] font-mono text-white/20 tracking-wider uppercase mt-1">but you&apos;ll never reach it</p>
          </div>
        </div>
      </div>
    </div>
  );
}
