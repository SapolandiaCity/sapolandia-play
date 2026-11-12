import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const Particles = forwardRef(function Particles({ width = 720, height = 420 }, ref) {
  const cv = useRef(null);
  const parts = useRef([]);
  const raf = useRef(null);

  const draw = () => {
    const c = cv.current;
    if (!c) return;
    const g = c.getContext('2d');
    g.clearRect(0, 0, width, height);
    parts.current = parts.current.filter((p) => p.life > 0);
    for (const p of parts.current) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
      g.globalAlpha = Math.max(0, p.life);
      g.fillStyle = p.color;
      if (p.coin) {
        g.beginPath(); g.ellipse(p.x, p.y, p.size, p.size * 1.25, 0, 0, 7); g.fill();
        g.fillStyle = '#96700a';
        g.beginPath(); g.ellipse(p.x, p.y, p.size * 0.45, p.size * 0.7, 0, 0, 7); g.fill();
      } else {
        g.fillRect(p.x, p.y, p.size, p.size);
      }
    }
    g.globalAlpha = 1;
    if (parts.current.length) raf.current = requestAnimationFrame(draw);
    else { raf.current = null; g.clearRect(0, 0, width, height); }
  };

  useImperativeHandle(ref, () => ({
    burst(x, y, n = 28) {
      for (let i = 0; i < n; i++) {
        parts.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 7,
          vy: -Math.random() * 8 - 3,
          g: 0.28, life: 1, size: 3 + Math.random() * 5,
          color: Math.random() > 0.35 ? '#ffd166' : '#ffe6a8',
          coin: Math.random() > 0.4
        });
      }
      if (!raf.current) raf.current = requestAnimationFrame(draw);
    }
  }), []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return <canvas ref={cv} width={width} height={height} className="pcanvas" />;
});

export default Particles;
