<<<<<<< HEAD
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = 'data';

// データディレクトリが存在しない場合は作成
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

export function readJson<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = join(DATA_DIR, filename);
    if (!existsSync(filePath)) {
      return defaultValue;
    }
    
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

export function writeJson<T>(filename: string, data: T): void {
  try {
    const filePath = join(DATA_DIR, filename);
    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(filePath, jsonData, 'utf8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}
=======
import * as fs from 'fs';
import * as path from 'path';
import { DATA_DIR } from '../config';

export function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readJson<T>(name: string, fallback: T): T {
  try {
    const p = path.join(DATA_DIR, name);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch { return fallback; }
}

export function writeJson(name: string, data: unknown) {
  const p = path.join(DATA_DIR, name);
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, p);
}
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
