import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, getAdmin, hasBackend, setAdmin, setToken, getToken } from './api.js';
import { sfx } from './audio.js';

const KEY = 'spl_state_v3';
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const DEFAULTS = {
  user: null, balance: 0, favorites: [], history: [], deposits: [],
  withdrawals: [], bet: 100, avatar: '🐸', bonusGranted: false
};

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return DEFAULTS; }
  });
  const [toasts, setToasts] = useState([]);
  const [seenPopup, setSeenPopup] = useState(() => !!localStorage.getItem('spl_popup'));
  const seq = useRef(0);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);

  useEffect(() => {
    if (!hasBackend() || !getToken()) return;
    api.me()
      .then((me) => setState((s) => ({ ...s, user: me.user, balance: me.balance })))
      .catch(() => setToken(''));
  }, []);

  const value = useMemo(() => ({
    ...state,
    backend: hasBackend(),
    adminToken: getAdmin(),
    sfxOn: sfx.on,
    toasts,
    seenPopup,
    markSeen() { localStorage.setItem('spl_popup', '1'); setSeenPopup(true); },
    toast(msg) {
      const id = ++seq.current;
      setToasts((t) => [...t, { id, msg }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
    },
    toggleSfx() { sfx.on = !sfx.on; setState((s) => ({ ...s })); },
    setBet(bet) { setState((s) => ({ ...s, bet })); },
    setAvatar(avatar) { setState((s) => ({ ...s, avatar })); },
    setAdminToken(t) { setAdmin(t); setState((s) => ({ ...s })); },
    toggleFavorite(id) {
      setState((s) => ({
        ...s,
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((x) => x !== id)
          : [...s.favorites, id]
      }));
    },
    addBalance(v) { setState((s) => ({ ...s, balance: s.balance + v })); },
    debit(v) { setState((s) => ({ ...s, balance: Math.max(0, s.balance - v) })); },
    pushHistory(e) { setState((s) => ({ ...s, history: [...s.history.slice(-149), e] })); },
    pushDeposit(e) { setState((s) => ({ ...s, deposits: [...s.deposits, e] })); },
    pushWithdrawal(w) { setState((s) => ({ ...s, withdrawals: [...s.withdrawals, w] })); },
    markDepositPaid(index) {
      setState((s) => ({
        ...s,
        deposits: s.deposits.map((d, i) => (i === index ? { ...d, paid: true } : d))
      }));
    },

    async register(payload) {
      if (hasBackend()) {
        const r = await api.register(payload);
        setToken(r.token);
        setState((s) => ({ ...s, user: r.user, balance: r.balance, bonusGranted: true }));
        return r;
      }
      const granted = !state.bonusGranted;
      setState((s) => ({
        ...s,
        user: { name: payload.name, username: payload.username, email: payload.email },
        balance: s.balance + (granted ? 3000 : 0),
        bonusGranted: true
      }));
      return { bonusGranted: granted };
    },

    async login(payload) {
      if (hasBackend()) {
        const r = await api.login(payload);
        setToken(r.token);
        setState((s) => ({ ...s, user: r.user, balance: r.balance }));
        return r;
      }
      const nick = payload.email.split('@')[0];
      setState((s) => ({ ...s, user: { name: nick, username: nick, email: payload.email } }));
    },

    logout() { setToken(''); setState((s) => ({ ...s, user: null })); }
  }), [state, toasts, seenPopup]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
