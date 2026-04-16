"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = Math.random() * 3 + 1.5; // size between 1.5 and 4.5
    const colors = ["#8b5cf6", "#d946ef", "#0ea5e9", "#10b981", "#f59e0b"]; // Tailwind Indigo, Fuchsia, Sky, Emerald, Amber
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouseX: number, mouseY: number, isMouseDown: boolean, canvasWidth: number, canvasHeight: number) {
    if (isMouseDown) {
      // Attract towards mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Avoid division by zero
      if (distance > 1) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        // Acceleration when gathering
        this.vx += forceDirectionX * 0.5;
        this.vy += forceDirectionY * 0.5;
        
        // Friction when gathering so they swarm but don't fly off infinitely
        this.vx *= 0.94;
        this.vy *= 0.94;
      }
    } else {
      // Normal wander mode
      // Apply gentle friction to return to normal floating speed after explosion
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx *= 0.95;
        this.vy *= 0.95;
      } else {
        // Add subtle Brownian motion
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.1;
      }
    }

    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls (only if not gathering)
    if (!isMouseDown) {
      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > canvasWidth) { this.x = canvasWidth; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      if (this.y > canvasHeight) { this.y = canvasHeight; this.vy *= -1; }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Instead of expensive shadowBlur, we use a simple two-pass drawing for a "glow" effect on 20% of particles
    // Or just a clean solid fill for all to ensure max performance.
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouseX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let mouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    let isMouseDown = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Reduced count slightly for heavy pages
      const numParticles = 80; 
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a subtle "glow" bloom in a single pass for all particles if needed, 
      // but for "stucking" UI, simplest is best.
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY, isMouseDown, canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleGlobalMouseDown = () => {
      isMouseDown = true;
    };

    const handleGlobalMouseUp = () => {
      isMouseDown = false;
      particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * 15;
        p.vy = (Math.random() - 0.5) * 15;
      });
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mousedown", handleGlobalMouseDown);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchstart", handleGlobalMouseDown, { passive: true });
    window.addEventListener("touchend", handleGlobalMouseUp);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousedown", handleGlobalMouseDown);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchstart", handleGlobalMouseDown);
      window.removeEventListener("touchend", handleGlobalMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-5] opacity-40 dark:opacity-60 transition-opacity duration-1000"
    />
  );
}

