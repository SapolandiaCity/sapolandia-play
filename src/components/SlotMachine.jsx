import { useRef, useState } from 'react';
import Reels from './Reels.jsx';
import Particles from './Particles.jsx';
import FreeSpins from './FreeSpins.jsx';
import {
  BET_STEPS, LINES, createFreeState, evaluate, randomGrid, retrigger, tickFree
} from '../lib/engine.js';
import { brl, useStore } from '../lib/store.jsx';
import { beep, sfxBig, sfxLose, sfxSpin, sfxStop, sfxWin } from '../lib/audio.js';

export default function SlotMachine({ game }) {
  const { balance, bet, setBet, debit, addBalance, pushHistory, toast } = useStore();
  const reels = useRef(null);
  const parts = useRef(null);
  const freeRef = useRef({ active: false });
  const autoRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [lines, setLines] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [free, setFree] = useState({ active: false });
  const [auto, setAuto] = useState(0);
  const [summary, setSummary] = useState(null);

  const changeBet = (dir) => {
    const i = Math.max(0, Math.min(BET_STEPS.length - 1, BET_STEPS.indexOf(bet) + dir));
    setBet(BET_STEPS[i]);
    beep(600, 0.05, 'square');
  };

  async function spin() {
    if (spinning) return;
    const isFree = freeRef.current.active;
    const cost = isFree ? 0 : bet;
    if (balance < cost) { toast('Saldo insuficiente para esta aposta'); autoRef.current = 0; setAuto(0); return; }

    setSpinning(true); setLines([]); setLastWin(0); setSummary(null);
    if (cost) debit(cost);
    sfxSpin();

    const grid = randomGrid();
    setTimeout(() => sfxStop(0), 400);
    await reels.current?.spin(grid);
    setSpinning(false);

    const mult = freeRef.current.active ? freeRef.current.mult : game.mult;
    const { total, cells, bonus } = evaluate(grid, bet, mult);
    setLastWin(total);

    if (total > 0) {
      addBalance(total);
      if (freeRef.current.active) {
        freeRef.current.total += total;
        setFree({ ...freeRef.current });
      }
      const big = total >= bet * 25;
      big ? sfxBig() : sfxWin();
      parts.current?.burst(360, 190, big ? 60 : 28);
      toast('Ganhou ' + brl(total));
      setLines(LINES.filter((l) => l.slice(0, 3).every(([c, r]) => cells.includes(`${c}-${r}`))));
      setTimeout(() => setLines([]), 2300);
    } else sfxLose();

    pushHistory({
      game: game.name, bet, win: total, free: isFree,
      date: new Date().toLocaleString('pt-BR')
    });

    if (bonus) {
      if (freeRef.current.active) {
        freeRef.current = retrigger(freeRef.current, 3);
        setFree({ ...freeRef.current });
        toast('RETRIGGER! +5 rodadas grátis');
      } else {
        freeRef.current = createFreeState(grid.flat().filter((s) => s === 'scatter').length);
        setFree({ ...freeRef.current });
        autoRef.current = 0; setAuto(0);
        sfxBig();
        toast('GOOV BÔNUS ativado!');
        setTimeout(() => spin(), 900);
        return;
      }
    }

    if (freeRef.current.active) {
      freeRef.current = tickFree(freeRef.current);
      setFree({ ...freeRef.current });
      if (freeRef.current.left <= 0) {
        const won = freeRef.current.total;
        setTimeout(() => {
          setSummary({ won });
          freeRef.current = { active: false };
          setFree({ active: false });
        }, 900);
        return;
      }
      setTimeout(() => spin(), 700);
      return;
    }

    if (autoRef.current > 0) {
      autoRef.current -= 1;
      setAuto(autoRef.current);
      if (autoRef.current > 0) setTimeout(() => spin(), 700);
    }
  }

  return (
    <div className="slot">
      <div className="slotglow" />
      <div className="between mb9 z6">
        <span className="spl static">SPL.GOOV · {game.name}</span>
        <span className="tiny">APOSTA {brl(bet)}</span>
      </div>

      <div className="reels-wrap">
        <Reels ref={reels} game={game} speed={speed} />
        <Particles ref={parts} />
        <FreeSpins free={free} />
        {lines.length > 0 && (
          <svg className="winline" viewBox="0 0 100 100" preserveAspectRatio="none">
            {lines.slice(0, 6).map((l, i) => (
              <polyline key={i} points={l.map(([c, r]) => `${(c + 0.5) * 20},${(r + 0.5) * 33.3}`).join(' ')} />
            ))}
          </svg>
        )}
      </div>

      <div className="winbar">
        <div><p className="tiny">ÚLTIMO GANHO</p><b>{brl(lastWin)}</b></div>
        <div className="ctrl">
          <div className="speed">
            {[1, 2, 3].map((s) => (
              <button key={s} className={speed === s ? 'on' : ''} onClick={() => setSpeed(s)}>{s}x</button>
            ))}
          </div>
          <button className="btn btn-ghost mini" onClick={() => changeBet(-1)}>−</button>
          <button className="btn btn-ghost mini" onClick={() => changeBet(1)}>+</button>
          <button
            className="btn btn-purple mini"
            onClick={() => { autoRef.current = 10; setAuto(10); spin(); }}
          >AUTO</button>
          <button
            className="btn btn-ghost mini"
            onClick={() => { autoRef.current = 0; setAuto(0); }}
          >PARAR</button>
          <button className="btn btn-gold" onClick={spin} disabled={spinning}>
            {spinning ? '...' : 'GIRAR'}
          </button>
        </div>
      </div>

      <p className="tiny mt8">Autogiro: {auto > 0 ? `${auto} restantes` : 'desligado'}</p>

      {summary && (
        <div className="mask" onClick={() => setSummary(null)}>
          <div className="modal center" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 34 }}>🎉</div>
            <h3 className="mt8">RODADAS GRÁTIS ENCERRADAS</h3>
            <div className="big goldt mt10">{brl(summary.won)}</div>
            <p className="tiny mt8">Total conquistado nas rodadas bônus.</p>
            <button className="btn btn-gold btn-full mt14" onClick={() => setSummary(null)}>CONTINUAR</button>
          </div>
        </div>
      )}
    </div>
  );
        }
