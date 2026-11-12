import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import db, { balanceOf, credit } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN = process.env.ADMIN_TOKEN || 'dev-admin';
const BONUS = Number(process.env.BONUS_CENTS || 3000);
const PIX = { 1000: process.env.PIX_10, 2000: process.env.PIX_20, 3000: process.env.PIX_30 };

const sign = (u) => jwt.sign({ id: u.id }, SECRET, { expiresIn: '30d' });
const pub = (u) => ({ id: u.id, name: u.name, username: u.username, email: u.email });

function auth(req, res, next) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.user = db.prepare('SELECT * FROM users WHERE id = ?').get(jwt.verify(t, SECRET).id); }
  catch { return res.status(401).json({ error: 'Sessão inválida' }); }
  if (!req.user) return res.status(401).json({ error: 'Sessão inválida' });
  next();
}

function adminAuth(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN) {
    return res.status(401).json({ error: 'Token administrativo inválido' });
  }
  next();
}

app.post('/auth/register', (req, res) => {
  const { name, username, email, pass } = req.body || {};
  if (!name || !username || !email || !pass) return res.status(400).json({ error: 'Dados incompletos' });
  if (pass.length < 6) return res.status(400).json({ error: 'Senha curta' });

  const exists = db.prepare('SELECT 1 FROM users WHERE email = ? OR username = ?').get(email, username);
  if (exists) return res.status(409).json({ error: 'E-mail ou usuário já cadastrado' });

  const hash = bcrypt.hashSync(pass, 10);
  const run = db.transaction(() => {
    const info = db.prepare(
      'INSERT INTO users (name, username, email, pass_hash, bonus_granted) VALUES (?,?,?,?,1)'
    ).run(name, username, email, hash);
    credit(info.lastInsertRowid, BONUS, 'bonus');
    return info.lastInsertRowid;
  });
  const id = run();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.json({ token: sign(user), user: pub(user), balance: balanceOf(id), bonusGranted: true });
});

app.post('/auth/login', (req, res) => {
  const { email, pass } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(pass || '', user.pass_hash)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  res.json({ token: sign(user), user: pub(user), balance: balanceOf(user.id) });
});

app.get('/me', auth, (req, res) =>
  res.json({ user: pub(req.user), balance: balanceOf(req.user.id) })
);

app.post('/deposits', auth, (req, res) => {
  const amount = Number(req.body?.amount) * 100;
  if (![1000, 2000, 3000].includes(amount)) return res.status(400).json({ error: 'Valor inválido' });
  const txid = crypto.randomBytes(8).toString('hex');
  db.prepare('INSERT INTO deposits (user_id, amount_cents, txid) VALUES (?,?,?)')
    .run(req.user.id, amount, txid);
  res.json({ txid, amount, pixCode: PIX[amount] || null, status: 'pending' });
});

app.get('/deposits', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM deposits WHERE user_id = ? ORDER BY id DESC').all(req.user.id));
});

app.post('/webhooks/pix', (req, res) => {
  const { txid, secret } = req.body || {};
  if (secret !== SECRET) return res.status(401).json({ error: 'Assinatura inválida' });
  const dep = db.prepare('SELECT * FROM deposits WHERE txid = ?').get(txid);
  if (!dep) return res.status(404).json({ error: 'Cobrança não encontrada' });
  if (dep.status === 'paid') return res.json({ ok: true, duplicated: true });

  db.transaction(() => {
    db.prepare("UPDATE deposits SET status = 'paid' WHERE id = ?").run(dep.id);
    credit(dep.user_id, dep.amount_cents, 'deposit', txid);
  })();
  res.json({ ok: true });
});

app.post('/withdrawals', auth, (req, res) => {
  const amount = Number(req.body?.amount) * 100;
  const pixKey = String(req.body?.pixKey || '').trim();
  if (!amount || amount < 2000) return res.status(400).json({ error: 'Valor mínimo de R$ 20' });
  if (!pixKey) return res.status(400).json({ error: 'Informe a chave Pix' });

  db.prepare('INSERT INTO withdrawals (user_id, amount_cents, pix_key) VALUES (?,?,?)')
    .run(req.user.id, amount, pixKey);

  res.status(503).json({
    maintenance: true,
    message: 'SAQUES TEMPORARIAMENTE EM MANUTENÇÃO',
    detail: 'Estamos trabalhando para disponibilizar essa funcionalidade em breve.'
  });
});

app.post('/admin/login', (req, res) => {
  if (req.body?.password !== ADMIN) return res.status(401).json({ error: 'Senha incorreta' });
  res.json({ ok: true });
});

app.get('/admin/stats', adminAuth, (_req, res) => {
  res.json({
    users: db.prepare('SELECT COUNT(*) c FROM users').get().c,
    pending: db.prepare("SELECT COUNT(*) c FROM deposits WHERE status='pending'").get().c,
    paid: db.prepare("SELECT COUNT(*) c FROM deposits WHERE status='paid'").get().c
  });
});

app.get('/admin/deposits', adminAuth, (_req, res) => {
  res.json(db.prepare(
    'SELECT d.*, u.email FROM deposits d JOIN users u ON u.id = d.user_id ORDER BY d.id DESC LIMIT 200'
  ).all());
});

app.post('/admin/deposits/:id/confirm', adminAuth, (req, res) => {
  const dep = db.prepare('SELECT * FROM deposits WHERE id = ?').get(req.params.id);
  if (!dep) return res.status(404).json({ error: 'Não encontrado' });
  if (dep.status === 'paid') return res.json({ ok: true, duplicated: true });
  db.transaction(() => {
    db.prepare("UPDATE deposits SET status='paid' WHERE id = ?").run(dep.id);
    credit(dep.user_id, dep.amount_cents, 'deposit', dep.txid);
  })();
  res.json({ ok: true });
});

app.get('/admin/withdrawals', adminAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM withdrawals ORDER BY id DESC LIMIT 200').all());
});

app.get('/admin/users', adminAuth, (_req, res) => {
  res.json(db.prepare(
    `SELECT id, name, username, email, bonus_granted,
      (SELECT COALESCE(SUM(cents),0) FROM ledger WHERE user_id = users.id) AS balance
     FROM users ORDER BY id DESC LIMIT 200`
  ).all());
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 4000, () => console.log('API on :' + (process.env.PORT || 4000)));
