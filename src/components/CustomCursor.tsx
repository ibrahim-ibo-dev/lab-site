"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickScale, setClickScale] = useState(1);

  // Tiny dot exactly on cursor (Instant, no spring)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Larger ring with delay (Spring)
  const ringX = useSpring(-100, { stiffness: 400, damping: 28, mass: 0.5 });
  const ringY = useSpring(-100, { stiffness: 400, damping: 28, mass: 0.5 });

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Add global class to hide native cursor
    document.body.classList.add("hide-native-cursor");

    const updateMousePosition = (e: MouseEvent) => {
      // Direct assignment for instant response
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setClickScale(0.8);
    const handleMouseUp = () => setClickScale(1);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Use passive listener for better performance
    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      document.body.classList.remove("hide-native-cursor");
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, dotX, dotY, ringX, ringY]);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-native-cursor, .hide-native-cursor * { cursor: none !important; }
      `}} />
      
      {/* Outer Ring */}
      <motion.div
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          borderColor: "rgba(212, 165, 116, 0.7)",
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
        }}
        animate={{
          scale: isHovering ? 1.8 * clickScale : 1 * clickScale,
          backgroundColor: isHovering ? "rgba(212, 165, 116, 0.15)" : "transparent",
          borderWidth: isHovering ? "1px" : "1.5px",
        }}
        transition={{ type: "tween", duration: 0.15 }}
      />

      {/* Inner Dot */}
      <motion.div
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#D4A574",
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
        }}
        animate={{
          scale: isHovering ? 0 : 1 * clickScale,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", duration: 0.1 }}
      />
    </>
  );
}
