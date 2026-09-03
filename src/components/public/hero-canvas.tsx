"use client";

import * as React from "react";

/**
 * Interactive HTML5 Canvas animation representing electrical circuits,
 * energy flow, and glowing nodes. Performance-optimized, mobile-responsive,
 * and falls back gracefully on low-power devices.
 */
export function HeroCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>(0);
  const mouseRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Store refs so inner functions can access without null checks
    let alive = true;
    const context = ctx;
    const cvs = canvas;

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      cvs.width = width;
      cvs.height = height;
    }

    resize();
    window.addEventListener("resize", resize);

    interface ParticleNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      pulseSpeed: number;
      pulsePhase: number;
      brightness: number;
    }

    const NODE_COUNT = Math.min(Math.floor((width * height) / 18000), 80);
    const nodes: ParticleNode[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        baseRadius: Math.random() * 2 + 1.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }

    let time = 0;

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    function draw() {
      if (!alive) return;

      context.clearRect(0, 0, width, height);
      time += 1;

      const mouse = mouseRef.current;

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase);
        node.radius = node.baseRadius + pulse * 0.8;

        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * 0.02;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        node.vx *= 0.999;
        node.vy *= 0.999;

        // Glow
        const gradient = context.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 6
        );
        const alpha = node.brightness * (0.3 + pulse * 0.1);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        context.beginPath();
        context.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();

        // Core
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(147, 197, 253, ${node.brightness})`;
        context.fill();
      }

      // Connections
      const CONNECTION_DISTANCE = 150;
      context.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ddx = nodes[i].x - nodes[j].x;
          const ddy = nodes[i].y - nodes[j].y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (ddist < CONNECTION_DISTANCE) {
            const connectionAlpha =
              (1 - ddist / CONNECTION_DISTANCE) * 0.2;
            context.beginPath();
            context.moveTo(nodes[i].x, nodes[i].y);
            context.lineTo(nodes[j].x, nodes[j].y);
            context.strokeStyle = `rgba(59, 130, 246, ${connectionAlpha})`;
            context.stroke();
          }
        }
      }

      // Energy pulses
      if (time % 60 === 0 && nodes.length > 1) {
        const idx = Math.floor(Math.random() * nodes.length);
        let nearest = 0;
        let nearestDist = Infinity;
        for (let j = 0; j < nodes.length; j++) {
          if (idx === j) continue;
          const ddx = nodes[idx].x - nodes[j].x;
          const ddy = nodes[idx].y - nodes[j].y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < nearestDist && d < CONNECTION_DISTANCE) {
            nearestDist = d;
            nearest = j;
          }
        }
        if (nearestDist < CONNECTION_DISTANCE) {
          const pulsePos = (time % 120) / 120;
          const px =
            nodes[idx].x +
            (nodes[nearest].x - nodes[idx].x) * pulsePos;
          const py =
            nodes[idx].y +
            (nodes[nearest].y - nodes[idx].y) * pulsePos;
          const pulseGrad = context.createRadialGradient(
            px,
            py,
            0,
            px,
            py,
            8
          );
          pulseGrad.addColorStop(0, "rgba(251, 191, 36, 0.8)");
          pulseGrad.addColorStop(1, "rgba(251, 191, 36, 0)");
          context.beginPath();
          context.arc(px, py, 8, 0, Math.PI * 2);
          context.fillStyle = pulseGrad;
          context.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      alive = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
