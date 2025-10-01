// src/admin/ui/FXBackdrop.jsx
import { useEffect, useRef } from "react";

/** Subtle particle constellation + parallax glow (no deps) */
export default function FXBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const N = Math.min(70, Math.floor((w * h) / 45000)); // density-aware
    const pts = Array.from({ length: N }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.7,
    }));

    let mx = w / 2, my = h / 3; // mouse for parallax
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // radial vignette
      const g = ctx.createRadialGradient(mx, my, 10, w/2, h/2, Math.max(w, h));
      g.addColorStop(0, "rgba(34,211,238,0.06)");
      g.addColorStop(0.4, "rgba(167,139,250,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

      // points
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();

        // connect close points
        for (const q of pts) {
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 120*120) {
            const a = 1 - Math.sqrt(d2) / 120;
            ctx.strokeStyle = `rgba(173,216,230,${a * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Glow blobs (CSS) */}
      <div className="blob w-[36rem] h-[36rem] bg-cyan-500/35 left-[-10%] top-[-10%]" />
      <div className="blob w-[28rem] h-[28rem] bg-fuchsia-500/30 right-[-8%] top-[10%]" style={{ animationDelay: "4s" }} />
      <div className="blob w-[32rem] h-[32rem] bg-rose-500/25 left-[20%] bottom-[-10%]" style={{ animationDelay: "8s" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid" />

      {/* Particle canvas */}
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}
