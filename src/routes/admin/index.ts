import { Router } from 'express';
import { readJson } from '../../utils/dataStore';

const admin = Router();

// ヘルスチェック
admin.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'kintai-backend', time: new Date().toISOString() });
});

// 従業員一覧（無ければ空配列）
admin.get('/employees', async (_req, res) => {
  try {
    const employees = await readJson('employees.json', []);
    res.json({ ok: true, employees });
  } catch (e) {
    console.error('[admin/employees] error:', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 集計API（暫定）
admin.get('/master', async (req, res) => {
  try {
    const date = String(req.query?.date ?? '').trim();
    const employees   = await readJson('employees.json',   []);
    const departments = await readJson('departments.json', []);
    const attendance  = await readJson('attendance.json',  []);
    const remarks     = await readJson('remarks.json',     []);
    res.json({ ok: true, date, employees, departments, attendance, remarks });
  } catch (e) {
    console.error('[admin/master] error:', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default admin;
