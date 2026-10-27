export interface Experiment {
  num: string;
  slug: string | null;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: "live" | "building" | "concept";
}

export const experiments: Experiment[] = [
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
