import { writeFileSync, renameSync } from 'fs';
export function writeJsonAtomic(file, data) {
    const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
    writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600, encoding: 'utf8' });
    renameSync(tmp, file); // 同一FSなら実質アトミック
}
