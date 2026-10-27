"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./CustomCursor.css";

const nativeTargets = "input, textarea, select, iframe, canvas, [contenteditable]:not([contenteditable='false']), [data-native-cursor], [disabled], [aria-disabled='true'], [role='slider']";
const interactiveTargets = "a, button, summary, [role='button'], [data-cursor]";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(-100, { stiffness: 850, damping: 42, mass: 0.35 });
  const ringY = useSpring(-100, { stiffness: 850, damping: 42, mass: 0.35 });

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = pointer.matches && !reducedMotion.matches;
    let shown = false;

    const show = (next: boolean) => {
      if (shown === next) return;
      shown = next;
      document.body.classList.toggle("ih-custom-cursor-active", next);
      setVisible(next);
    };
    const hide = () => { show(false); setPressed(false); };
    const updatePreference = () => {
      enabled = pointer.matches && !reducedMotion.matches;
      if (!enabled) hide();
    };
    const updateTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element) || target.closest(nativeTargets)) {
        hide();
        return false;
      }
      setInteractive(Boolean(target.closest(interactiveTargets)));
      return true;
    };
    const onMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") { hide(); return; }
      if (!updateTarget(event.target)) return;
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      // Re-entry starts at the pointer, without a streak from its previous position.
      if (!shown) {
        ringX.jump(event.clientX);
        ringY.jump(event.clientY);
      } else {
        ringX.set(event.clientX);
        ringY.set(event.clientY);
      }
      show(true);
    };
    const onOver = (event: PointerEvent) => {
      if (enabled && event.pointerType === "mouse") updateTarget(event.target);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") hide();
      else if (shown) setPressed(true);
    };
    const onUp = () => setPressed(false);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };
    const onVisibility = () => { if (document.hidden) hide(); };

    pointer.addEventListener("change", updatePreference);
    reducedMotion.addEventListener("change", updatePreference);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", onKey);
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.body.classList.remove("ih-custom-cursor-active");
      pointer.removeEventListener("change", updatePreference);
      reducedMotion.removeEventListener("change", updatePreference);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dotX, dotY, ringX, ringY]);

  if (!visible) return null;

  return <div className="ih-cursor" aria-hidden="true">
    <motion.div
      className="ih-cursor-ring"
      style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      initial={false}
      animate={{
        scale: (interactive ? 1.4 : 1) * (pressed ? 0.82 : 1),
        borderColor: interactive ? "rgba(232, 186, 145, 0.85)" : "rgba(225, 227, 234, 0.48)",
        backgroundColor: interactive ? "rgba(232, 186, 145, 0.035)" : "rgba(232, 186, 145, 0)",
      }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    />
    <motion.div
      className="ih-cursor-dot"
      style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      initial={false}
      animate={{ scale: pressed ? 0.65 : 1, backgroundColor: interactive ? "#eed0af" : "#b2d8d3" }}
      transition={{ duration: 0.12 }}
    />
  </div>;
}
