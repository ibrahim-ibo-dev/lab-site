"use client";
import { useEffect, useRef } from "react";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface Shard {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  len: number; angle: number;
}

export default function FragilityOfConnection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W; canvas.height = H;
    let raf: number, time = 0;

    /* ── Nodes ── */
    const nodeA = () => ({ x: W * 0.22, y: H * 0.5 });
    let bx = W * 0.78, by = H * 0.5;  // node B follows mouse
    let mx = W * 0.78, my = H * 0.5;

    /* ── State ── */
    let connection = 0;       // 0 → 1: how formed the connection is
    let speed = 0;            // smoothed mouse speed (px/frame)
    let rawSpeed = 0;         // raw per-frame delta
    let isBroken = false;
    let cooldown = 0;         // frames countdown
    let flashRed = 0;         // 0 → 1
    let shards: Shard[] = [];

    const SPEED_LIMIT = 16;   // px/frame → shatter
    const CONNECT_DIST = 80;  // px → fully connected
    const COOLDOWN_FRAMES = 180; // 3 sec at 60fps

    let pmx = mx, pmy = my;
    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      rawSpeed = Math.hypot(nx - pmx, ny - pmy);
      speed = lerp(speed, rawSpeed, 0.5); // smooth
      pmx = mx; pmy = my;
      mx = nx; my = ny;
    });
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      mx = e.touches[0].clientX - r.left;
      my = e.touches[0].clientY - r.top;
    }, { passive: false });

    const ro = new ResizeObserver(() => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W; canvas.height = H;
      bx = W * 0.78; by = H * 0.5; mx = bx; my = by;
    });
    ro.observe(canvas);

    function spawnShards(cx: number, cy: number) {
      for (let i = 0; i < 22; i++) {
        const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.4;
        const v = 3 + Math.random() * 6;
        shards.push({ x: cx, y: cy, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
          life: 1, maxLife: 0.8 + Math.random() * 0.2,
          len: 8 + Math.random() * 18, angle: angle + Math.PI / 2 });
      }
    }

    function tick() {
      time++;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#09090B";
      ctx.fillRect(0, 0, W, H);

      const na = nodeA();

      /* ── Red flash overlay ── */
      if (flashRed > 0) {
        ctx.fillStyle = `rgba(127,29,29, ${flashRed * 0.12})`;
        ctx.fillRect(0, 0, W, H);
        flashRed = Math.max(0, flashRed - 0.04);
      }

      /* ── Cooldown ── */
      if (isBroken) {
        cooldown--;
        // node B reset toward default
        bx = lerp(bx, W * 0.78, 0.08);
        by = lerp(by, H * 0.5, 0.08);
        if (cooldown <= 0) { isBroken = false; connection = 0; shards = []; }
      } else {
        /* node B follows mouse with gentle lerp */
        bx = lerp(bx, mx, 0.06);
        by = lerp(by, my, 0.06);

        /* speed check */
        if (speed > SPEED_LIMIT && connection > 0.15) {
          isBroken = true;
          cooldown = COOLDOWN_FRAMES;
          flashRed = 1;
          spawnShards((na.x + bx) * 0.5, (na.y + by) * 0.5);
          connection = 0;
        }

        /* build connection based on distance */
        const dist = Math.hypot(bx - na.x, by - na.y);
        const proximity = Math.max(0, 1 - dist / (W * 0.6));
        if (speed < SPEED_LIMIT * 0.5) {
          connection = lerp(connection, proximity, 0.025);
        } else {
          connection = lerp(connection, 0, 0.05);
        }
      }

      /* ── Connection line ── */
      if (!isBroken && connection > 0.02) {
        const na2 = na;
        const alpha = connection * 0.85;
        const w = connection * 3.5;
        const distNow = Math.hypot(bx - na2.x, by - na2.y);
        const fullyConnected = distNow < CONNECT_DIST;

        /* crystal glow path */
        ctx.save();
        ctx.shadowBlur = fullyConnected ? 30 + Math.sin(time * 0.08) * 10 : 14 * connection;
        ctx.shadowColor = fullyConnected ? "rgba(56,189,248,0.9)" : `rgba(186,230,253,${alpha})`;
        ctx.strokeStyle = fullyConnected
          ? `rgba(56,189,248,${alpha})`
          : `rgba(186,230,253,${alpha * 0.7})`;
        ctx.lineWidth = w;
        ctx.setLineDash(fullyConnected ? [] : [6, 4]);
        ctx.beginPath();
        ctx.moveTo(na2.x, na2.y);
        /* bezier curve for organic feel */
        const cx2 = (na2.x + bx) / 2, cy2 = (na2.y + by) / 2 - connection * 30;
        ctx.quadraticCurveTo(cx2, cy2, bx, by);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        /* fully connected pulse */
        if (fullyConnected) {
          const pulse = 0.5 + Math.sin(time * 0.1) * 0.5;
          const pg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 60 * connection);
          pg.addColorStop(0, `rgba(56,189,248,${0.08 * pulse})`);
          pg.addColorStop(1, "transparent");
          ctx.fillStyle = pg; ctx.beginPath();
          ctx.arc(cx2, cy2, 60 * connection, 0, Math.PI * 2); ctx.fill();
        }
      }

      /* ── Shards ── */
      shards.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.94; s.vy *= 0.94;
        s.life -= 0.022;
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.strokeStyle = "rgba(186,230,253,0.9)";
        ctx.lineWidth = 1.5;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.beginPath(); ctx.moveTo(-s.len / 2, 0); ctx.lineTo(s.len / 2, 0);
        ctx.stroke(); ctx.restore();
      });
      shards = shards.filter(s => s.life > 0);

      /* ── Draw nodes ── */
      [na, { x: bx, y: by }].forEach((n, i) => {
        const isB = i === 1;
        const c = isB && isBroken ? "rgba(239,68,68,0.8)" : `rgba(186,230,253,${0.5 + connection * 0.5})`;
        ctx.save();
        ctx.shadowBlur = isBroken && isB ? 20 : 16 + connection * 20;
        ctx.shadowColor = isBroken && isB ? "rgba(239,68,68,0.8)" : `rgba(56,189,248,${0.5 + connection * 0.5})`;
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      });

      /* ── Cooldown counter ── */
      if (isBroken && cooldown > 0) {
        const sec = Math.ceil(cooldown / 60);
        ctx.save();
        ctx.font = "11px monospace";
        ctx.fillStyle = "rgba(239,68,68,0.5)";
        ctx.textAlign = "center";
        ctx.fillText(`cooldown ${sec}s`, W / 2, H - 32);
        ctx.restore();
      }

      speed = lerp(speed, 0, 0.15);
      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full block"
      style={{ touchAction: "none", background: "#09090B" }} />
  );
}
