import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PIX_CODES, PIX_VALUES } from '../data/pix.js';
import { brl, useStore } from '../lib/store.jsx';
import { sfxCopy, sfxMaint } from '../lib/audio.js';
import { Modal, PageHeader } from '../components/ui.jsx';

function PixModal({ value, onClose }) {
  const [qr, setQr] = useState('');
  const { toast, pushDeposit } = useStore();
  const code = PIX_CODES[value];

  useEffect(() => {
    QRCode.toDataURL(code, { margin: 0, width: 400, errorCorrectionLevel: 'M' })
      .then(setQr).catch(() => setQr(''));
  }, [code]);

  async function copy() {
    try { await navigator.clipboard.writeText(code); }
    catch {
      const t = document.createElement('textarea');
      t.value = code; document.body.appendChild(t); t.select();
      document.execCommand('copy'); t.remove();
    }
    sfxCopy(); toast('Pix copiado');
    pushDeposit({ value, date: new Date().toLocaleString('pt-BR'), paid: false });
  }

  return (
    <Modal onClose={onClose}>
      <div className="between">
        <div><p className="tiny">DEPÓSITO VIA PIX</p><b className="big-gold">{brl(value * 100)}</b></div>
        <span className="pill p">PIX</span>
      </div>
      <div className="qr mt14">{qr ? <img src={qr} alt="QR Code Pix" /> : <span className="tiny">Gerando QR…</span>}</div>
      <p className="tiny center mt8">QR gerado a partir do código abaixo</p>
      <label className="mt14">PIX COPIA E COLA</label>
      <pre className="code">{code}</pre>
      <button className="btn btn-gold btn-full mt10" onClick={copy}>COPIAR PIX</button>
      <button className="btn btn-ghost btn-full mt8" onClick={onClose}>VOLTAR</button>
      <p className="note warn mt12">
        <b>Instruções:</b> abra o app do banco, escolha Pix, cole o código e pague exatamente {brl(value * 100)}.
        O crédito é lançado na confirmação do gateway de pagamento.
      </p>
    </Modal>
  );
}

export function Deposit() {
  const [value, setValue] = useState(null);
  const { deposits } = useStore();
  return (
    <>
      <PageHeader title="DEPÓSITO PIX" sub="Escolha um valor para gerar o código" />
      <div className="wrap pt0">
        <p className="note">Cada valor tem seu código Pix próprio. O crédito entra após a confirmação do pagamento.</p>
        <div className="pixval mt14">
          {PIX_VALUES.map((v) => (
            <button key={v} className="pixcard" onClick={() => setValue(v)}>
              <i>Depositar</i><b>{brl(v * 100)}</b><i className="cyan">PIX</i>
            </button>
          ))}
        </div>
        <div className="panel mt14">
          <b className="s12">Como depositar</b>
          <p className="mut mt8">
            1. Escolha o valor.<br />2. Copie o Pix ou leia o QR.<br />3. Pague no app do banco.<br />4. O crédito entra na confirmação.
          </p>
        </div>
        <div className="sec"><h2>Depósitos gerados</h2></div>
        {deposits.length ? (
          <div className="list">
            {[...deposits].reverse().map((d, i) => (
              <div className="li" key={i}>
                <span>{brl(d.value * 100)}<br /><span className="tiny">{d.date}</span></span>
                <span className={`pill ${d.paid ? 'g' : 'p'}`}>{d.paid ? 'PAGO' : 'AGUARDANDO'}</span>
              </div>
            ))}
          </div>
        ) : <p className="mut">Nenhum código gerado ainda.</p>}
      </div>
      {value && <PixModal value={value} onClose={() => setValue(null)} />}
    </>
  );
}

export function Withdraw() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [keyPix, setKeyPix] = useState('');
  const { withdrawals, pushWithdrawal } = useStore();

  return (
    <>
      <PageHeader title="SAQUE" sub="Solicitações via Pix" />
      <div className="wrap pt0">
        <p className="note bad"><b>Saques temporariamente em manutenção.</b> O formulário já está pronto para o fluxo real.</p>
        <form
          className="panel mt14"
          onSubmit={(e) => {
            e.preventDefault();
            sfxMaint();
            if (value) pushWithdrawal({ value: Number(value), pixKey: keyPix || 'não informada', date: new Date().toLocaleString('pt-BR') });
            setOpen(true);
          }}
        >
          <div className="field"><label>Valor do saque</label>
            <input type="number" placeholder="0,00" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="field"><label>Chave Pix</label>
            <input placeholder="CPF, e-mail, telefone ou aleatória" value={keyPix} onChange={(e) => setKeyPix(e.target.value)} />
          </div>
          <button className="btn btn-gold btn-full" type="submit">SOLICITAR SAQUE</button>
        </form>
        <div className="sec"><h2>Histórico de saques</h2></div>
        {withdrawals.length ? (
          <div className="list">
            {[...withdrawals].reverse().map((w, i) => (
              <div className="li" key={i}>
                <span>{brl(w.value * 100)}<br /><span className="tiny">{w.pixKey}</span></span>
                <span className="pill r">MANUTENÇÃO</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="li">
            <span>R$ 0,00<br /><span className="tiny">Nenhuma solicitação</span></span>
            <span className="pill r">MANUTENÇÃO</span>
          </div>
        )}
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)} className="center">
          <div className="maint-icon">🛠️</div>
          <h3 className="mt8">SAQUES TEMPORARIAMENTE<br />EM MANUTENÇÃO</h3>
          <p className="mut mt10">Estamos trabalhando para disponibilizar essa funcionalidade em breve.</p>
          {(value || keyPix) && (
            <div className="li mt12">
              <span>Valor<br /><b>{value ? brl(Number(value) * 100) : '—'}</b></span>
              <span>Chave<br /><span className="tiny">{keyPix || 'não informada'}</span></span>
            </div>
          )}
          <button className="btn btn-ghost btn-full mt12" onClick={() => setOpen(false)}>VOLTAR</button>
          <p className="tiny mt12">Nenhum valor é debitado enquanto o saque estiver indisponível.</p>
        </Modal>
      )}
    </>
  );
        }
