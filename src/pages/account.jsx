import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { brl, useStore } from '../lib/store.jsx';
import { sfxTap } from '../lib/audio.js';
import { PageHeader } from '../components/ui.jsx';
import BonusPopup from '../components/BonusPopup.jsx';

const AVATARS = ['🐸', '👑', '🐯', '🐉', '🦁', '🐼', '🚀', '🍀', '💎', '🔥'];

export function Profile() {
  const { user, avatar, setAvatar, balance, sfxOn, toggleSfx, logout } = useStore();
  return (
    <>
      <PageHeader title="PERFIL" sub="Conta e preferências" />
      <div className="wrap pt0">
        <div className="panel row">
          <div className="av big">{user ? avatar : '🐸'}</div>
          <div>
            <b className="s15">{user ? user.name : 'Visitante'}</b>
            <p className="tiny">{user ? `@${user.username} · ${user.email}` : 'Sem conta'}</p>
            <span className={`pill ${user ? 'g' : 'p'} mt6 inline`}>{user ? 'CONTA ATIVA' : 'MODO VISITANTE'}</span>
          </div>
        </div>
        <div className="sec"><h2>Avatar</h2></div>
        <div className="avpick">
          {AVATARS.map((a) => (
            <button key={a} className={avatar === a ? 'on' : ''} onClick={() => { setAvatar(a); sfxTap(); }}>{a}</button>
          ))}
        </div>
        <div className="sec"><h2>Saldo</h2></div>
        <div className="panel between">
          <div><p className="tiny">SALDO DISPONÍVEL</p><b className="s22 gold">{brl(balance)}</b></div>
          <Link to="/deposito" className="btn btn-ghost">DEPOSITAR</Link>
        </div>
        <div className="sec"><h2>Configurações</h2></div>
        <div className="panel">
          <div className="between mb12">
            <span className="mut">Efeitos sonoros</span>
            <button className="btn btn-ghost" onClick={toggleSfx}>{sfxOn ? 'LIGADO' : 'DESLIGADO'}</button>
          </div>
          <div className="between">
            <span className="mut">Painel administrativo</span>
            <Link to="/admin" className="btn btn-ghost">ABRIR</Link>
          </div>
        </div>
        <div className="cta mt14">
          <Link to="/historico" className="btn btn-ghost">HISTÓRICO</Link>
          <Link to="/atendimento" className="btn btn-ghost">ATENDIMENTO</Link>
          {user
            ? <button className="btn btn-ghost" onClick={logout}>SAIR</button>
            : <Link to="/entrar" className="btn btn-gold">ENTRAR / CRIAR CONTA</Link>}
        </div>
      </div>
    </>
  );
}

export function Auth() {
  const [tab, setTab] = useState('reg');
  const [f, setF] = useState({ name: '', username: '', email: '', pass: '', confirm: '' });
  const [err, setErr] = useState('');
  const [bonus, setBonus] = useState(false);
  const { register, login, toast } = useStore();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (tab === 'reg') {
      if (!f.name || !f.username || !f.email) return setErr('Preencha nome, usuário e e-mail.');
      if (f.pass.length < 6) return setErr('A senha precisa ter ao menos 6 caracteres.');
      if (f.pass !== f.confirm) return setErr('As senhas não coincidem.');
      try {
        const r = await register(f);
        if (r.bonusGranted) setBonus(true);
        else { toast('Conta criada'); nav('/'); }
      } catch (e2) { setErr(e2.message); }
    } else {
      if (!f.email) return setErr('Informe o e-mail.');
      try { await login(f); toast('Bem-vindo de volta'); nav('/'); }
      catch (e2) { setErr(e2.message); }
    }
  }

  return (
    <>
      <PageHeader title={tab === 'reg' ? 'CRIAR CONTA' : 'ENTRAR'} sub="Bônus de R$ 30 na primeira conta" />
      <div className="wrap pt0">
        <div className="cats">
          <button className={tab === 'reg' ? 'on' : ''} onClick={() => setTab('reg')}>CADASTRO</button>
          <button className={tab === 'log' ? 'on' : ''} onClick={() => setTab('log')}>LOGIN</button>
        </div>
        <form className="panel" onSubmit={submit}>
          {tab === 'reg' && (
            <>
              <div className="field"><label>Nome completo</label><input value={f.name} onChange={set('name')} placeholder="Seu nome" /></div>
              <div className="field"><label>Nome de usuário</label><input value={f.username} onChange={set('username')} placeholder="seunome" /></div>
            </>
          )}
          <div className="field"><label>E-mail</label><input type="email" value={f.email} onChange={set('email')} placeholder="voce@email.com" /></div>
          <div className="field"><label>Senha</label><input type="password" value={f.pass} onChange={set('pass')} placeholder="mínimo 6 caracteres" /></div>
          {tab === 'reg' && (
            <div className="field"><label>Confirmar senha</label><input type="password" value={f.confirm} onChange={set('confirm')} placeholder="repita a senha" /></div>
          )}
          {err && <span className="err">{err}</span>}
          <button className={`btn ${tab === 'reg' ? 'btn-gold' : 'btn-cyan'} btn-full`} type="submit">
            {tab === 'reg' ? 'CRIAR CONTA E GANHAR R$ 30' : 'ENTRAR'}
          </button>
        </form>
        <p className="note warn mt12">
          Bônus único por conta, creditado como saldo promocional para jogar. Sujeito às condições de uso.
        </p>
      </div>
      {bonus && <BonusPopup onClose={() => { setBonus(false); nav('/jogos'); }} />}
    </>
  );
}

export function History() {
  const { history } = useStore();
  return (
    <>
      <PageHeader title="HISTÓRICO" sub="Suas rodadas" />
      <div className="wrap pt0">
        {history.length ? (
          <div className="list">
            {[...history].reverse().slice(0, 40).map((h, i) => (
              <div className="li" key={i}>
                <span>
                  {h.game} {h.free && <span className="pill p">GRÁTIS</span>}
                  <br /><span className="tiny">{h.date} · aposta {brl(h.bet)}</span>
                </span>
                <span className={`pill ${h.win > 0 ? 'g' : 'r'}`}>{h.win > 0 ? '+' : ''}{brl(h.win)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel empty">
            <p className="mut">Nenhuma rodada ainda.</p>
            <Link to="/jogos" className="btn btn-gold mt14">JOGAR AGORA</Link>
          </div>
        )}
      </div>
    </>
  );
}

export function Support() {
  const FAQ = [
    ['O depósito cai na hora?', 'O crédito é lançado na confirmação do gateway de pagamento.'],
    ['Posso sacar agora?', 'O saque está temporariamente em manutenção.'],
    ['O bônus de R$ 30 é sacável?', 'É crédito promocional para jogar nos slots, sujeito às condições de uso.'],
    ['Como funcionam as rodadas grátis?', '3 símbolos GOOV BÔNUS liberam 10 rodadas grátis com multiplicador crescente.']
  ];
  return (
    <>
      <PageHeader title="ATENDIMENTO" sub="Central de ajuda" />
      <div className="wrap pt0">
        <div className="panel">
          <b className="s12">Perguntas frequentes</b>
          {FAQ.map(([q, a]) => <div className="mut mt10" key={q}><b className="light">{q}</b><br />{a}</div>)}
        </div>
        <div className="panel mt12">
          <b className="s12">Fale com a gente</b>
          <p className="mut mt8">Canal de suporte configurável no README do projeto.</p>
        </div>
      </div>
    </>
  );
            }
