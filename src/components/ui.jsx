import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../lib/art.jsx';
import { brl, useStore } from '../lib/store.jsx';

const NAV = [
  ['/', 'Início', 'M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2z'],
  ['/jogos', 'Jogos', 'M4 6h6v6H4zM14 6h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'],
  ['/deposito', 'Depósito', 'M12 3v13m0 0l-5-5m5 5l5-5M4 21h16'],
  ['/saque', 'Saque', 'M12 21V8m0 0l-5 5m5-5l5 5M4 3h16'],
  ['/perfil', 'Perfil', 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0']
];

export function TopBar() {
  const { balance, avatar, user } = useStore();
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="badge"><Logo size={30} /></span>
        <span className="bword"><b>SAPOLANDIA</b><i>PLAY</i></span>
      </Link>
      <div className="wallet"><small>SALDO</small><b>{brl(balance)}</b></div>
      <Link to="/perfil" className="av">{user ? avatar : '🐸'}</Link>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="bottomnav">
      {NAV.map(([to, label, d]) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>
          <svg viewBox="0 0 24 24"><path d={d} /></svg>{label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <b>SAPOLANDIA PLAY · SPL.GOOV</b>
      <p>Jogue com responsabilidade · +18</p>
    </footer>
  );
}

export function PageHeader({ title, sub }) {
  return (
    <div className="wrap">
      <div className="between mb12">
        <div><h2 className="page-title">{title}</h2><p className="tiny mt4">{sub}</p></div>
        <Link to="/" className="btn btn-ghost">VOLTAR</Link>
      </div>
    </div>
  );
}

export function Modal({ children, onClose, className = '' }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div className="mask" onClick={(e) => e.target.className === 'mask' && onClose?.()}>
      <div className={`modal relative ${className}`}>
        {onClose && <button className="x" onClick={onClose} aria-label="Fechar">✕</button>}
        {children}
      </div>
    </div>
  );
}

export function ToastHost() {
  const { toasts } = useStore();
  return <>{toasts.map((t) => <div key={t.id} className="toast">{t.msg}</div>)}</>;
}
