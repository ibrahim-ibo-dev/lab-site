"use client";
import ExperimentHeader from "@/components/ExperimentHeader";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ButterflyCanvas = dynamic(() => import("@/components/ButterflyEffect"), { ssr: false });

export default function ButterflyPage() {
  const [hint, setHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setHint(false), 5000); return () => clearTimeout(t); }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-primary text-white">
      <ExperimentHeader title="The Butterfly Effect"/>
      <div className="flex-1 relative overflow-hidden">
        <ButterflyCanvas />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-opacity duration-1000" style={{ opacity: hint ? 1 : 0 }}>
          <div className="px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.07] text-center">
            <p className="text-[10px] font-mono text-white/35 tracking-wider uppercase">click any dot to send a ripple through the universe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
