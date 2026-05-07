"use client";
import { useEffect, useRef } from "react";

interface Dot {
  ox: number; oy: number; // original pos
  x: number; y: number;
  phase: number;
  active: boolean;
  amp: number;
}

export default function ButterflyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W; canvas.height = H;
    let raf: number, time = 0;

    const GAP = 14;
    let dots: Dot[] = [];
    let epicenter: { x: number; y: number } | null = null;
    let waveRadius = 0;
    let waveActive = false;
    let globalAmp = 0;

    function buildGrid() {
      dots = [];
      const cols = Math.floor(W / GAP);
      const rows = Math.floor(H / GAP);
      const offX = (W - cols * GAP) / 2;
      const offY = (H - rows * GAP) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = offX + c * GAP, oy = offY + r * GAP;
          dots.push({ ox, oy, x: ox, y: oy, phase: 0, active: false, amp: 0 });
        }
      }
    }

    buildGrid();

    function startWave(cx: number, cy: number) {
      epicenter = { x: cx, y: cy };
      waveRadius = 0;
      waveActive = true;
      globalAmp = 0;
      time = 0;
      dots.forEach(d => { d.active = false; d.phase = 0; d.amp = 0; d.x = d.ox; d.y = d.oy; });
    }

    canvas.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect();
      startWave(e.clientX - r.left, e.clientY - r.top);
    });
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      startWave(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    }, { passive: false });

    const ro = new ResizeObserver(() => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W; canvas.height = H;
      buildGrid();
      epicenter = null; waveActive = false;
    });
    ro.observe(canvas);

    function tick() {
      time++;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, W, H);

      if (waveActive && epicenter) {
        waveRadius += 3.5;
        globalAmp = Math.min(18, globalAmp + 0.18);

        /* Activate dots when wave reaches them */
        dots.forEach(d => {
          const dist = Math.hypot(d.ox - epicenter!.x, d.oy - epicenter!.y);
          if (!d.active && dist <= waveRadius) {
            d.active = true;
            d.phase = dist * 0.07;
          }
        });

        /* If wave has spread to max */
        if (waveRadius > Math.hypot(W, H)) { waveActive = false; }
      }

      /* Slowly decay amp when no wave */
      if (!waveActive) { globalAmp = Math.max(0, globalAmp - 0.03); }

      /* Update & draw dots */
      dots.forEach(d => {
        if (d.active && globalAmp > 0) {
          const dist = epicenter ? Math.hypot(d.ox - epicenter.x, d.oy - epicenter.y) : 1;
          const wave = Math.sin(dist * 0.048 - time * 0.12 + d.phase);
          const amp = globalAmp * Math.max(0, 1 - dist / (Math.max(W, H) * 0.75));
          d.x = d.ox;
          d.y = d.oy + wave * amp;
          d.amp = Math.abs(wave * amp);
        } else {
          d.x = d.ox; d.y = d.oy; d.amp = 0;
        }

        /* Color mapping: hsl based on displacement */
        const a = d.amp;
        let col: string;
        if (a < 0.5) {
          col = "#333333"; // dormant
        } else {
          const hue = (30 + (a / globalAmp) * 200) % 360;
          const light = 40 + (a / globalAmp) * 30;
          const alpha = 0.4 + (a / Math.max(1, globalAmp)) * 0.6;
          col = `hsla(${hue},85%,${light}%,${alpha})`;
        }

        ctx.fillStyle = col;
        const size = a > 1 ? 2 : 1.5;
        ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
      });

      /* Hint text before first click */
      if (!epicenter && time < 120) {
        ctx.save();
        ctx.font = "11px monospace";
        ctx.fillStyle = `rgba(100,80,150,${0.4 + Math.sin(time * 0.06) * 0.3})`;
        ctx.textAlign = "center";
        ctx.fillText("click anywhere to start the ripple", W / 2, H - 28);
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full block"
      style={{ touchAction: "none", background: "#0A0A0A", cursor: "crosshair" }} />
  );
}
