import { readJson } from '../utils/dataStore.js';
export function mountAdminMaster(app) {
    app.get('/api/admin/master', (req, res) => {
        const date = String(req.query.date ?? '');
        const employees = readJson('employees.json', []);
        const departments = readJson('departments.json', []);
        const attendance = readJson('attendance.json', []);
        const remarks = readJson('remarks.json', []);
        // フロントエンドが期待する形式に合わせる
        return res.json({
            ok: true,
            date,
            employees,
            departments,
            attendance,
            remarks,
            // 互換性のため list も含める
            list: employees
        });
    });
}
