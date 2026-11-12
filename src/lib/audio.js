let ctx = null;
export const sfx = { on: true };

export function beep(freq = 440, dur = 0.07, type = 'sine', vol = 0.05) {
  if (!sfx.on) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(ctx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.stop(ctx.currentTime + dur);
  } catch { /* autoplay bloqueado */ }
}

export const sfxSpin = () => beep(300, 0.06, 'sawtooth');
export const sfxStop = (i = 0) => beep(520 + i * 70, 0.05, 'square', 0.035);
export const sfxWin = () => { beep(880, 0.14, 'sine', 0.09); setTimeout(() => beep(1180, 0.16, 'sine', 0.08), 120); };
export const sfxBig = () => { sfxWin(); setTimeout(() => beep(1480, 0.2, 'sine', 0.07), 300); };
export const sfxLose = () => beep(180, 0.12, 'sine', 0.04);
export const sfxCopy = () => beep(760, 0.1, 'sine', 0.06);
export const sfxTap = () => beep(600, 0.05, 'square');
export const sfxMaint = () => beep(240, 0.16, 'triangle', 0.05);
