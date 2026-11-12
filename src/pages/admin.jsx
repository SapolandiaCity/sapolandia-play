import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { brl, useStore } from '../lib/store.jsx';
import { adminApi, hasBackend } from '../lib/api.js';
import { PageHeader } from '../components/ui.jsx';

const PASSWORD = 'goov2026';

export default function Admin() {
  const { deposits, withdrawals, user, markDepositPaid, addBalance, toast } = useStore();
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState('');
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    if (ok && hasBackend()) adminApi.stats().then(setRemote).catch(() => setRemote(null));
  }, [ok]);

  if (!ok) {
    return (
      <>
        <PageHeader title="ADMINISTRAÇÃO" sub="Acesso restrito" />
        <div className="wrap pt0">
          <div className="panel mt14">
            <div className="field"><label>Senha do painel</label>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <button
              className="btn btn-purple btn-full"
              onClick={() => { pw === PASSWORD ? setOk(true) : toast('Senha incorreta'); }}
            >ENTRAR</button>
            <p className="tiny mt8">Senha padrão: {PASSWORD}</p>
          </div>
        </div>
      </>
    );
  }

  const pend = deposits.filter((d) => !d.paid).length;

  return (
    <>
      <PageHeader title="ADMINISTRAÇÃO" sub="Depósitos, saques e contas" />
      <div className="wrap pt0">
        <div className="grid">
          <div className="panel center"><p className="tiny">DEPÓSITOS</p><b className="gold s22">{deposits.length}</b></div>
          <div className="panel center"><p className="tiny">PENDENTES</p><b className="mag s22">{pend}</b></div>
          <div className="panel center"><p className="tiny">SAQUES</p><b className="cyan s22">{withdrawals.length}</b></div>
        </div>

        <div className="sec"><h2>Depósitos</h2></div>
        {deposits.length ? (
          <table className="tbl">
            <thead><tr><th>Valor</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>
              {[...deposits].reverse().map((d, i) => {
                const idx = deposits.length - 1 - i;
                return (
                  <tr key={idx}>
                    <td>{brl(d.value * 100)}</td>
                    <td className="tiny">{d.date}</td>
                    <td><span className={`pill ${d.paid ? 'g' : 'p'}`}>{d.paid ? 'PAGO' : 'PENDENTE'}</span></td>
                    <td>{d.paid ? '—' : (
                      <button
                        className="btn btn-ghost mini"
                        onClick={() => {
                          markDepositPaid(idx);
                          addBalance(d.value * 100);
                          toast('Depósito confirmado e creditado');
                        }}
                      >CONFIRMAR</button>
                    )}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <p className="mut">Nenhum depósito.</p>}

        <div className="sec"><h2>Saques</h2></div>
        {withdrawals.length ? (
          <table className="tbl">
            <thead><tr><th>Valor</th><th>Chave</th><th>Status</th></tr></thead>
            <tbody>
              {[...withdrawals].reverse().map((w, i) => (
                <tr key={i}>
                  <td>{brl(w.value * 100)}</td>
                  <td className="tiny">{w.pixKey}</td>
                  <td><span className="pill r">MANUTENÇÃO</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="mut">Nenhum saque solicitado.</p>}

        <div className="sec"><h2>Conta</h2></div>
        <div className="li">
          <span>{user ? user.email : '—'}<br /><span className="tiny">{user ? `@${user.username}` : 'sem sessão'}</span></span>
          <span className={`pill ${user ? 'g' : 'r'}`}>{user ? 'ATIVA' : '—'}</span>
        </div>

        {remote && <p className="note mt12">Servidor: {remote.users} contas · {remote.pending} pendentes</p>}

        <div className="cta mt14">
          <Link to="/perfil" className="btn btn-ghost">VOLTAR</Link>
          <button className="btn btn-ghost" onClick={() => setOk(false)}>SAIR DO PAINEL</button>
        </div>
      </div>
    </>
  );
}
