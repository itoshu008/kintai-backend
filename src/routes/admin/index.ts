// backend/src/routes/admin/index.ts
import { Router } from 'express';
<<<<<<< HEAD
import { readJson, writeJson } from '../../utils/dataStore.js';
import { Employee, Department, AttendanceItem, Remark, SessionsMap, BackupMeta, BackupBlob } from '../../types.js';

// ---- 型定義（最小限・今回のエラー対策）----
type ISODateTime = string;

export interface Department {
  id: number;
  name: string;
  created_at: ISODateTime;
  updated_at?: ISODateTime;
}

export interface Employee {
  code: string;
  name: string;
  department_id: number;
  created_at: ISODateTime;
  updated_at?: ISODateTime;
}

export interface Remark {
  code: string;
  date: string;             // YYYY-MM-DD
  remark: string;
  created_at: ISODateTime;
  updated_at?: ISODateTime;
}

export interface AttendanceItem {
  employeeCode: string;
  date: string;             // YYYY-MM-DD
  clock_in: string | null;
  clock_out: string | null;
  work_hours: number;
  // 追加：今回エラーで要求されていたフィールド
  updated_at?: ISODateTime;
  code?: string;            // 既存コードが code を入れているため許容
}

export interface BackupBlob {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceItem[];
  remarks: Remark[];
}

export interface BackupMeta {
  id: string;
  timestamp: ISODateTime;
  reason: any;
  size: number;
  name: string;
}

type SessionInfo = {
  tmpDir?: string;
  zipPath?: string;
  createdAt: ISODateTime;
};
type SessionsMap = Record<string, SessionInfo>;
// ---- 型定義ここまで ----
=======
import { readJson, writeJson } from '../../utils/dataStore';
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)

export const admin = Router();

// 既存: ヘルス
admin.get('/health', (_req, res) => res.json({ ok: true }));

// ============================================================================
// 部署管理 API
// ============================================================================

// 部署一覧取得
admin.get('/departments', (_req, res) => {
  try {
<<<<<<< HEAD
    const departments = readJson<Department[]>('departments.json', []);
=======
    const departments = readJson('departments.json', []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    res.json({ ok: true, items: departments });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to read departments' });
  }
});

// 部署追加
admin.post('/departments', (req, res) => {
  try {
    const name = (req.body?.name ?? '').toString().trim();
    if (!name) return res.status(400).json({ ok: false, error: 'name required' });
    
<<<<<<< HEAD
    const departments = readJson<Department[]>('departments.json', []);
=======
    const departments = readJson('departments.json', []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    const id = Date.now();
    const dept = { id, name, created_at: new Date().toISOString() };
    departments.push(dept);
    writeJson('departments.json', departments);
    
<<<<<<< HEAD
    // フロントエンドの即座の状態更新のため、更新された一覧を返す
    res.status(201).json({ ok: true, item: dept, departments: departments });
=======
    res.status(201).json({ ok: true, item: dept });
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to create department' });
  }
});

// 部署更新
admin.put('/departments/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const name = (req.body?.name ?? '').toString().trim();
    if (!name) return res.status(400).json({ ok: false, error: 'name required' });
    
<<<<<<< HEAD
    const departments = readJson<Department[]>('departments.json', []);
    const index = departments.findIndex((d: Department) => d.id === id);
=======
    const departments = readJson('departments.json', []);
    const index = departments.findIndex((d: any) => d.id === id);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    if (index === -1) return res.status(404).json({ ok: false, error: 'department not found' });
    
    departments[index] = { ...departments[index], name, updated_at: new Date().toISOString() };
    writeJson('departments.json', departments);
    
<<<<<<< HEAD
    // フロントエンドの即座の状態更新のため、更新された一覧を返す
    res.json({ ok: true, item: departments[index], departments: departments });
=======
    res.json({ ok: true, item: departments[index] });
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to update department' });
  }
});

// 部署削除
admin.delete('/departments/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
<<<<<<< HEAD
    const departments = readJson<Department[]>('departments.json', []);
    const index = departments.findIndex((d: Department) => d.id === id);
=======
    const departments = readJson('departments.json', []);
    const index = departments.findIndex((d: any) => d.id === id);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    if (index === -1) return res.status(404).json({ ok: false, error: 'department not found' });
    
    const deleted = departments.splice(index, 1)[0];
    writeJson('departments.json', departments);
    
<<<<<<< HEAD
    // フロントエンドの即座の状態更新のため、更新された一覧を返す
    res.json({ ok: true, item: deleted, departments: departments });
=======
    res.json({ ok: true, item: deleted });
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to delete department' });
  }
});

// ============================================================================
// 社員管理 API
// ============================================================================

// 社員一覧取得
admin.get('/employees', (_req, res) => {
  try {
<<<<<<< HEAD
    const employees = readJson<Employee[]>('employees.json', []);
=======
    const employees = readJson('employees.json', []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    res.json({ ok: true, employees });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to read employees' });
  }
});

// 社員追加
admin.post('/employees', (req, res) => {
  try {
    const { code, name, department_id } = req.body;
    if (!code || !name || !department_id) {
      return res.status(400).json({ ok: false, error: 'code, name, and department_id are required' });
    }
    
<<<<<<< HEAD
    const employees = readJson<Employee[]>('employees.json', []);
    const existingIndex = employees.findIndex((e: Employee) => e.code === code);
=======
    const employees = readJson('employees.json', []);
    const existingIndex = employees.findIndex((e: any) => e.code === code);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (existingIndex >= 0) {
      if (req.query.overwrite === 'true') {
        // 上書き更新
        employees[existingIndex] = { 
          ...employees[existingIndex], 
          name, 
          department_id, 
          updated_at: new Date().toISOString() 
        };
        writeJson('employees.json', employees);
        return res.json({ ok: true, employee: employees[existingIndex] });
      } else {
        return res.status(409).json({ ok: false, error: 'code already exists' });
      }
    }
    
    // 新規作成
    const employee = { 
      code, 
      name, 
      department_id, 
      created_at: new Date().toISOString() 
    };
    employees.push(employee);
    writeJson('employees.json', employees);
    
    res.status(201).json({ ok: true, employee });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to create employee' });
  }
});

// 社員更新
admin.put('/employees/:code', (req, res) => {
  try {
    const { code } = req.params;
    const { name, department_id } = req.body;
    
    if (!name || !department_id) {
      return res.status(400).json({ ok: false, error: 'name and department_id are required' });
    }
    
<<<<<<< HEAD
    const employees = readJson<Employee[]>('employees.json', []);
    const index = employees.findIndex((e: Employee) => e.code === code);
=======
    const employees = readJson('employees.json', []);
    const index = employees.findIndex((e: any) => e.code === code);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    if (index === -1) return res.status(404).json({ ok: false, error: 'employee not found' });
    
    employees[index] = { 
      ...employees[index], 
      name, 
      department_id, 
      updated_at: new Date().toISOString() 
    };
    writeJson('employees.json', employees);
    
    res.json({ ok: true, employee: employees[index] });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to update employee' });
  }
});

// 社員削除
admin.delete('/employees/:code', (req, res) => {
  try {
    const { code } = req.params;
<<<<<<< HEAD
    const employees = readJson<Employee[]>('employees.json', []);
    const index = employees.findIndex((e: Employee) => e.code === code);
=======
    const employees = readJson('employees.json', []);
    const index = employees.findIndex((e: any) => e.code === code);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    if (index === -1) return res.status(404).json({ ok: false, error: 'employee not found' });
    
    const deleted = employees.splice(index, 1)[0];
    writeJson('employees.json', employees);
    
    res.json({ ok: true, employee: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to delete employee' });
  }
});

<<<<<<< HEAD
// 社員コード存在チェック
admin.get('/employees/:code/exists', (req, res) => {
  try {
    const { code } = req.params;
    const employees = readJson<Employee[]>('employees.json', []);
    const exists = employees.some((e: Employee) => e.code === code);
    res.json({ ok: true, code, exists });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to check employee code' });
  }
});

=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
// ============================================================================
// 勤怠管理 API
// ============================================================================

// 出勤打刻
admin.post('/clock/in', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: 'code is required' });
    
<<<<<<< HEAD
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
=======
    const attendance = readJson('attendance.json', []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
<<<<<<< HEAD
    const existingIndex = attendance.findIndex((a: AttendanceItem) => a.code === code && a.date === today);
=======
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === today);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_in = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成
      attendance.push({
<<<<<<< HEAD
        employeeCode: code,
=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
        code,
        date: today,
        clock_in: now,
        clock_out: null,
<<<<<<< HEAD
        work_hours: 0,
        created_at: now,
        updated_at: now
=======
        created_at: now
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '出勤を記録しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to record clock in' });
  }
});

// 退勤打刻
admin.post('/clock/out', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: 'code is required' });
    
<<<<<<< HEAD
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
=======
    const attendance = readJson('attendance.json', []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
<<<<<<< HEAD
    const existingIndex = attendance.findIndex((a: AttendanceItem) => a.code === code && a.date === today);
=======
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === today);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_out = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成（出勤なしで退勤のみ）
      attendance.push({
<<<<<<< HEAD
        employeeCode: code,
=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
        code,
        date: today,
        clock_in: null,
        clock_out: now,
<<<<<<< HEAD
        work_hours: 0,
        created_at: now,
        updated_at: now
=======
        created_at: now
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '退勤を記録しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to record clock out' });
  }
});

<<<<<<< HEAD
// フロントエンド互換: 出勤打刻
admin.post('/attendance/checkin', (req, res) => {
  try {
    const { code, note } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: 'code is required' });
    
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
    const existingIndex = attendance.findIndex((a: AttendanceItem) => a.code === code && a.date === today);
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_in = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成
      attendance.push({
        employeeCode: code,
        code,
        date: today,
        clock_in: now,
        clock_out: null,
        work_hours: 0,
        created_at: now,
        updated_at: now
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '出勤を記録しました', checkin: now });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to record clock in' });
  }
});

// フロントエンド互換: 退勤打刻
admin.post('/attendance/checkout', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: 'code is required' });
    
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
    const existingIndex = attendance.findIndex((a: AttendanceItem) => a.code === code && a.date === today);
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_out = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成（出勤なしで退勤のみ）
      attendance.push({
        employeeCode: code,
        code,
        date: today,
        clock_in: null,
        clock_out: now,
        work_hours: 0,
        created_at: now,
        updated_at: now
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '退勤を記録しました', checkout: now });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to record clock out' });
  }
});

=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
// 勤怠時間修正
admin.put('/attendance/update', (req, res) => {
  try {
    const { code, date, clock_in, clock_out } = req.body;
    if (!code || !date) return res.status(400).json({ ok: false, error: 'code and date are required' });
    
<<<<<<< HEAD
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
    const existingIndex = attendance.findIndex((a: AttendanceItem) => a.code === code && a.date === date);
=======
    const attendance = readJson('attendance.json', []);
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === date);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex] = {
        ...attendance[existingIndex],
        clock_in,
        clock_out,
        updated_at: new Date().toISOString()
      };
    } else {
      // 新規作成
      attendance.push({
<<<<<<< HEAD
        employeeCode: code,
=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
        code,
        date,
        clock_in,
        clock_out,
<<<<<<< HEAD
        work_hours: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
=======
        created_at: new Date().toISOString()
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '勤怠を更新しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to update attendance' });
  }
});

// ============================================================================
// 備考管理 API
// ============================================================================

// 備考保存
admin.post('/remarks', (req, res) => {
  try {
    const { employeeCode: code, date, remark } = req.body;
    if (!code || !date) return res.status(400).json({ ok: false, error: 'employeeCode and date are required' });
    
<<<<<<< HEAD
    const remarks = readJson<Remark[]>('remarks.json', []);
    const existingIndex = remarks.findIndex((r: Remark) => r.code === code && r.date === date);
=======
    const remarks = readJson('remarks.json', []);
    const existingIndex = remarks.findIndex((r: any) => r.code === code && r.date === date);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      remarks[existingIndex] = {
        ...remarks[existingIndex],
        remark,
        updated_at: new Date().toISOString()
      };
    } else {
      // 新規作成
      remarks.push({
        code,
        date,
        remark,
        created_at: new Date().toISOString()
      });
    }
    
    writeJson('remarks.json', remarks);
    res.json({ ok: true, message: '備考を保存しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to save remark' });
  }
});

<<<<<<< HEAD
// 個別備考取得
admin.get('/remarks/:employeeCode/:date', (req, res) => {
  try {
    const { employeeCode: code, date } = req.params;
    const remarks = readJson<Remark[]>('remarks.json', []);
    const remark = remarks.find((r: Remark) => r.code === code && r.date === date);
    
    if (remark) {
      res.json({ ok: true, remark: remark.remark });
    } else {
      res.json({ ok: true, remark: '' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to get remark' });
  }
});

// 月別備考取得
admin.get('/remarks/:employeeCode', (req, res) => {
  try {
    const { employeeCode: code } = req.params;
    const { month } = req.query;
    const remarks = readJson<Remark[]>('remarks.json', []);
    
    let filteredRemarks = remarks.filter((r: Remark) => r.code === code);
    
    if (month) {
      const monthStr = month.toString();
      filteredRemarks = filteredRemarks.filter((r: Remark) => r.date.startsWith(monthStr));
    }
    
    const remarksData = filteredRemarks.map((r: Remark) => ({
      date: r.date,
      remark: r.remark
    }));
    
    res.json({ ok: true, remarks: remarksData });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to get remarks' });
  }
});

=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
// ============================================================================
// マスターデータ API
// ============================================================================

// マスターデータ取得
admin.get('/master', (req, res) => {
  try {
    const date = String(req.query.date ?? '');
<<<<<<< HEAD
    const employees = readJson<Employee[]>('employees.json', []);
    const departments = readJson<Department[]>('departments.json', []);
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
    const remarks = readJson<Remark[]>('remarks.json', []);
=======
    const employees = readJson('employees.json', []);
    const departments = readJson('departments.json', []);
    const attendance = readJson('attendance.json', []);
    const remarks = readJson('remarks.json', []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    res.json({ 
      ok: true, 
      date, 
      employees, 
      departments, 
      attendance, 
      remarks,
      list: employees
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to read master data' });
  }
});

// ============================================================================
<<<<<<< HEAD
// 祝日管理 API
// ============================================================================

// 祝日一覧取得
admin.get('/holidays', (req, res) => {
  try {
    // 簡易的な祝日データ（実際の実装では外部APIやデータベースから取得）
    const holidays = {
      '2024-01-01': '元日',
      '2024-01-08': '成人の日',
      '2024-02-11': '建国記念の日',
      '2024-02-12': '建国記念の日 振替休日',
      '2024-02-23': '天皇誕生日',
      '2024-03-20': '春分の日',
      '2024-04-29': '昭和の日',
      '2024-05-03': '憲法記念日',
      '2024-05-04': 'みどりの日',
      '2024-05-05': 'こどもの日',
      '2024-05-06': 'こどもの日 振替休日',
      '2024-07-15': '海の日',
      '2024-08-11': '山の日',
      '2024-08-12': '山の日 振替休日',
      '2024-09-16': '敬老の日',
      '2024-09-22': '秋分の日',
      '2024-09-23': '秋分の日 振替休日',
      '2024-10-14': 'スポーツの日',
      '2024-11-03': '文化の日',
      '2024-11-04': '文化の日 振替休日',
      '2024-11-23': '勤労感謝の日'
    };
    
    res.json({ ok: true, holidays });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to fetch holidays' });
  }
});

// 特定日の祝日チェック
admin.get('/holidays/:date', (req, res) => {
  try {
    const { date } = req.params;
    
    // 簡易的な祝日データ（実際の実装では外部APIやデータベースから取得）
    const holidays: Record<string, string> = {
      '2024-01-01': '元日',
      '2024-01-08': '成人の日',
      '2024-02-11': '建国記念の日',
      '2024-02-12': '建国記念の日 振替休日',
      '2024-02-23': '天皇誕生日',
      '2024-03-20': '春分の日',
      '2024-04-29': '昭和の日',
      '2024-05-03': '憲法記念日',
      '2024-05-04': 'みどりの日',
      '2024-05-05': 'こどもの日',
      '2024-05-06': 'こどもの日 振替休日',
      '2024-07-15': '海の日',
      '2024-08-11': '山の日',
      '2024-08-12': '山の日 振替休日',
      '2024-09-16': '敬老の日',
      '2024-09-22': '秋分の日',
      '2024-09-23': '秋分の日 振替休日',
      '2024-10-14': 'スポーツの日',
      '2024-11-03': '文化の日',
      '2024-11-04': '文化の日 振替休日',
      '2024-11-23': '勤労感謝の日'
    };
    
    const holidayName = holidays[date] || null;
    const isHoliday = holidayName !== null;
    
    res.json({ 
      ok: true, 
      date, 
      isHoliday, 
      holidayName 
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to check holiday' });
  }
});

// ============================================================================
// 週次レポート API
// ============================================================================

// 週次レポート取得
admin.get('/weekly', (req, res) => {
  try {
    const { start } = req.query;
    const startDate = start ? new Date(start.toString()) : new Date();
    
    // 週の開始日を月曜日に設定
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    
    const attendance = readJson<AttendanceItem[]>('attendance.json', []);
    const employees = readJson<Employee[]>('employees.json', []);
    
    // 週のデータを生成
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateStr = currentDate.toISOString().slice(0, 10);
      
      const dayAttendance = attendance.filter((a: AttendanceItem) => a.date === dateStr);
      const dayData = {
        date: dateStr,
        employees: employees.map((emp: Employee) => {
          const att: AttendanceItem | undefined = dayAttendance.find((a: AttendanceItem) => a.code === emp.code);
          return {
            code: emp.code,
            name: emp.name,
            clock_in: att?.clock_in ?? null,
            clock_out: att?.clock_out ?? null,
            work_hours: att?.work_hours ?? 0
          };
        })
      };
      weekData.push(dayData);
    }
    
    res.json({ 
      ok: true, 
      weekData, 
      startDate: weekStart.toISOString().slice(0, 10) 
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to fetch weekly report' });
  }
});

// ============================================================================
// セッション管理 API
// ============================================================================

// セッション保存
admin.post('/sessions', (req, res) => {
  try {
    const { code, name, department, rememberMe } = req.body;
    if (!code || !name) return res.status(400).json({ ok: false, error: 'code and name are required' });
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = { code, name, department };
    
    // セッションデータを保存（実際の実装ではRedisやデータベースを使用）
    const sessions = readJson<SessionsMap>('sessions.json', {});
    sessions[sessionId] = {
      user,
      created_at: new Date().toISOString(),
      expires_at: rememberMe ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : // 30日
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1日
    };
    
    writeJson('sessions.json', sessions);
    res.json({ ok: true, sessionId, user });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to save session' });
  }
});

// セッション取得
admin.get('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = readJson<SessionsMap>('sessions.json', {});
    const session = sessions[sessionId];
    
    if (!session) {
      return res.status(404).json({ ok: false, error: 'Session not found' });
    }
    
    // セッションの有効期限をチェック
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      // 期限切れのセッションを削除
      delete sessions[sessionId];
      writeJson('sessions.json', sessions);
      return res.status(401).json({ ok: false, error: 'Session expired' });
    }
    
    res.json({ ok: true, user: session.user });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to get session' });
  }
});

// セッション削除
admin.delete('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = readJson<SessionsMap>('sessions.json', {});
    
    if (sessions[sessionId]) {
      delete sessions[sessionId];
      writeJson('sessions.json', sessions);
      res.json({ ok: true, message: 'Session deleted' });
    } else {
      res.status(404).json({ ok: false, error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to delete session' });
  }
});

// ============================================================================
=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
// バックアップ管理 API
// ============================================================================

// バックアップ一覧取得
admin.get('/backups', (_req, res) => {
  try {
    const backups = readJson('backup_metadata.json', []);
    res.json({ ok: true, backups });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to read backups' });
  }
});

// バックアップ作成
<<<<<<< HEAD
admin.post('/backups/create', (req, res) => {
  try {
    const { reason = 'manual' } = req.body;
=======
admin.post('/backups/create', (_req, res) => {
  try {
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // 全データをバックアップ
<<<<<<< HEAD
    const backup: BackupBlob = {
      employees: readJson<Employee[]>('employees.json', []),
      departments: readJson<Department[]>('departments.json', []),
      attendance: readJson<AttendanceItem[]>('attendance.json', []),
      remarks: readJson<Remark[]>('remarks.json', [])
=======
    const backup = {
      id: backupId,
      timestamp,
      employees: readJson('employees.json', []),
      departments: readJson('departments.json', []),
      attendance: readJson('attendance.json', []),
      remarks: readJson('remarks.json', [])
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    };
    
    // バックアップファイルに保存
    writeJson(`backups/${backupId}.json`, backup);
    
    // メタデータを更新
<<<<<<< HEAD
    const metadata = readJson<BackupMeta[]>('backup_metadata.json', []);
    metadata.push({ 
      id: backupId, 
      timestamp, 
      reason,
      size: JSON.stringify(backup).length,
      name: `Backup ${timestamp.slice(0, 19)}` 
    });
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, backupId, timestamp, message: 'バックアップを作成しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to create backup' });
  }
});

// フロントエンド互換: バックアップ作成
admin.post('/backup', (req, res) => {
  try {
    const { reason = 'manual' } = req.body;
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // 全データをバックアップ
    const backup: BackupBlob = {
      employees: readJson<Employee[]>('employees.json', []),
      departments: readJson<Department[]>('departments.json', []),
      attendance: readJson<AttendanceItem[]>('attendance.json', []),
      remarks: readJson<Remark[]>('remarks.json', [])
    };
    
    // バックアップファイルに保存
    writeJson(`backups/${backupId}.json`, backup);
    
    // メタデータを更新
    const metadata = readJson<BackupMeta[]>('backup_metadata.json', []);
    metadata.push({ 
      id: backupId, 
      timestamp, 
      reason,
      size: JSON.stringify(backup).length,
      name: `Backup ${timestamp.slice(0, 19)}` 
    });
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, backupId, timestamp, message: 'バックアップを作成しました' });
=======
    const metadata = readJson('backup_metadata.json', []);
    metadata.push({ id: backupId, timestamp, name: `Backup ${timestamp.slice(0, 19)}` });
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, backupId, message: 'バックアップを作成しました' });
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to create backup' });
  }
});

// バックアップ削除
admin.delete('/backups/:name', (req, res) => {
  try {
    const { name } = req.params;
<<<<<<< HEAD
    const metadata = readJson<BackupMeta[]>('backup_metadata.json', []);
    const index = metadata.findIndex((b: BackupMeta) => b.id === name);
=======
    const metadata = readJson('backup_metadata.json', []);
    const index = metadata.findIndex((b: any) => b.id === name);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (index === -1) return res.status(404).json({ ok: false, error: 'backup not found' });
    
    metadata.splice(index, 1);
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, message: 'バックアップを削除しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to delete backup' });
  }
});

// バックアッププレビュー
admin.get('/backups/:id/preview', (req, res) => {
  try {
    const { id } = req.params;
<<<<<<< HEAD
    const backup = (await readJson<BackupBlob | null>(`backups/${id}.json`, null)) ?? {};
=======
    const backup = readJson(`backups/${id}.json`, null);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    if (!backup) return res.status(404).json({ ok: false, error: 'backup not found' });
    
    res.json({ ok: true, backup });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to read backup' });
  }
});

// バックアップ復元
admin.post('/backups/restore', (req, res) => {
  try {
    const { backup_id } = req.body;
    if (!backup_id) return res.status(400).json({ ok: false, error: 'backup_id is required' });
    
<<<<<<< HEAD
    const backup = (await readJson<BackupBlob | null>(`backups/${backup_id}.json`, null)) ?? {};
    if (!backup) return res.status(404).json({ ok: false, error: 'backup not found' });
    
    // データを復元
    writeJson('employees.json', backup.employees ?? []);
    writeJson('departments.json', backup.departments ?? []);
    writeJson('attendance.json', backup.attendance ?? []);
    writeJson('remarks.json', backup.remarks ?? []);
=======
    const backup = readJson(`backups/${backup_id}.json`, null);
    if (!backup) return res.status(404).json({ ok: false, error: 'backup not found' });
    
    // データを復元
    writeJson('employees.json', backup.employees || []);
    writeJson('departments.json', backup.departments || []);
    writeJson('attendance.json', backup.attendance || []);
    writeJson('remarks.json', backup.remarks || []);
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
    
    res.json({ ok: true, message: 'バックアップを復元しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to restore backup' });
  }
});

<<<<<<< HEAD
// フロントエンド互換: バックアップ復元
admin.post('/backups/:id/restore', (req, res) => {
  try {
    const { id } = req.params;
    
    const backup = (await readJson<BackupBlob | null>(`backups/${id}.json`, null)) ?? {};
    if (!backup) return res.status(404).json({ ok: false, error: 'backup not found' });
    
    // データを復元
    writeJson('employees.json', backup.employees ?? []);
    writeJson('departments.json', backup.departments ?? []);
    writeJson('attendance.json', backup.attendance ?? []);
    writeJson('remarks.json', backup.remarks ?? []);
    
    res.json({ 
      ok: true, 
      message: 'バックアップを復元しました',
      restoredAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to restore backup' });
  }
});

// バックアップクリーンアップ
admin.post('/backups/cleanup', (req, res) => {
  try {
    const { maxKeep = 10 } = req.body;
    const metadata = readJson<BackupMeta[]>('backup_metadata.json', []);
    
    // タイムスタンプでソート（古い順）
    metadata.sort((a: BackupMeta, b: BackupMeta) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const toDelete = metadata.slice(0, Math.max(0, metadata.length - maxKeep));
    const remaining = metadata.slice(Math.max(0, metadata.length - maxKeep));
    
    // 古いバックアップを削除
    toDelete.forEach((backup: BackupMeta) => {
      try {
        // バックアップファイルを削除（実際の実装ではfs.unlinkSyncを使用）
        // fs.unlinkSync(`backups/${backup.id}.json`);
      } catch (error) {
        console.error(`Failed to delete backup file: ${backup.id}`, error);
      }
    });
    
    // メタデータを更新
    writeJson('backup_metadata.json', remaining);
    
    res.json({ 
      ok: true, 
      message: '古いバックアップをクリーンアップしました',
      deletedCount: toDelete.length,
      remainingCount: remaining.length
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Failed to cleanup backups' });
  }
});

=======
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
export default admin;
