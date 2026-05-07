"use client";
import { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  hue: number; radius: number;
}

const SPOTLIGHT_R = 90;
const NUM_PARTICLES = 7;

export default function SelectiveBlindness() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;
    const ctx = overlay.getContext("2d") as CanvasRenderingContext2D;

    let W = container.clientWidth, H = container.clientHeight;
    overlay.width = W; overlay.height = H;
    let raf: number, time = 0;

    let mx = W / 2, my = H / 2;
    let pmx = mx, pmy = my;
    let speed = 0;
    let fadeRate = 0.012; // how fast the black overlay refills

    /* ── Particles ── */
    const particles: Particle[] = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      x: mx + (Math.random() - 0.5) * SPOTLIGHT_R * 0.8,
      y: my + (Math.random() - 0.5) * SPOTLIGHT_R * 0.8,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      hue: (i / NUM_PARTICLES) * 360,
      radius: 5 + Math.random() * 5,
    }));

    const onMove = (e: MouseEvent) => {
      const r = overlay.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      speed = lerp(speed, Math.hypot(nx - pmx, ny - pmy), 0.4);
      pmx = mx; pmy = my;
      mx = nx; my = ny;
    };
    overlay.addEventListener("mousemove", onMove);
    overlay.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const r = overlay.getBoundingClientRect();
      mx = e.touches[0].clientX - r.left;
      my = e.touches[0].clientY - r.top;
    }, { passive: false });

    const ro = new ResizeObserver(() => {
      W = container.clientWidth; H = container.clientHeight;
      overlay.width = W; overlay.height = H;
    });
    ro.observe(container);

    function tick() {
      time++;

      /* ── Determine fade rate based on speed ── */
      fadeRate = speed > 20 ? 0.003 : 0.014;

      /* ── Re-darken overlay (fade toward black) ── */
      ctx.fillStyle = `rgba(0,0,0,${fadeRate})`;
      ctx.fillRect(0, 0, W, H);

      /* ── Erase spotlight using destination-out ── */
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      /* trail if moving fast */
      if (speed > 8) {
        const trailLen = Math.min(speed * 0.8, 120);
        const tdx = (pmx - mx) / Math.max(1, Math.hypot(pmx - mx, pmy - my));
        const tdy = (pmy - my) / Math.max(1, Math.hypot(pmx - mx, pmy - my));
        const tg = ctx.createRadialGradient(mx, my, 0, mx, my, SPOTLIGHT_R + trailLen * 0.4);
        tg.addColorStop(0, `rgba(0,0,0,${Math.min(0.95, speed * 0.04)})`);
        tg.addColorStop(1, "transparent");
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(mx + tdx * trailLen * 0.3, my + tdy * trailLen * 0.3,
          SPOTLIGHT_R + trailLen * 0.4, 0, Math.PI * 2); ctx.fill();
      }
      /* main spotlight */
      const sg = ctx.createRadialGradient(mx, my, 0, mx, my, SPOTLIGHT_R);
      sg.addColorStop(0, "rgba(0,0,0,1)");
      sg.addColorStop(0.7, "rgba(0,0,0,0.9)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(mx, my, SPOTLIGHT_R, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      /* ── Update & draw particles inside spotlight ── */
      particles.forEach(p => {
        /* drift toward spotlight center */
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d > SPOTLIGHT_R * 0.7) {
          p.vx += dx * 0.003; p.vy += dy * 0.003;
        }
        /* bounce off spotlight walls */
        const dist = Math.hypot(p.x - mx, p.y - my);
        if (dist > SPOTLIGHT_R - p.radius) {
          const nx2 = (p.x - mx) / dist, ny2 = (p.y - my) / dist;
          p.vx = lerp(p.vx, -nx2 * 2.5, 0.3);
          p.vy = lerp(p.vy, -ny2 * 2.5, 0.3);
        }
        /* inter-particle repulsion */
        particles.forEach(q => {
          if (q === p) return;
          const qd = Math.hypot(p.x - q.x, p.y - q.y);
          if (qd < 22 && qd > 0.1) {
            p.vx += (p.x - q.x) / qd * 0.4;
            p.vy += (p.y - q.y) / qd * 0.4;
          }
        });
        p.vx *= 0.90; p.vy *= 0.90;
        p.x += p.vx; p.y += p.vy;
        p.hue = (p.hue + 0.8) % 360;

        /* draw — on top of overlay using source-over */
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowBlur = 20; ctx.shadowColor = `hsl(${p.hue},100%,65%)`;
        ctx.fillStyle = `hsl(${p.hue},100%,65%)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      speed = lerp(speed, 0, 0.1);
      raf = requestAnimationFrame(tick);
    }

    /* Initial fill — pitch black */
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    tick();
    return () => { cancelAnimationFrame(raf); overlay.removeEventListener("mousemove", onMove); ro.disconnect(); };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black">
      {/* The Truth — revealed beneath */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <p
          className="font-serif font-black text-center leading-none text-white/90"
          style={{ fontSize: "clamp(2.8rem,8vw,7rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
        >
          YOU ARE<br />MISSING<br />THE BIG<br />PICTURE
        </p>
      </div>
      {/* Black overlay canvas — spotlight erases it */}
      <canvas ref={overlayRef} className="absolute inset-0 w-full h-full block"
        style={{ touchAction: "none" }} />
    </div>
  );
}
