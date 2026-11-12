import { brl } from '../lib/store.jsx';

export default function FreeSpins({ free }) {
  if (!free?.active) return null;
  return (
    <div className="freebar">
      <span className="kick">GOOV BÔNUS</span>
      <b>{free.left} RODADAS GRÁTIS</b>
      <span className="tiny" style={{ color: '#fff' }}>
        MULTIPLICADOR x{free.mult} · ACUMULADO {brl(free.total)}
      </span>
    </div>
  );
}
