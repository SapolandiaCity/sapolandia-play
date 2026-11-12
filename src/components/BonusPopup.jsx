import { useEffect, useRef } from 'react';
import { Logo, SplGoov } from '../lib/art.jsx';
import { sfxBig } from '../lib/audio.js';

export default function BonusPopup({ onClose }) {
  const cv = useRef(null);

  useEffect(() => {
    sfxBig();
    const c = cv.current;
    const g = c.getContext('2d');
    const W = c.width, H = c.height;
    const bits = Array.from({ length: 170 }, () => ({
      x: Math.random() * W, y: -20 - Math.random() * 400,
      vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4.5,
      rot: Math.random() * 7, vr: (Math.random() - 0.5) * 0.32,
      w: 4 + Math.random() * 6, h: 6 + Math.random() * 9,
      color: ['#ffd166', '#c084fc', '#67e8f9', '#ffe6a8', '#fb7ab4'][Math.floor(Math.random() * 5)]
    }));
    let raf;
    const tick = () => {
      g.clearRect(0, 0, W, H);
      for (const b of bits) {
        b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        if (b.y > H + 30) { b.y = -20; b.x = Math.random() * W; }
        g.save(); g.translate(b.x, b.y); g.rotate(b.rot);
        g.fillStyle = b.color; g.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); g.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mask">
      <canvas ref={cv} width={720} height={900} className="confetti" />
      <div className="modal center gold-border">
        <span className="badge pop-badge"><Logo size={34} /></span>
        <span className="kick flick mt12">🎉 Conta criada</span>
        <h3 className="big goldt mt10">PARABÉNS!<br />VOCÊ RECEBEU R$ 30<br />DE BÔNUS DE BOAS-VINDAS!</h3>
        <div className="bonus center"><b>R$ 30</b><span>já creditados<br />no seu saldo</span></div>
        <p className="tiny mt12">
          Bônus único por conta · crédito promocional para jogar nos slots SPL.GOOV · sujeito às condições de uso.
        </p>
        <div className="mt12"><SplGoov height={20} /></div>
        <button className="btn btn-gold btn-full mt14" onClick={onClose}>CONTINUAR</button>
      </div>
    </div>
  );
}
