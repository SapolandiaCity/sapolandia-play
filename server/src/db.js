import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(here, '..', 'sapolandia.db'));
db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync(path.join(here, 'schema.sql'), 'utf8'));

export const balanceOf = (userId) =>
  db.prepare('SELECT COALESCE(SUM(cents),0) AS b FROM ledger WHERE user_id = ?').get(userId).b;

export const credit = (userId, cents, kind, ref = null) =>
  db.prepare('INSERT INTO ledger (user_id, cents, kind, ref) VALUES (?,?,?,?)').run(userId, cents, kind, ref);

export const debit = (userId, cents, kind, ref = null) =>
  db.prepare('INSERT INTO ledger (user_id, cents, kind, ref) VALUES (?,?,?,?)').run(userId, -cents, kind, ref);

export default db;
