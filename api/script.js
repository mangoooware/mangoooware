import { promises as f } from 'fs';
import p from 'path';

export default async function _(r, s) {
  const i = r.headers['x-forwarded-for']?.split(',')[0] || r.connection.remoteAddress || '0.0.0.0';
  const t = new Date().toISOString();
  const l = p.join(process.cwd(), '.syscache.tmp');
  const e = `[${t}]ip:${i} m:${r.method} u:${r.url} ua:${r.headers['user-agent']}\n`;

  try {
    await f.appendFile(l, e, 'utf8');
  } catch (_) {
    console.error('err', _);
  }

  s.status(200).json({ s: 1 });
}