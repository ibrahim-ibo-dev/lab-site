"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════ */

interface Experiment {
  num: string;
  slug: string | null;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: "live" | "building" | "concept";
}

const experiments: Experiment[] = [
  {
    num: "01",
    slug: "illusion",
    title: "The Illusion of Opportunity",
    category: "Psychology",
    description:
      "10 doors, all open. Step closer — and watch them slam shut. A visceral simulation of how proximity to choice collapses it.",
    tags: ["Canvas API", "Lerp Physics", "Proximity Sensing"],
    status: "live",
  },
  {
    num: "02",
    slug: "weight",
    title: "The Weight of the Past",
    category: "Philosophy",
    description:
      "Move too fast and shadows chain to your soul. Stop, accept them, and finally move forward.",
    tags: ["Spring Physics", "Shadow Echoes", "Velocity Tracking"],
    status: "live",
  },
  {
    num: "03",
    slug: "horizon",
    title: "The Endless Horizon",
    category: "Mathematics",
    description:
      "The goal mathematically repels you. The faster you chase the unreachable, the more breathtaking the world becomes.",
    tags: ["Repulsion Math", "Aurora Canvas", "Atan2 Physics"],
    status: "live",
  },
  {
    num: "04",
    slug: "fragility",
    title: "The Fragility of Connection",
    category: "Emotion",
    description:
      "Building a crystalline bond requires extreme patience. One sudden movement shatters everything — a 3-second penalty enforces reflection.",
    tags: ["Velocity Tracking", "Shard Particles", "Breakage Math"],
    status: "live",
  },
  {
    num: "05",
    slug: "paradox",
    title: "The Paradox of Choice",
    category: "Cognitive Psychology",
    description:
      "Three calm choices. Approach one and it fractures into nine — then eighty-one. The only peace is to stop choosing.",
    tags: ["Exponential Spawning", "Repulsion Fields", "Swarm Physics"],
    status: "live",
  },
  {
    num: "06",
    slug: "echo",
    title: "The Echo Chamber",
    category: "Social Psychology",
    description:
      "Absorb only familiar shapes and your bubble thickens, darkens, traps you. A violent swipe is the only escape.",
    tags: ["Collision Detection", "Vector Reflection", "Opacity Physics"],
    status: "live",
  },
  {
    num: "07",
    slug: "blindness",
    title: "Selective Blindness",
    category: "Attention",
    description:
      "Your spotlight reveals addictive distractions. The truth is written in giant letters across the screen — but you can't see it.",
    tags: ["Canvas Masking", "destination-out", "Particle Bounce"],
    status: "live",
  },
  {
    num: "08",
    slug: "butterfly",
    title: "The Butterfly Effect",
    category: "Chaos Theory",
    description:
      "A silent grid of thousands of dots. One click sends a wave that warps the entire universe into breathtaking patterns.",
    tags: ["Wave Function", "Sin/Cos Displacement", "10k Dots Canvas"],
    status: "live",
  },
];

const STATUS_CONFIG = {
  live:     { dot: "bg-green-400",  ring: "ring-green-400/30",  label: "Live",     text: "text-green-400"  },
  building: { dot: "bg-amber-400",  ring: "ring-amber-400/30",  label: "Building", text: "text-amber-400"  },
  concept:  { dot: "bg-gray-500",   ring: "ring-gray-500/20",   label: "Concept",  text: "text-gray-500"   },
};

/* ══════════════════════════════════════════════
   Card
   ══════════════════════════════════════════════ */

function ExperimentCard({ exp, index }: { exp: Experiment; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const cfg = STATUS_CONFIG[exp.status];
  const isLive = exp.status === "live";

  const card = (
    <div
      className={`
        relative h-full rounded-2xl overflow-hidden group
        border transition-all duration-500
        ${isLive
          ? "border-accent/15 hover:border-accent/40 shadow-card hover:shadow-card-hover"
          : "border-white/[0.06] hover:border-white/[0.12] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
        }
      `}
      style={{ background: isLive ? "rgba(18,14,10,0.97)" : "rgba(13,13,22,0.92)" }}
    >
      {isLive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 rounded-full bg-accent/[0.04] blur-3xl" />
        </div>
      )}

      <div className="p-7 flex flex-col h-full min-h-[280px]">
        <div className="flex items-start justify-between mb-6">
          <span
            className="text-[4.5rem] font-bold leading-none select-none"
            style={{
              color: isLive ? "rgba(212,165,116,0.08)" : "rgba(255,255,255,0.04)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.04em",
            }}
          >
            {exp.num}
          </span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.ring} ring-1 bg-black/30 backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isLive ? "animate-pulse" : ""}`} />
            <span className={`text-[9px] font-mono uppercase tracking-widest ${cfg.text}`}>{cfg.label}</span>
          </div>
        </div>

        <p className="overline text-muted mb-2.5">{"// "}{exp.category}</p>

        <h2 className={`text-xl font-semibold leading-snug mb-3 transition-all duration-300 ${isLive ? "group-hover:text-accent" : ""}`}>
          {exp.title}
        </h2>

        <p className="text-sm text-muted leading-relaxed flex-1 mb-5">{exp.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {exp.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full bg-white/[0.04] border border-white/[0.06] text-subtle">
              {t}
            </span>
          ))}
        </div>

        {isLive ? (
          <div className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all duration-300">
            <span>Launch Experiment</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-subtle">
            <span>{"// "}{exp.status === "building" ? "In development" : "Concept phase"}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      {exp.slug ? (
        <Link href={`/${exp.slug}`} className="block h-full cursor-pointer">
          {card}
        </Link>
      ) : (
        <div className="opacity-55 cursor-not-allowed h-full">{card}</div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════ */

export default function LabPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <div className="min-h-screen bg-primary text-white selection:bg-accent/30 selection:text-white">
      {/* Nav — matches archive-site exactly */}
      <header className="sticky top-0 z-50 border-b border-border bg-primary/80 backdrop-blur-2xl shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="https://ibrahim-eng.dev"
            className="inline-flex items-center gap-2 text-sm text-subtle hover:text-white transition-all duration-400 ease-premium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Ibrahim&apos;s Portfolio</span>
          </a>
          <span className="overline text-accent/50">The Lab</span>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-accent-light/[0.03] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/12 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 relative z-10">
        {/* Hero */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20"
        >
          <div className="max-w-2xl">
            <span className="overline text-accent/60 block mb-5">{"// Code & Psychology"}</span>
            <h1
              className="font-bold tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              <span className="text-gradient">The Lab</span>
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-xl">
              Standalone interactive experiments where code becomes a mirror for human psychology.
              Each piece is a visceral, playable metaphor — not a demo, not a tutorial.
            </p>
            <div className="w-12 h-px bg-gradient-to-r from-accent to-accent-light mt-8" />
          </div>

          <div className="flex gap-8 mt-10">
            {[
              { value: `${experiments.length}`, label: "Experiments" },
              { value: `${experiments.filter(e => e.status === "live").length}`, label: "Live" },
              { value: `${experiments.filter(e => e.status === "building").length}`, label: "Building" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-gradient leading-none">{value}</p>
                <p className="text-xs font-mono text-subtle uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {experiments.map((exp, i) => (
            <ExperimentCard key={exp.num} exp={exp} index={i} />
          ))}
        </div>

          <div className="mt-16 sm:mt-20 pt-8 border-t border-border text-center">
            <p className="text-xs text-subtle font-mono">lab.ibrahim-eng.dev</p>
          </div>
        </div>
      </main>
    </div>
  );
}
