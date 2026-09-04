import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    const colors = [
      'rgba(245, 200, 110, ', // Gold
      'rgba(232, 117, 97, ',  // Coral
      'rgba(158, 214, 205, ', // Aqua
      'rgba(201, 194, 223, ', // Lilac
      'rgba(23, 43, 77, ',    // Ink faint
    ];

    const initStars = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Star density based on screen size
      const count = Math.min(Math.floor((width * height) / 12000), 100);
      stars = [];

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius: Math.random() * 1.5 + 0.5,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.15,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', initStars);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    initStars();

    let time = 0;

    const draw = () => {
      time += 0.02;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw faint constellation links between nearby stars
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.strokeStyle = `rgba(23, 43, 77, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars with twinkling pulse and subtle parallax
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const pulse = Math.sin(time * s.twinkleSpeed * 10 + s.twinklePhase);
        const currentAlpha = Math.max(0.08, s.alpha + pulse * 0.15);
        const currentRadius = Math.max(0.4, s.baseRadius + pulse * 0.3);

        // Subtle parallax movement based on mouse
        const parallaxX = ((mouseX - width / 2) / (width / 2)) * (s.baseRadius * 3);
        const parallaxY = ((mouseY - height / 2) / (height / 2)) * (s.baseRadius * 3);

        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x + parallaxX, s.y + parallaxY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', initStars);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}

