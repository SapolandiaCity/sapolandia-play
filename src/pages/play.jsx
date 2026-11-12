import { useParams, Link } from 'react-router-dom';
import SlotMachine from '../components/SlotMachine.jsx';
import { Symbol } from '../lib/art.jsx';
import { getGame } from '../data/games.js';
import { ORDER, paytable } from '../lib/engine.js';
import { brl, useStore } from '../lib/store.jsx';

export default function Play() {
  const { id } = useParams();
  const game = getGame(id);
  const { bet, balance } = useStore();

  if (!game) return (
    <div className="wrap">
      <p className="mut">Jogo não encontrado.</p>
      <Link to="/jogos" className="btn btn-gold mt12">VER JOGOS</Link>
    </div>
  );

  return (
    <>
      <div className="wrap">
        <div className="between mb12">
          <div>
            <h2 className="page-title">{game.name}</h2>
            <p className="tiny mt4">{game.tag} · 10 linhas · multiplicador x{game.mult}</p>
          </div>
          <Link to="/jogos" className="btn btn-ghost">VOLTAR</Link>
        </div>
      </div>
      <div className="wrap pt0">
        <SlotMachine game={game} />
        <div className="grid two mt12">
          <div className="panel center"><p className="tiny">SALDO</p><b className="gold">{brl(balance)}</b></div>
          <div className="panel center"><p className="tiny">MULTIPLICADOR</p><b className="cyan">x{game.mult}</b></div>
        </div>
        <div className="sec"><h2>Informações do jogo</h2></div>
        <div className="panel">
          {[['Linhas de combinação', '10'], ['Multiplicador base', `x${game.mult}`],
            ['Símbolo WILD', 'substitui todos'], ['3+ GOOV BÔNUS', '10 rodadas grátis']]
            .map(([k, v]) => (
              <div className="between payrow" key={k}><span className="tiny">{k}</span><b className="tiny">{v}</b></div>
            ))}
        </div>
        <div className="sec"><h2>Tabela de prêmios</h2></div>
        <div className="panel">
          {paytable(game, bet).map((row) => (
            <div className="between payrow" key={row.symbol}>
              <span className="paysym"><Symbol game={game} kind={ORDER.includes(row.symbol) ? row.symbol : 'l0'} /></span>
              <span className="tiny">3 = {brl(row.p3)} · 4 = {brl(row.p4)} · 5 = {brl(row.p5)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
