"use client";
import ExperimentHeader from "@/components/ExperimentHeader";

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
      <ExperimentHeader title="The Weight of the Past"/>

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
