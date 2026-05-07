"use client";

import { useEffect, useRef } from "react";

interface Shadow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  radius: number;
  age: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function WeightOfThePast() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let raf: number;
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;
    canvas.width = W;
    canvas.height = H;

    /* ── State ── */
    let bx = W / 2, by = H / 2;   // orb current pos
    let tx = W / 2, ty = H / 2;   // mouse target
    let vel = 0;                    // smoothed velocity magnitude
    let spawnClock = 0;
    let freedomPulse = 0;          // 0-1: flash when all shadows gone
    let wasLoaded = false;

    const shadows: Shadow[] = [];
    const MAX = 20;

    /* ── Input ── */
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      const d = Math.hypot(nx - tx, ny - ty);
      vel = lerp(vel, d, 0.35);
      tx = nx; ty = ny;
    };
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const nx = e.touches[0].clientX - r.left;
      const ny = e.touches[0].clientY - r.top;
      const d = Math.hypot(nx - tx, ny - ty);
      vel = lerp(vel, d, 0.35);
      tx = nx; ty = ny;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });

    const ro = new ResizeObserver(() => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W; canvas.height = H;
    });
    ro.observe(canvas);

    /* ── Tick ── */
    function tick() {
      ctx.clearRect(0, 0, W, H);

      /* background */
      ctx.fillStyle = "#07070E";
      ctx.fillRect(0, 0, W, H);

      /* subtle ambient radial */
      const amb = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.55);
      amb.addColorStop(0, "rgba(28,16,55,0.18)");
      amb.addColorStop(1, "transparent");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W, H);

      /* ── Orb movement: heavier with more shadows ── */
      const weight = shadows.length / MAX;
      const lerpT = lerp(0.115, 0.018, weight);
      bx = lerp(bx, tx, lerpT);
      by = lerp(by, ty, lerpT);

      /* ── Shadow spawning ── */
      spawnClock++;
      const spawnEvery = vel > 18 ? 1 : vel > 10 ? 2 : vel > 5 ? 4 : vel > 2 ? 8 : 99;
      if (shadows.length < MAX && spawnClock % spawnEvery === 0 && vel > 2) {
        shadows.push({
          x: bx + (Math.random() - 0.5) * 14,
          y: by + (Math.random() - 0.5) * 14,
          vx: 0, vy: 0,
          opacity: 0.55 + Math.random() * 0.3,
          radius: 9 + Math.random() * 7,
          age: 0,
        });
      }

      const isStopped = vel < 0.8;

      /* ── Shadow physics ── */
      for (let i = shadows.length - 1; i >= 0; i--) {
        const s = shadows[i];
        s.age++;

        const dx = bx - s.x;
        const dy = by - s.y;
        const dist = Math.hypot(dx, dy);

        const k = isStopped ? 0.028 : 0.007;
        s.vx = s.vx * 0.84 + dx * k;
        s.vy = s.vy * 0.84 + dy * k;
        s.x += s.vx;
        s.y += s.vy;

        /* fade when close or when stopped */
        if (dist < 22 || isStopped) s.opacity -= isStopped ? 0.018 : 0.006;

        if (s.opacity <= 0) shadows.splice(i, 1);
      }

      /* ── Freedom pulse ── */
      const prevCount = shadows.length;
      if (wasLoaded && prevCount === 0 && shadows.length === 0 && vel < 0.5) {
        freedomPulse = Math.min(freedomPulse + 0.04, 1);
      } else {
        freedomPulse = Math.max(freedomPulse - 0.025, 0);
      }
      wasLoaded = true;

      /* ── Draw spring threads ── */
      shadows.forEach(s => {
        const dist = Math.hypot(bx - s.x, by - s.y);
        if (dist > 28) {
          ctx.save();
          ctx.strokeStyle = `rgba(100, 70, 175, ${s.opacity * 0.14})`;
          ctx.lineWidth = 0.9;
          ctx.setLineDash([2, 10]);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          // slight curve midpoint
          const mx = (s.x + bx) / 2 + (Math.random() - 0.5) * 8;
          const my = (s.y + by) / 2 + (Math.random() - 0.5) * 8;
          ctx.quadraticCurveTo(mx, my, bx, by);
          ctx.stroke();
          ctx.restore();
        }
      });

      /* ── Draw shadows ── */
      shadows.forEach(s => {
        ctx.save();
        /* depth glow */
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3.2);
        g.addColorStop(0, `rgba(80, 50, 160, ${s.opacity * 0.45})`);
        g.addColorStop(0.45, `rgba(50, 30, 110, ${s.opacity * 0.22})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
        /* core */
        const gc = ctx.createRadialGradient(s.x - 2, s.y - 2, 0, s.x, s.y, s.radius);
        gc.addColorStop(0, `rgba(130, 100, 220, ${s.opacity * 0.65})`);
        gc.addColorStop(1, `rgba(60, 35, 130, ${s.opacity * 0.1})`);
        ctx.fillStyle = gc;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      /* ── Main orb ── */
      const free = freedomPulse;
      const noShadow = shadows.length === 0;
      const glowScale = noShadow ? lerp(1, 1.6, free) : lerp(1, 0.55, weight);

      /* aura */
      const aura = ctx.createRadialGradient(bx, by, 4, bx, by, 62 * glowScale);
      aura.addColorStop(0, `rgba(200, 170, 255, ${0.2 * glowScale})`);
      aura.addColorStop(0.4, `rgba(120, 85, 210, ${0.1 * glowScale})`);
      aura.addColorStop(1, "transparent");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(bx, by, 62 * glowScale, 0, Math.PI * 2);
      ctx.fill();

      /* freedom burst ring */
      if (free > 0.05) {
        ctx.save();
        ctx.strokeStyle = `rgba(220, 200, 255, ${free * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, 28 + free * 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      /* core orb */
      const orbR = 13;
      ctx.save();
      ctx.shadowBlur = 32 * glowScale;
      ctx.shadowColor = `rgba(210, 185, 255, ${0.92 * glowScale})`;
      const og = ctx.createRadialGradient(bx - 3.5, by - 3.5, 0, bx, by, orbR);
      og.addColorStop(0, `rgba(252, 248, 255, ${glowScale})`);
      og.addColorStop(0.4, `rgba(195, 165, 255, ${0.88 * glowScale})`);
      og.addColorStop(1, `rgba(80, 50, 195, ${0.08 * glowScale})`);
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(bx, by, orbR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ── Decay velocity ── */
      vel = lerp(vel, 0, 0.08);

      raf = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ cursor: "none", touchAction: "none", background: "#07070E" }}
    />
  );
}
