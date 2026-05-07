"use client";

import { useEffect, useRef } from "react";

interface Door {
  x: number;
  y: number;
  angle: number;
  open: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function IllusionCanvas() {
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

    let bx = W / 2, by = H / 2;
    let tx = W / 2, ty = H / 2;

    const COUNT = 10;

    function buildDoors(w: number, h: number): Door[] {
      const r = Math.min(w, h) * 0.34;
      return Array.from({ length: COUNT }, (_, i) => {
        const a = (i / COUNT) * Math.PI * 2 - Math.PI / 2;
        return { x: w / 2 + Math.cos(a) * r, y: h / 2 + Math.sin(a) * r, angle: a, open: 1 };
      });
    }

    let doors = buildDoors(W, H);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
    };

    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      tx = e.touches[0].clientX - rect.left;
      ty = e.touches[0].clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });

    const ro = new ResizeObserver(() => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W;
      canvas.height = H;
      doors = buildDoors(W, H);
      bx = W / 2; by = H / 2;
      tx = W / 2; ty = H / 2;
    });
    ro.observe(canvas);

    function drawDoor(d: Door) {
      const dw = Math.min(W, H) * 0.048;
      const dh = dw * 1.65;
      const pw = dw * 0.13;
      const ar = dw / 2;

      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.angle - Math.PI / 2);

      if (d.open > 0.02) {
        const glow = ctx.createRadialGradient(0, -dh * 0.4, 0, 0, -dh * 0.4, dw * 2.8);
        glow.addColorStop(0, `rgba(255, 200, 85, ${d.open * 0.5})`);
        glow.addColorStop(0.35, `rgba(255, 130, 40, ${d.open * 0.22})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(-dw * 2.8, -dh - dw * 2.8, dw * 5.6, dh + dw * 5.6);
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(-dw / 2 + pw, -dh, dw - pw * 2, dh);
      ctx.arc(0, -dh, ar - pw, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 190, 75, ${d.open * 0.28})`;
      ctx.shadowBlur = d.open * 22;
      ctx.shadowColor = "rgba(255, 195, 80, 0.9)";
      ctx.fill();
      ctx.restore();

      if (d.open < 0.98) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(-dw / 2 + pw, -dh, dw - pw * 2, dh);
        ctx.arc(0, -dh, ar - pw, Math.PI, 0);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = `rgba(7, 7, 15, ${(1 - d.open) * 0.97})`;
        ctx.fillRect(-dw, -dh - ar, dw * 2, dh + ar * 2);
        ctx.restore();
      }

      const o = d.open;
      ctx.strokeStyle = o > 0.35
        ? `rgba(255, ${165 + (o * 45) | 0}, 65, ${0.4 + o * 0.55})`
        : `rgba(95, 82, 135, ${0.22 + (1 - o) * 0.38})`;
      ctx.lineWidth = 1.7;
      ctx.shadowBlur = o > 0.3 ? o * 18 : 5;
      ctx.shadowColor = o > 0.3
        ? `rgba(255, 195, 80, ${o * 0.85})`
        : "rgba(80, 70, 125, 0.5)";

      ctx.beginPath(); ctx.moveTo(-dw / 2, 0); ctx.lineTo(-dw / 2, -dh); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dw / 2, 0); ctx.lineTo(dw / 2, -dh); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -dh, ar, Math.PI, 0, false); ctx.stroke();

      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#07070E";
      ctx.fillRect(0, 0, W, H);

      const nb = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.52);
      nb.addColorStop(0, "rgba(50, 32, 90, 0.12)");
      nb.addColorStop(1, "transparent");
      ctx.fillStyle = nb;
      ctx.fillRect(0, 0, W, H);

      bx = lerp(bx, tx, 0.072);
      by = lerp(by, ty, 0.072);
      const maxR = Math.min(W, H) * 0.26;
      const distC = Math.hypot(bx - W / 2, by - H / 2);
      if (distC > maxR) {
        const a = Math.atan2(by - H / 2, bx - W / 2);
        bx = W / 2 + Math.cos(a) * maxR;
        by = H / 2 + Math.sin(a) * maxR;
      }

      const CLOSE_THRESH = 78;
      const OPEN_THRESH = 128;
      doors.forEach(d => {
        const dd = Math.hypot(bx - d.x, by - d.y);
        if (dd < CLOSE_THRESH)     d.open = lerp(d.open, 0, 0.11);
        else if (dd > OPEN_THRESH) d.open = lerp(d.open, 1, 0.038);
      });

      doors.forEach(d => {
        ctx.save();
        ctx.globalAlpha = 0.025 + d.open * 0.055;
        ctx.strokeStyle = "rgba(255, 175, 70, 1)";
        ctx.lineWidth = 0.7;
        ctx.setLineDash([3, 14]);
        ctx.beginPath();
        ctx.moveTo(W / 2, H / 2);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.restore();
      });

      doors.forEach(d => drawDoor(d));

      const aura = ctx.createRadialGradient(bx, by, 4, bx, by, 55);
      aura.addColorStop(0, "rgba(152, 118, 255, 0.22)");
      aura.addColorStop(1, "transparent");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(bx, by, 55, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.shadowBlur = 28;
      ctx.shadowColor = "rgba(190, 158, 255, 0.95)";
      const bg = ctx.createRadialGradient(bx - 3, by - 3, 0, bx, by, 13);
      bg.addColorStop(0, "rgba(242, 232, 255, 1)");
      bg.addColorStop(0.42, "rgba(168, 128, 255, 0.92)");
      bg.addColorStop(1, "rgba(82, 52, 195, 0.12)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(bx, by, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

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
