"use client";
import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  tx: number; ty: number; // target
  vx: number; vy: number;
  w: number; h: number;
  label: string;
  gen: number; // generation (0=original, 1=children…)
}

const LABELS = ["Choose", "Decide", "Pick", "Select", "Opt", "Go", "Take", "Try", "Want", "Need",
  "A", "B", "C", "I", "II", "III", "?", "✓", "×", "→"];

export default function ParadoxOfChoice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mxRef = useRef(0), myRef = useRef(0);
  const outsideRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W; canvas.height = H;
    let raf: number, time = 0;

    function makeNode(x: number, y: number, gen: number, scale: number): Node {
      const w = 110 * scale, h = 48 * scale;
      return { x, y, tx: x, ty: y, vx: 0, vy: 0, w, h,
        label: LABELS[Math.floor(Math.random() * LABELS.length)], gen };
    }

    function initNodes() {
      const s = [
        { x: W * 0.5, y: H * 0.3 },
        { x: W * 0.3, y: H * 0.65 },
        { x: W * 0.7, y: H * 0.65 },
      ];
      nodesRef.current = s.map(p => makeNode(p.x, p.y, 0, 1));
    }

    initNodes();

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mxRef.current = e.clientX - r.left;
      myRef.current = e.clientY - r.top;
      outsideRef.current = false;
    };
    const onMouseLeave = () => { outsideRef.current = true; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      mxRef.current = e.touches[0].clientX - r.left;
      myRef.current = e.touches[0].clientY - r.top;
    }, { passive: false });

    const ro = new ResizeObserver(() => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W; canvas.height = H;
      initNodes();
    });
    ro.observe(canvas);

    function tick() {
      time++;
      const mx = mxRef.current, my = myRef.current;
      const nodes = nodesRef.current;

      /* ── Reset if mouse outside ── */
      if (outsideRef.current && nodes.length > 3) {
        /* smoothly collapse back — just reinit */
        if (time % 4 === 0) {
          if (nodes.length > 3) nodesRef.current = nodes.slice(0, nodes.length - 1);
          if (nodesRef.current.length === 3) outsideRef.current = false;
        }
      }

      /* ── Proximity → multiply ── */
      if (!outsideRef.current && nodes.length < 180) {
        for (let i = nodes.length - 1; i >= 0; i--) {
          const n = nodes[i];
          const dx = mx - n.x, dy = my - n.y;
          const dist = Math.hypot(dx, dy);
          const half = Math.hypot(n.w, n.h) * 0.5;
          if (dist < half + 30) {
            /* spawn 3 children */
            const nextGen = n.gen + 1;
            const scale = Math.max(0.25, 1 - nextGen * 0.18);
            const spread = 90 * scale;
            const angle = Math.atan2(dy, dx) + Math.PI;
            const children: Node[] = [];
            for (let j = 0; j < 3; j++) {
              const a = angle + (j - 1) * 1.1;
              children.push(makeNode(
                n.x + Math.cos(a) * spread,
                n.y + Math.sin(a) * spread,
                nextGen, scale
              ));
            }
            nodes.splice(i, 1, ...children);
            break; // one split per frame
          }
        }
      }

      /* ── Physics: repulsion from mouse + inter-node separation + brownian ── */
      nodes.forEach(n => {
        /* Brownian jitter */
        n.vx += (Math.random() - 0.5) * 0.5;
        n.vy += (Math.random() - 0.5) * 0.5;

        /* Mouse evasion */
        const dMx = n.x - mx, dMy = n.y - my;
        const dM = Math.hypot(dMx, dMy);
        if (dM < 180 && dM > 0.1) {
          const f = (180 - dM) / 180 * 4;
          n.vx += (dMx / dM) * f;
          n.vy += (dMy / dM) * f;
        }

        /* Soft boundary */
        if (n.x < n.w / 2) n.vx += 1.5;
        if (n.x > W - n.w / 2) n.vx -= 1.5;
        if (n.y < n.h / 2) n.vy += 1.5;
        if (n.y > H - n.h / 2) n.vy -= 1.5;

        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
      });

      /* ── Draw ── */
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = nodes.length > 40 ? `rgba(8,5,15,${Math.min(1, nodes.length / 80)})` : "#0B0B14";
      ctx.fillRect(0, 0, W, H);

      nodes.forEach(n => {
        const a = Math.max(0.25, 1 - n.gen * 0.12);
        const r = Math.max(0, 6 * (1 - n.gen * 0.1));
        ctx.save();
        ctx.globalAlpha = a;
        /* glass card */
        ctx.shadowBlur = n.gen === 0 ? 20 : 8;
        ctx.shadowColor = `rgba(165,122,220,${0.5 * a})`;
        ctx.fillStyle = `rgba(30,20,55,${0.8 - n.gen * 0.06})`;
        ctx.strokeStyle = `rgba(165,122,220,${0.3 * a})`;
        ctx.lineWidth = 1;
        const x0 = n.x - n.w / 2, y0 = n.y - n.h / 2;
        ctx.beginPath();
        ctx.roundRect(x0, y0, n.w, n.h, r);
        ctx.fill(); ctx.stroke();
        /* label */
        ctx.font = `${Math.max(9, 13 - n.gen * 2)}px monospace`;
        ctx.fillStyle = `rgba(200,180,255,${a})`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowBlur = 0;
        ctx.fillText(n.label, n.x, n.y);
        ctx.restore();
      });

      /* node count overlay */
      if (nodes.length > 10) {
        ctx.save();
        ctx.font = "10px monospace";
        ctx.fillStyle = `rgba(165,100,220,${Math.min(0.6, nodes.length / 80)})`;
        ctx.textAlign = "right";
        ctx.fillText(`${nodes.length} choices`, W - 14, H - 14);
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("mousemove", onMouseMove); canvas.removeEventListener("mouseleave", onMouseLeave); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full block"
      style={{ touchAction: "none", background: "#0B0B14" }} />
  );
}
