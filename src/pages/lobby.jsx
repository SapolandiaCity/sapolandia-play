import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATS, GAMES } from '../data/games.js';
import { Symbol } from '../lib/art.jsx';
import { sfxTap } from '../lib/audio.js';
import { useStore } from '../lib/store.jsx';
import { LaunchBanner } from '../components/Promo.jsx';
import { PageHeader } from '../components/ui.jsx';

function Card({ game }) {
  const { favorites, toggleFavorite } = useStore();
  const on = favorites.includes(game.id);
  return (
    <Link to={`/jogar/${game.id}`} className="card">
      <span className="spl">SPL.GOOV</span>
      <button
        className={`fav ${on ? 'on' : ''}`}
        onClick={(e) => { e.preventDefault(); toggleFavorite(game.id); sfxTap(); }}
      >★</button>
      <div className="art" style={{ background: `linear-gradient(160deg,${game.c1}55,${game.c2}99)` }}>
        <Symbol game={game} kind="m" />
      </div>
      <div className="meta"><b>{game.name}</b><i>{game.tag}</i></div>
    </Link>
  );
}

export function Home() {
  return (
    <div className="wrap">
      <LaunchBanner />
      <div className="marq"><div>
        {['★ 20 JOGOS EXCLUSIVOS SPL.GOOV', '★ RODADAS GRÁTIS GOOV', '★ DEPÓSITO VIA PIX', '★ PERSONAGENS ORIGINAIS',
          '★ 20 JOGOS EXCLUSIVOS SPL.GOOV', '★ RODADAS GRÁTIS GOOV', '★ DEPÓSITO VIA PIX', '★ PERSONAGENS ORIGINAIS']
          .map((t, i) => <span key={i}>{t}</span>)}
      </div></div>
      <div className="sec"><h2>Mais jogados <em>SPL.GOOV</em></h2><Link to="/jogos">Ver todos</Link></div>
      <div className="grid">{GAMES.filter((g) => g.hot).map((g) => <Card key={g.id} game={g} />)}</div>
      <div className="sec"><h2>Exclusivos SPL.GOOV</h2></div>
      <div className="grid">{GAMES.slice(4, 10).map((g) => <Card key={g.id} game={g} />)}</div>
      <div className="sec"><h2>Acesso rápido</h2></div>
      <div className="grid two">
        <Link to="/deposito" className="panel quick">
          <span className="qi">⚡</span><b>DEPÓSITO PIX</b><span className="tiny">R$ 10 · R$ 20 · R$ 30</span>
        </Link>
        <Link to="/saque" className="panel quick">
          <span className="qi">💸</span><b>SOLICITAR SAQUE</b><span className="tiny mag">Em manutenção</span>
        </Link>
      </div>
    </div>
  );
}

export function Games() {
  const [cat, setCat] = useState('todos');
  const [q, setQ] = useState('');
  const list = GAMES.filter((g) => (cat === 'todos' || g.cat === cat) && g.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="LOBBY SPL.GOOV" sub={`${GAMES.length} jogos exclusivos · 10 linhas por rodada`} />
      <div className="wrap pt0">
        <input placeholder="Pesquisar jogo…" value={q} onChange={(e) => setQ(e.target.value)} className="mb12" />
        <div className="cats">
          {CATS.map(([k, l]) => (
            <button key={k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>{l}</button>
          ))}
        </div>
        <div className="grid">{list.map((g) => <Card key={g.id} game={g} />)}</div>
      </div>
    </>
  );
}

export function Favorites() {
  const { favorites } = useStore();
  const list = GAMES.filter((g) => favorites.includes(g.id));
  return (
    <>
      <PageHeader title="FAVORITOS" sub={`${list.length} jogo(s) salvos`} />
      <div className="wrap pt0">
        {list.length ? <div className="grid">{list.map((g) => <Card key={g.id} game={g} />)}</div> : (
          <div className="panel empty">
            <div className="empty-i">★</div>
            <b>Nenhum favorito ainda</b>
            <p className="mut">Toque na estrela de um jogo para salvá-lo aqui.</p>
            <Link to="/jogos" className="btn btn-gold mt14">EXPLORAR JOGOS</Link>
          </div>
        )}
      </div>
    </>
  );
}
