import { Link } from 'react-router-dom';
import { Logo } from '../lib/art.jsx';

export function LaunchBanner() {
  return (
    <section className="hero">
      <span className="kick flick">🔥 Grande lançamento</span>
      <h1>SAPOLANDIA PLAY<br /><span>CHEGOU PARA FICAR</span></h1>
      <p>20 jogos exclusivos SPL.GOOV com personagens originais, rodadas grátis e bônus de boas-vindas.</p>
      <div className="bonus"><b>R$ 30</b><span>BÔNUS DE BOAS-VINDAS<br />novos jogadores</span></div>
      <div className="cta">
        <Link to="/jogos" className="btn btn-gold">JOGAR AGORA</Link>
        <Link to="/entrar" className="btn btn-purple">CRIAR CONTA</Link>
      </div>
      <p className="tiny mt12">Bônus concedido uma única vez por conta · crédito promocional</p>
    </section>
  );
}

export function LaunchPopup({ onClose }) {
  return (
    <div className="mask" onClick={(e) => e.target.className === 'mask' && onClose()}>
      <div className="modal center gold-border relative">
        <button className="x" onClick={onClose}>✕</button>
        <span className="badge pop-badge"><Logo size={34} /></span>
        <span className="kick flick mt12">🎉 Grande lançamento</span>
        <h3 className="mt10">SAPOLANDIA PLAY<br /><span className="gold">CHEGOU PARA FICAR</span></h3>
        <div className="bonus center"><b>R$ 30</b><span>BÔNUS DE BOAS-VINDAS<br />novos jogadores</span></div>
        <p className="mut mt12">20 jogos exclusivos SPL.GOOV, com personagens e artes originais.</p>
        <Link to="/jogos" className="btn btn-gold btn-full mt14" onClick={onClose}>JOGAR AGORA</Link>
        <button className="btn btn-ghost btn-full mt8" onClick={onClose}>FECHAR</button>
      </div>
    </div>
  );
}
