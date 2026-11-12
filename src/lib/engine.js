export const ORDER = ['m','r0','r1','r2','g0','g1','l0','l1','wild','scatter'];
export const WEIGHTS = [2, 4, 5, 6, 7, 8, 11, 12, 2.2, 1.6];

const P = [
  [0,0,25,100,400], [0,0,15,60,250], [0,0,10,40,150], [0,0,8,30,120],
  [0,0,6,20,80], [0,0,5,15,60], [0,0,4,10,40], [0,0,3,8,30], [0,0,0,0,0], [0,0,0,0,0]
];
export const PAYS = P;

export const LINES = [
  [[0,1],[1,1],[2,1],[3,1],[4,1]], [[0,0],[1,0],[2,0],[3,0],[4,0]],
  [[0,2],[1,2],[2,2],[3,2],[4,2]], [[0,0],[1,1],[2,2],[3,1],[4,0]],
  [[0,2],[1,1],[2,0],[3,1],[4,2]], [[0,0],[1,0],[2,1],[3,2],[4,2]],
  [[0,2],[1,2],[2,1],[3,0],[4,0]], [[0,1],[1,0],[2,0],[3,0],[4,1]],
  [[0,1],[1,2],[2,2],[3,2],[4,1]], [[0,0],[1,1],[2,0],[3,1],[4,0]]
];

export const BET_STEPS = [50, 100, 200, 500, 1000];

export function randSymbol() {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let x = Math.random() * total;
  for (let i = 0; i < WEIGHTS.length; i++) { x -= WEIGHTS[i]; if (x <= 0) return ORDER[i]; }
  return 'l0';
}

export const randomGrid = () =>
  Array.from({ length: 5 }, () => Array.from({ length: 3 }, randSymbol));

export function evaluate(grid, bet, mult) {
  let total = 0;
  const cells = [];
  for (const line of LINES) {
    const syms = line.map(([c, r]) => grid[c][r]);
    let base = syms.find((s) => s !== 'wild' && s !== 'scatter');
    if (base === undefined) base = 'wild';
    let n = 0;
    for (const s of syms) { if (s === base || s === 'wild') n++; else break; }
    if (n >= 3) {
      const i = ORDER.indexOf(base);
      if (i >= 0 && i < 8) {
        total += (PAYS[i][n - 1] * bet * mult) / 100;
        line.slice(0, n).forEach(([c, r]) => cells.push(`${c}-${r}`));
      }
    }
  }
  const scatters = grid.flat().filter((s) => s === 'scatter').length;
  return { total: Math.round(total), cells, bonus: scatters >= 3 };
}

export const paytable = (game, bet) =>
  [0,1,2,3,4].map((i) => ({
    symbol: ORDER[i],
    p3: (PAYS[i][2] * bet * game.mult) / 100,
    p4: (PAYS[i][3] * bet * game.mult) / 100,
    p5: (PAYS[i][4] * bet * game.mult) / 100
  }));

export const FREE_SPINS_FOR = (scatters) => (scatters >= 5 ? 20 : scatters === 4 ? 15 : 10);

export function createFreeState(scatters) {
  return { active: true, left: FREE_SPINS_FOR(scatters), mult: 2, total: 0, used: 0 };
}

export function tickFree(state) {
  const used = state.used + 1;
  const mult = used % 5 === 0 ? Math.min(10, state.mult + 1) : state.mult;
  return { ...state, used, mult, left: state.left - 1 };
}

export const retrigger = (state, scatters) =>
  scatters >= 3 ? { ...state, left: state.left + 5 } : state;
