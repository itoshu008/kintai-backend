import { promises as fs } from 'fs';
import path from 'path';
import { DATA_DIR } from '../config.js';

/** JSON ファイルを読む（無ければ defaultValue を返す） */
export async function readJson(relativePath, defaultValue = {}) {
  const filePath = path.join(DATA_DIR, relativePath);
  try {
    const txt = await fs.readFile(filePath, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    if (err && (err.code === 'ENOENT' || err.code === 'EISDIR')) return defaultValue;
    throw err;
  }
}

/** JSON ファイルへ保存（pretty + 改行） */
export async function writeJson(relativePath, data) {
  const filePath = path.join(DATA_DIR, relativePath);
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const body = JSON.stringify(data ?? {}, null, 2) + '\n';
  await fs.writeFile(filePath, body, 'utf8');
}
