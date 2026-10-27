"use client";

import { useEffect, useRef, useState } from "react";

const vertexSource = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// Original flowing silk: broad translucent folds with fine illuminated edges.
const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0;
  float weight = 0.52;
  mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    value += weight * noise(p);
    p = rotation * p * 2.05 + vec2(8.2, 2.7);
    weight *= 0.48;
  }
  return value;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.0;
  p += u_pointer * 0.06;
  float time = u_time * 0.075;

  vec2 drift = vec2(time * 0.13, -time * 0.09);
  vec2 warp = vec2(fbm(p * 1.15 + drift), fbm(p * 1.05 + vec2(4.7, 1.8) - drift));
  vec2 flow = p + (warp - 0.45) * 0.70;
  float bend = sin(flow.x * 1.4 + time * 0.55) * 0.46
             + sin(flow.x * 2.6 - time * 0.32) * 0.13;
  float ribbon = flow.y + flow.x * 0.34 + bend;
  float phase = ribbon * 7.6 - time * 0.58;
  float fold = sin(phase);
  // Asymmetric light across each fold gives volume instead of flat stripes.
  float silk = pow(max(0.0, fold), 2.2);
  float edge = exp(-abs(sin(phase + 0.45)) * 24.0);
  float filament = exp(-abs(sin(phase * 1.035 + 0.60)) * 70.0);
  float veil = 0.5 + 0.5 * sin(ribbon * 2.2 + time * 0.17);

  vec3 blue = vec3(0.075, 0.16, 0.39);
  vec3 teal = vec3(0.04, 0.24, 0.24);
  vec3 copper = vec3(0.32, 0.15, 0.09);
  vec3 violet = vec3(0.17, 0.075, 0.29);
  vec3 ribbonColour = mix(copper, blue, smoothstep(-1.0, 0.45, flow.x));
  ribbonColour = mix(ribbonColour, teal, smoothstep(0.05, 1.2, flow.x - flow.y * 0.75));
  ribbonColour = mix(ribbonColour, violet, (1.0 - smoothstep(-0.4, 0.9, flow.y)) * 0.30);

  // Keep the center restrained for copy; let the perimeter carry the light.
  float breathingRoom = smoothstep(0.1, 0.95, length(p * vec2(0.7, 1.05)));
  float illumination = 0.38 + breathingRoom * 0.62;
  vec3 colour = vec3(0.014, 0.020, 0.043);
  colour += ribbonColour * (silk * 0.54 + edge * 0.36 + filament * 0.16) * illumination;
  colour += mix(blue, violet, uv.x) * veil * 0.12;
  colour += teal * exp(-length((p - vec2(0.9, -0.4)) * vec2(0.7, 1.0)) * 2.2) * 0.13;
  float vignette = 1.0 - smoothstep(0.38, 1.1, length((uv - 0.5) * vec2(1.15, 0.85)));
  colour *= 0.80 + vignette * 0.20;
  colour = pow(colour, vec3(0.92));
  gl_FragColor = vec4(colour, 1.0);
}
`;

export default function AuroraBackground({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const updatePlaybackRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [contextVersion, setContextVersion] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    updatePlaybackRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return;

    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!vertex || !fragment || !program || !buffer) {
      shaders.forEach(shader => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const pointer = gl.getUniformLocation(program, "u_pointer");
    const time = gl.getUniformLocation(program, "u_time");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precisePointer = window.matchMedia("(pointer: fine)");
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 5;
    let lost = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const draw = () => {
      if (lost) return;
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointer, currentX, currentY);
      gl.uniform1f(time, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const running = () => !pausedRef.current && !reducedMotion.matches && !document.hidden && !lost;
    const tick = (now: number) => {
      if (!running()) { frame = 0; return; }
      frame = requestAnimationFrame(tick);
      // 30 fps is sufficient for a slow background; limit shader work on laptops.
      if (now - lastFrame < 1000 / 30) return;
      elapsed += lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
      lastFrame = now;
      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;
      draw();
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      if (running()) frame = requestAnimationFrame(tick);
    };
    updatePlaybackRef.current = updatePlayback;
    const resize = () => {
      // A deliberately soft render is visually appropriate and cheaper than full DPR.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      const factor = Math.min(ratio, 1100 / window.innerWidth, 900 / window.innerHeight);
      canvas.width = Math.max(1, Math.round(window.innerWidth * factor));
      canvas.height = Math.max(1, Math.round(window.innerHeight * factor));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };
    const onPointer = (event: PointerEvent) => {
      if (!running() || !precisePointer.matches) return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (0.5 - event.clientY / window.innerHeight) * 2;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      setReady(false);
    };
    const onRestored = () => setContextVersion(value => value + 1);
    resize();
    setReady(true);
    updatePlayback();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", updatePlayback);
    reducedMotion.addEventListener("change", updatePlayback);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      cancelAnimationFrame(frame);
      updatePlaybackRef.current = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", updatePlayback);
      reducedMotion.removeEventListener("change", updatePlayback);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      gl.deleteBuffer(buffer);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
    };
  }, [contextVersion]);

  return <div className={`nx-aurora${ready ? " nx-aurora-ready" : ""}${paused || hidden ? " nx-aurora-paused" : ""}`} aria-hidden="true">
    <picture className="nx-aurora-fallback">
      <source media="(orientation: portrait)" srcSet="/images/backgrounds/aurora-mobile.webp" />
      {/* The initial shader frame is present in server HTML, before hydration. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/backgrounds/aurora-desktop.webp" width="2880" height="900" alt="" loading="eager" fetchPriority="high" decoding="sync" />
    </picture>
    <canvas ref={canvasRef} className="nx-aurora-canvas" />
    <div className="nx-aurora-grain" />
    <div className="nx-aurora-shade" />
  </div>;
}
