import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Symbol } from '../lib/art.jsx';
import { randSymbol } from '../lib/engine.js';

const STRIP = 30;
const renderSym = (game, kind) => renderToStaticMarkup(<Symbol game={game} kind={kind} />);

const Reels = forwardRef(function Reels({ game, speed }, ref) {
  const box = useRef(null);
  const strips = useRef([]);
  const eng = useRef([]);
  const raf = useRef(null);
  const cell = useRef(64);
  const resolveRef = useRef(null);

  const measure = () => { if (box.current) cell.current = box.current.clientHeight / 3; };
  const paint = (i, pos) => { if (strips.current[i]) strips.current[i].style.transform = `translateY(${-pos}px)`; };
  const strip = () => Array.from({ length: STRIP }, randSymbol);

  function loop() {
    let active = false;
    eng.current.forEach((r, i) => {
      if (!r) return;
      if (r.state === 'spin') {
        active = true;
        r.pos += r.vel / 60;
        const max = cell.current * STRIP;
        if (r.pos > max) r.pos -= max;
        paint(i, r.pos);
      } else if (r.state === 'land') {
        active = true;
        const p = Math.min(1, (performance.now() - r.t0) / r.dur);
        const eased = 1 - Math.pow(1 - p, 3);
        r.pos = r.from + (r.to - r.from) * eased;
        paint(i, r.pos);
        if (p >= 1) { r.state = 'idle'; r.el.classList.remove('spin', 'fast'); }
      }
    });
    if (active) raf.current = requestAnimationFrame(loop);
    else { raf.current = null; resolveRef.current?.(); resolveRef.current = null; }
  }

  useImperativeHandle(ref, () => ({
    spin(results) {
      measure();
      eng.current.forEach((r, i) => {
        if (!r) return;
        r.state = 'spin';
        r.vel = 2200 * speed;
        r.el.classList.add('spin', 'fast');
        paint(i, r.pos);
      });
      if (!raf.current) raf.current = requestAnimationFrame(loop);

      return new Promise((resolve) => {
        resolveRef.current = resolve;
        results.forEach((col, i) => {
          setTimeout(() => {
            const r = eng.current[i];
            if (!r) return;
            r.from = r.pos;
            r.to = cell.current * STRIP;
            r.t0 = performance.now();
            r.dur = (760 + i * 95) / speed;
            r.state = 'land';
            r.el.classList.remove('fast');
            r.strip.innerHTML = strip().map((k) => `<div class="cell">${renderSym(game, k)}</div>`).join('')
              + col.map((k) => `<div class="cell">${renderSym(game, k)}</div>`).join('');
            paint(i, r.pos);
          }, (500 + i * 190) / speed);
        });
      });
    }
  }), [game, speed]);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <div className="reels" ref={box}>
      {[0, 1, 2, 3, 4].map((c) => (
        <div
          className="col"
          key={c}
          ref={(el) => {
            if (!el) return;
            if (!eng.current[c]) {
              eng.current[c] = { el, state: 'idle', pos: Math.random() * 900, vel: 0, from: 0, to: 0, t0: 0, dur: 0 };
            } else {
              eng.current[c].el = el;
            }
          }}
        >
          <div className="strip" ref={(el) => { strips.current[c] = el; }}>
            {Array.from({ length: STRIP }, (_, i) => (
              <div className="cell" key={i}><Symbol game={game} kind={randSymbol()} /></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default Reels;
