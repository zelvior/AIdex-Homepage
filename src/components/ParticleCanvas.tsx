import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
}

interface ParticleCanvasProps {
  pulseTrigger: number;
  theme: "cyber" | "matrix" | "classic" | "light";
}

export default function ParticleCanvas({ pulseTrigger, theme }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pulseIntensityRef = useRef(0);

  // Trigger a subtle 3D expansion pulse whenever the trigger increases
  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseIntensityRef.current = 2.5; // Starts high and decays
    }
  }, [pulseTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates for interactive 3D rotations
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions between -1 and 1
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      
      targetRotationY = mouseX * 0.4;
      targetRotationX = -mouseY * 0.4;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Define theme colors with high transparency to maintain "less crowded" vibe
    const getThemeColors = () => {
      switch (theme) {
        case "matrix":
          return ["rgba(52, 211, 153, 0.15)", "rgba(16, 185, 129, 0.08)", "rgba(5, 150, 105, 0.04)"];
        case "classic":
          return ["rgba(96, 165, 250, 0.15)", "rgba(59, 130, 246, 0.08)", "rgba(37, 99, 235, 0.04)"];
        case "light":
          return ["rgba(113, 113, 122, 0.06)", "rgba(161, 161, 170, 0.04)", "rgba(228, 228, 231, 0.02)"];
        case "cyber":
        default:
          return ["rgba(129, 140, 248, 0.15)", "rgba(139, 92, 246, 0.08)", "rgba(236, 72, 153, 0.04)"];
      }
    };

    // 3D mathematical parameters
    const focalLength = 350; // Controls depth scaling
    const particles: Particle[] = [];
    const numParticles = 120; // Lower count for high-performance, minimalist, pristine view
    const colors = getThemeColors();

    // Initialize particles on a 3D sphere/torus shell
    for (let i = 0; i < numParticles; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 180 + Math.random() * 40; // elegant orbital shell

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: colors[i % colors.length],
        size: 1 + Math.random() * 2,
      });
    }

    let angle = 0;

    const render = () => {
      // Clear with slight trailing fade effect for beautiful motion blur
      ctx.fillStyle = theme === "light" ? "rgba(255, 255, 255, 0.12)" : "rgba(3, 3, 5, 0.12)";
      ctx.fillRect(0, 0, width, height);

      // Smoothly interpolate rotations (inertia)
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      // Automatically rotate orbit slowly over time
      angle += 0.002;
      const totalRotY = currentRotationY + angle;
      const totalRotX = currentRotationX;

      const cosY = Math.cos(totalRotY);
      const sinY = Math.sin(totalRotY);
      const cosX = Math.cos(totalRotX);
      const sinX = Math.sin(totalRotX);

      // Pulse decay
      if (pulseIntensityRef.current > 0) {
        pulseIntensityRef.current *= 0.95;
        if (pulseIntensityRef.current < 0.01) {
          pulseIntensityRef.current = 0;
        }
      }

      // Project and render each 3D particle
      const centerX = width / 2;
      const centerY = height / 2;

      // Sort particles by Z (depth buffer rendering) so closer particles render on top
      const sortedParticles = [...particles].map((p) => {
        // Apply 3D rotation around Y axis
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // Apply 3D rotation around X axis
        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Apply interactive shockwave expansion pulse outward
        if (pulseIntensityRef.current > 0) {
          const distance = Math.sqrt(x1 * x1 + y2 * y2 + z2 * z2);
          const expansion = 1 + (pulseIntensityRef.current * 0.15);
          x1 *= expansion;
          y2 *= expansion;
          z2 *= expansion;
        }

        return {
          ...p,
          x: x1,
          y: y2,
          z: z2,
        };
      });

      // Sort by z descending (farthest first)
      sortedParticles.sort((a, b) => b.z - a.z);

      // Draw projected points
      for (const p of sortedParticles) {
        // Perspective calculation
        const scale = focalLength / (focalLength + p.z);
        const projX = centerX + p.x * scale;
        const projY = centerY + p.y * scale;

        // Only draw if within bounds and not behind the camera (focal point)
        if (p.z + focalLength > 50 && projX > 0 && projX < width && projY > 0 && projY < height) {
          // Adjust size and opacity dynamically based on 3D depth Z coordinate
          const depthAlpha = Math.max(0.1, Math.min(0.9, (focalLength - p.z) / (focalLength * 2)));
          const size = Math.max(0.5, p.size * scale * 1.2);

          ctx.beginPath();
          ctx.arc(projX, projY, size, 0, Math.PI * 2);
          
          // Inject dynamic opacity into current color
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${depthAlpha})`);
          ctx.fill();

          // Connect nearby dots with beautiful subtle 3D space constellation webs
          for (const other of sortedParticles) {
            // Only draw a line to nearby points to keep it uncluttered
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dz = p.z - other.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 60) {
              const otherScale = focalLength / (focalLength + other.z);
              const otherProjX = centerX + other.x * otherScale;
              const otherProjY = centerY + other.y * otherScale;

              const lineAlpha = (1 - dist / 60) * 0.08 * depthAlpha;
              ctx.beginPath();
              ctx.moveTo(projX, projY);
              ctx.lineTo(otherProjX, otherProjY);
              ctx.strokeStyle = theme === "light" 
                ? `rgba(100, 116, 139, ${lineAlpha})` 
                : `rgba(139, 92, 246, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
