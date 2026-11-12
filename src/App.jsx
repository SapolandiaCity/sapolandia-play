import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TopBar, BottomNav, Footer, ToastHost } from './components/ui.jsx';
import { LaunchPopup } from './components/Promo.jsx';
import { Home, Games, Favorites } from './pages/lobby.jsx';
import { Deposit, Withdraw } from './pages/money.jsx';
import { Profile, History, Support, Auth } from './pages/account.jsx';
import Admin from './pages/admin.jsx';
import Play from './pages/play.jsx';
import { useStore } from './lib/store.jsx';

export default function App() {
  const { pathname } = useLocation();
  const { seenPopup, markSeen } = useStore();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="shell">
      <TopBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jogos" element={<Games />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/deposito" element={<Deposit />} />
          <Route path="/saque" element={<Withdraw />} />
          <Route path="/jogar/:id" element={<Play />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/historico" element={<History />} />
          <Route path="/atendimento" element={<Support />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/entrar" element={<Auth />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
      {!seenPopup && <LaunchPopup onClose={markSeen} />}
      <ToastHost />
    </div>
  );
}
