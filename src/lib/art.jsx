const R = (c1, c2) => ({ stroke: c2, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round' });

function Relic({ kind, c1, c2 }) {
  const p = R(c1, c2);
  const S = {
    coin: (<><circle cx="50" cy="50" r="30" fill={c1} {...p} /><circle cx="50" cy="50" r="22" fill="none" {...p} opacity=".55" /><path d="M50 34l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill={c2} /></>),
    claw: <path d="M28 74q4-30 18-42 3 22-4 42zM50 74q0-34 10-46 6 24-1 46zM68 74q-4-28 6-40 8 22 4 40z" fill={c1} {...p} />,
    stripe: <path d="M50 20q18 0 26 16-14 2-20 8 12 6 14 20-16-2-22-10 2 10-2 18-8-10-8-24 0-28 12-28z" fill={c1} {...p} />,
    clover: (<><circle cx="36" cy="38" r="13" fill={c1} {...p} /><circle cx="64" cy="38" r="13" fill={c1} {...p} /><circle cx="36" cy="64" r="13" fill={c1} {...p} /><circle cx="64" cy="64" r="13" fill={c1} {...p} /><circle cx="50" cy="50" r="6" fill={c2} /></>),
    carrot: (<><path d="M50 24q16 4 16 20-8 26-16 32-8-6-16-32 0-16 16-20z" fill={c1} {...p} /><path d="M42 26q-8-10-2-14M58 26q8-10 2-14" fill="none" {...p} /></>),
    horseshoe: (<><path d="M30 78V52a20 20 0 0140 0v26h-9V52a11 11 0 00-22 0v26z" fill={c1} {...p} /><circle cx="35" cy="70" r="3" fill={c2} /><circle cx="65" cy="70" r="3" fill={c2} /></>),
    bell: (<><path d="M50 22a16 16 0 0116 16v16l6 8H28l6-8V38a16 16 0 0116-16z" fill={c1} {...p} /><circle cx="50" cy="72" r="6" fill={c2} {...p} /><circle cx="50" cy="18" r="4" fill={c2} /></>),
    flame: (<><path d="M50 16q16 20 16 34a16 16 0 11-32 0q0-14 16-34z" fill={c1} {...p} /><path d="M50 44q7 9 7 16a7 7 0 11-14 0q0-7 7-16z" fill={c2} opacity=".65" /></>),
    scale: (<><path d="M50 22l22 12-22 12-22-12z" fill={c1} {...p} /><path d="M50 46v28M38 74h24" fill="none" {...p} /></>),
    shell: (<><path d="M50 78a26 26 0 110-52 26 26 0 010 52z" fill={c1} {...p} /><path d="M50 78V28M38 74l8-44M62 74l-8-44" fill="none" {...p} opacity=".55" /></>),
    bubble: (<><circle cx="40" cy="44" r="15" fill={c1} {...p} opacity=".9" /><circle cx="64" cy="62" r="11" fill={c1} {...p} opacity=".8" /><circle cx="60" cy="30" r="7" fill={c1} {...p} opacity=".7" /></>),
    cherry: (<><circle cx="38" cy="62" r="16" fill={c1} {...p} /><circle cx="66" cy="70" r="13" fill={c1} {...p} /><path d="M38 46q4-22 22-28M66 57q2-18-6-39" fill="none" {...p} /></>),
    grape: (<><circle cx="38" cy="42" r="10" fill={c1} {...p} /><circle cx="60" cy="42" r="10" fill={c1} {...p} /><circle cx="48" cy="58" r="10" fill={c1} {...p} /><circle cx="66" cy="60" r="9" fill={c1} {...p} /></>),
    star: <path d="M50 18l9 21 23 2-17 16 5 23-20-12-20 12 5-23-17-16 23-2z" fill={c1} {...p} />,
    rocket: (<><path d="M50 16q14 12 14 30l-14 12-14-12q0-18 14-30z" fill={c1} {...p} /><circle cx="50" cy="40" r="6" fill={c2} /><path d="M36 52l-8 14 10-2M64 52l8 14-10-2M50 60v16" fill="none" {...p} /></>),
    planet: (<><circle cx="50" cy="50" r="20" fill={c1} {...p} /><ellipse cx="50" cy="50" rx="34" ry="10" fill="none" {...p} transform="rotate(-22 50 50)" /></>),
    wheel: (<><circle cx="50" cy="50" r="28" fill="none" {...p} /><path d="M50 22v56M22 50h56M30 30l40 40M70 30L30 70" {...p} /><circle cx="50" cy="50" r="6" fill={c1} {...p} /></>),
    potion: (<><path d="M42 20h16v12q14 6 14 22a22 22 0 11-44 0q0-16 14-22z" fill={c1} {...p} /><path d="M31 56h38" {...p} /></>),
    rune: (<><circle cx="50" cy="50" r="28" fill="none" {...p} /><path d="M50 26v48M50 26l14 12M50 44l-14 12" {...p} /></>),
    bamboo: (<><rect x="36" y="22" width="13" height="56" rx="5" fill={c1} {...p} /><rect x="56" y="32" width="11" height="46" rx="5" fill={c1} {...p} /></>),
    lantern: (<><rect x="34" y="32" width="32" height="36" rx="8" fill={c1} {...p} /><path d="M50 18v14M30 68h40M42 44v14M58 44v14" {...p} /></>),
    banana: <path d="M26 40q4 32 34 34 16 0 16-12-6 4-14 2Q38 60 36 38z" fill={c1} {...p} />,
    staff: (<><rect x="46" y="24" width="8" height="54" rx="4" fill={c1} {...p} /><circle cx="50" cy="22" r="9" fill="none" {...p} /></>),
    crown: (<><path d="M28 66h44l6-30-16 12-12-18-12 18-16-12z" fill={c1} {...p} /><circle cx="50" cy="42" r="3" fill={c2} /></>),
    feather: (<><path d="M50 80V28q18 8 16 26-2 14-16 26z" fill={c1} {...p} /><path d="M50 34l-8 8M50 46l-10 10M50 58l-8 8" {...p} /></>),
    diamond: (<><path d="M50 22l22 20-22 36-22-36z" fill={c1} {...p} /><path d="M28 42h44M50 22v56" {...p} opacity=".6" /></>),
    pick: (<><path d="M24 66q22-26 52-32" fill="none" {...p} /><path d="M74 30l-4 16-12-8z" fill={c1} {...p} /></>),
    gem: <path d="M50 24l16 16-16 32-16-32z" fill={c1} {...p} />,
    ufo: (<><ellipse cx="50" cy="56" rx="26" ry="10" fill={c1} {...p} /><path d="M36 50a14 12 0 0128 0" fill={c1} {...p} /><circle cx="38" cy="58" r="2.6" fill={c2} /><circle cx="62" cy="58" r="2.6" fill={c2} /></>),
    candy: (<><circle cx="50" cy="50" r="20" fill={c1} {...p} /><path d="M22 50l10-10v20zM78 50L68 40v20z" fill={c1} {...p} /></>),
    lollipop: (<><circle cx="50" cy="38" r="18" fill={c1} {...p} /><path d="M50 56v26" {...p} /></>),
    leaf: (<><path d="M50 78q-22-10-22-30 0-18 22-26 22 8 22 26 0 20-22 30z" fill={c1} {...p} /><path d="M50 78V30" {...p} /></>),
    vine: <path d="M30 76q16-6 16-22t16-22q14-4 12-14" fill="none" {...p} />,
    chest: (<><rect x="26" y="44" width="48" height="30" rx="5" fill={c1} {...p} /><path d="M26 54a24 18 0 0148 0" fill={c1} {...p} /><rect x="46" y="50" width="8" height="12" rx="2" fill={c2} /></>),
    compass: (<><circle cx="50" cy="50" r="26" fill="none" {...p} /><path d="M50 26l8 24-8 24-8-24z" fill={c1} {...p} /></>),
    seven: <text x="50" y="70" textAnchor="middle" fontSize="54" fontWeight="900" fill={c1} stroke={c2} strokeWidth="2">7</text>
  };
  return S[kind] || <circle cx="50" cy="50" r="28" fill={c1} />;
}

function Creature({ game }) {
  const { ear, f1, f2, horn } = game.art;
  const s = { stroke: f2, strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' };
  const E = {
    cat: <path d="M24 40l-2-22 22 10zM76 40l2-22-22 10z" fill={f1} {...s} />,
    long: (<><ellipse cx="34" cy="24" rx="8" ry="20" fill={f1} {...s} /><ellipse cx="66" cy="24" rx="8" ry="20" fill={f1} {...s} /></>),
    round: (<><circle cx="26" cy="42" r="12" fill={f1} {...s} /><circle cx="74" cy="42" r="12" fill={f1} {...s} /></>),
    fin: (<><path d="M50 16l12 16-12 6-12-6z" fill={f1} {...s} /><path d="M20 54l-10 12 14 4zM80 54l10 12-14 4z" fill={f1} {...s} /></>),
    leaf: <path d="M30 30q-14-12-20 2 8 12 22 6zM70 30q14-12 20 2-8 12-22 6z" fill={f1} {...s} />,
    spike: <path d="M50 14l8 18-8 4-8-4z" fill={f1} {...s} />,
    horse: <path d="M30 32l-4-18 14 8zM70 32l4-18-14 8z" fill={f1} {...s} />,
    panda: (<><circle cx="24" cy="30" r="12" fill={f2} /><circle cx="76" cy="30" r="12" fill={f2} /></>),
    monkey: (<><circle cx="20" cy="50" r="13" fill={f1} {...s} /><circle cx="80" cy="50" r="13" fill={f1} {...s} /></>),
    feather: <path d="M50 14q12 8 8 20-8-4-8-20zM42 18q-8 10-2 20 6-6 2-20z" fill={f1} {...s} />,
    antenna: (<><path d="M40 20l-6-12M60 20l6-12" {...s} /><circle cx="33" cy="7" r="4" fill={f1} /><circle cx="67" cy="7" r="4" fill={f1} /></>),
    candy: <path d="M26 34l-12-8v20zM74 34l12-8v20z" fill={f1} {...s} />,
    bandana: (<><path d="M22 40h56v-8q-28-12-56 0z" fill={f1} {...s} /><path d="M78 36l14 6-6 8z" fill={f1} {...s} /></>),
    crown2: <path d="M30 28h40l6-16-13 8-13-12-13 12-13-8z" fill="#ffd700" stroke="#8a6a00" strokeWidth="2.4" />
  };
  const H = {
    bull: <path d="M20 40q-14-6-12-18 10 2 14 12zM80 40q14-6 12-18-10 2-14 12z" fill="#f7e9d2" {...s} />,
    dragon: <path d="M28 30l-6-14 12 6zM72 30l6-14-12 6z" fill="#ffe9a8" {...s} />,
    wizard: (<><path d="M50 8l16 26H34z" fill="#6b3fb8" {...s} /><circle cx="50" cy="24" r="3" fill="#ffe9a8" /></>),
    crest: <path d="M50 8q10 10 4 20-10-6-4-20z" fill="#ffe9a8" {...s} />,
    helmet: (<><path d="M28 40a22 22 0 0144 0z" fill="#ffc247" {...s} /><circle cx="50" cy="30" r="4" fill="#fff" /></>),
    crown: <path d="M32 24h36l5-12-12 6-11-10-11 10-12-6z" fill="#ffd700" stroke="#8a6a00" strokeWidth="2.2" />
  };
  const gid = `bg-${game.id}`;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={f1} /><stop offset="1" stopColor={f2} />
      </linearGradient></defs>
      {E[ear]}{horn && H[horn]}
      <ellipse cx="50" cy="56" rx="26" ry="28" fill={`url(#${gid})`} {...s} />
      <circle cx="40" cy="52" r="7" fill="#fff" stroke={f2} strokeWidth="2" />
      <circle cx="60" cy="52" r="7" fill="#fff" stroke={f2} strokeWidth="2" />
      <circle cx="41" cy="53" r="3.4" fill="#1d2238" /><circle cx="59" cy="53" r="3.4" fill="#1d2238" />
      <path d="M42 68q8 8 16 0" fill="none" {...s} />
    </svg>
  );
}

export function Symbol({ game, kind }) {
  if (kind === 'wild') return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id={`w-${game.id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff8dc" /><stop offset="1" stopColor="#e8b524" />
      </linearGradient></defs>
      <path d="M50 10l11 12 16-3 3 16 12 15-12 15-3 16-16-3-11 12-11-12-16 3-3-16L8 50l12-15 3-16 16 3z"
        fill={`url(#w-${game.id})`} stroke="#96700a" strokeWidth="2.6" />
      <text x="50" y="47" textAnchor="middle" fontSize="15" fontWeight="900" fill="#42300a">WILD</text>
      <text x="50" y="66" textAnchor="middle" fontSize="16" fontWeight="900" fill="#42300a">x2</text>
    </svg>
  );
  if (kind === 'scatter') return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="30" fill="#2c2350" stroke="#c084fc" strokeWidth="3" />
      <circle cx="50" cy="50" r="24" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 4" opacity=".8" />
      <text x="50" y="45" textAnchor="middle" fontSize="13" fontWeight="900" fill="#e5ccff">GOOV</text>
      <text x="50" y="64" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ffd166">BÔNUS</text>
    </svg>
  );
  if (kind === 'm') return <Creature game={game} />;
  if (kind === 'g0' || kind === 'g1') return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id={`gg-${game.id}-${kind}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={kind === 'g0' ? game.c1 : game.c2} />
        <stop offset="1" stopColor={kind === 'g0' ? '#ffffff' : game.c1} />
      </linearGradient></defs>
      <path d="M50 14l26 18v30L50 84 24 62V32z" fill={`url(#gg-${game.id}-${kind})`} stroke={game.c2} strokeWidth="2.6" />
      <path d="M50 32l8 10-8 14-8-14z" fill="#fff" opacity=".85" />
    </svg>
  );
  if (kind === 'l0' || kind === 'l1') return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="22" y="22" width="56" height="56" rx="14" fill={kind === 'l0' ? '#333a5e' : '#3a2f58'} stroke={game.c1} strokeWidth="2.6" />
      <text x="50" y="66" textAnchor="middle" fontSize="34" fontWeight="900" fill={game.c1}>{kind === 'l0' ? 'A' : 'K'}</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id={`rg-${game.id}-${kind}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={game.c1} /><stop offset="1" stopColor={game.c2} />
      </linearGradient></defs>
      <Relic kind={game.relics[Number(kind[1])]} c1={`url(#rg-${game.id}-${kind})`} c2={game.c2} />
    </svg>
  );
}

export function Logo({ size = 38 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <defs><linearGradient id="logo-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff6d0" /><stop offset=".55" stopColor="#ffd166" /><stop offset="1" stopColor="#c79a2e" />
      </linearGradient></defs>
      <path d="M50 8l11 9 14-2 4 13 12 8-6 13 6 13-12 8-4 13-14-2-11 9-11-9-14 2-4-13-12-8 6-13-6-13 12-8 4-13 14 2z"
        fill="none" stroke="url(#logo-g)" strokeWidth="5" />
      <circle cx="50" cy="44" r="15" fill="url(#logo-g)" />
      <circle cx="44" cy="40" r="4" fill="#252a44" /><circle cx="56" cy="40" r="4" fill="#252a44" />
      <path d="M41 51q9 9 18 0" stroke="#252a44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M50 66v14M42 80h16" stroke="url(#logo-g)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function SplGoov({ height = 18 }) {
  return (
    <svg viewBox="0 0 150 34" height={height} aria-hidden="true">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e5ccff" /><stop offset="1" stopColor="#c084fc" />
      </linearGradient></defs>
      <text x="0" y="25" fontSize="21" fontWeight="900" fill="url(#sg)" letterSpacing="1">SPL.GOOV</text>
    </svg>
  );
    }
