// バックエンド/src/routes/admin/index.ts
import { Router } from 'express';
import { readJson, writeJson } from '../../utils/dataStore';

export const admin = Router();

// 既存: ヘルスチェック
admin.get('/health', (_req, res) => res.json({ ok: true }));

// ============================================================================
// 部署管理 API
// ============================================================================

// 部署一覧取得
admin.get('/departments', (_req, res) => {
  try {
    const departments = readJson('departments.json', []);
    res.json({ ok: true, items: departments });
  } catch (error) {
    res.status(500).json({ ok: false, error: '部署データの読み込みに失敗しました' });
  }
});

// 部署追加
admin.post('/departments', (req, res) => {
  try {
    const name = (req.body?.name ?? '').toString().trim();
    if (!name) return res.status(400).json({ ok: false, error: '部署名が必要です' });
    
    const departments = readJson('departments.json', []);
    const id = Date.now();
    const dept = { id, name, created_at: new Date().toISOString() };
    departments.push(dept);
    writeJson('departments.json', departments);
    
    res.status(201).json({ ok: true, item: dept });
  } catch (error) {
    res.status(500).json({ ok: false, error: '部署の作成に失敗しました' });
  }
});

// 部署更新
admin.put('/departments/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const name = (req.body?.name ?? '').toString().trim();
    if (!name) return res.status(400).json({ ok: false, error: '部署名が必要です' });
    
    const departments = readJson('departments.json', []);
    const index = departments.findIndex((d: any) => d.id === id);
    if (index === -1) return res.status(404).json({ ok: false, error: '部署が見つかりません' });
    
    departments[index] = { ...departments[index], name, updated_at: new Date().toISOString() };
    writeJson('departments.json', departments);
    
    res.json({ ok: true, item: departments[index] });
  } catch (error) {
    res.status(500).json({ ok: false, error: '部署の更新に失敗しました' });
  }
});

// 部署削除
admin.delete('/departments/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const departments = readJson('departments.json', []);
    const index = departments.findIndex((d: any) => d.id === id);
    if (index === -1) return res.status(404).json({ ok: false, error: '部署が見つかりません' });
    
    const deleted = departments.splice(index, 1)[0];
    writeJson('departments.json', departments);
    
    res.json({ ok: true, item: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, error: '部署の削除に失敗しました' });
  }
});

// ============================================================================
// 社員管理 API
// ============================================================================

// 社員一覧取得
admin.get('/employees', (_req, res) => {
  try {
    const employees = readJson('employees.json', []);
    res.json({ ok: true, employees });
  } catch (error) {
    res.status(500).json({ ok: false, error: '社員データの読み込みに失敗しました' });
  }
});

// 社員追加
admin.post('/employees', (req, res) => {
  try {
    const { code, name, department_id } = req.body;
    if (!code || !name || !department_id) {
      return res.status(400).json({ ok: false, error: '社員コード、名前、部署IDが必要です' });
    }
    
    const employees = readJson('employees.json', []);
    const existingIndex = employees.findIndex((e: any) => e.code === code);
    
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
        return res.status(409).json({ ok: false, error: '社員コードが既に存在します' });
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
    res.status(500).json({ ok: false, error: '社員の作成に失敗しました' });
  }
});

// 社員更新
admin.put('/employees/:code', (req, res) => {
  try {
    const { code } = req.params;
    const { name, department_id } = req.body;
    
    if (!name || !department_id) {
      return res.status(400).json({ ok: false, error: '名前と部署IDが必要です' });
    }
    
    const employees = readJson('employees.json', []);
    const index = employees.findIndex((e: any) => e.code === code);
    if (index === -1) return res.status(404).json({ ok: false, error: '社員が見つかりません' });
    
    employees[index] = { 
      ...employees[index], 
      name, 
      department_id, 
      updated_at: new Date().toISOString() 
    };
    writeJson('employees.json', employees);
    
    res.json({ ok: true, employee: employees[index] });
  } catch (error) {
    res.status(500).json({ ok: false, error: '社員の更新に失敗しました' });
  }
});

// 社員削除
admin.delete('/employees/:code', (req, res) => {
  try {
    const { code } = req.params;
    const employees = readJson('employees.json', []);
    const index = employees.findIndex((e: any) => e.code === code);
    if (index === -1) return res.status(404).json({ ok: false, error: '社員が見つかりません' });
    
    const deleted = employees.splice(index, 1)[0];
    writeJson('employees.json', employees);
    
    res.json({ ok: true, employee: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, error: '社員の削除に失敗しました' });
  }
});

// 社員コード存在チェック
admin.get('/employees/:code/exists', (req, res) => {
  try {
    const { code } = req.params;
    const employees = readJson('employees.json', []);
    const exists = employees.some((e: any) => e.code === code);
    res.json({ ok: true, code, exists });
  } catch (error) {
    res.status(500).json({ ok: false, error: '社員コードの確認に失敗しました' });
  }
});

// ============================================================================
// 勤怠管理 API
// ============================================================================

// 出勤打刻
admin.post('/clock/in', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: '社員コードが必要です' });
    
    const attendance = readJson('attendance.json', []);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === today);
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_in = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成
      attendance.push({
        code,
        date: today,
        clock_in: now,
        clock_out: null,
        created_at: now
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '出勤を記録しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: '出勤記録に失敗しました' });
  }
});

// 退勤打刻
admin.post('/clock/out', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: '社員コードが必要です' });
    
    const attendance = readJson('attendance.json', []);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === today);
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_out = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成（出勤なしで退勤のみ）
      attendance.push({
        code,
        date: today,
        clock_in: null,
        clock_out: now,
        created_at: now
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '退勤を記録しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: '退勤記録に失敗しました' });
  }
});

// フロントエンド互換: 出勤打刻
admin.post('/attendance/checkin', (req, res) => {
  try {
    const { code, note } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: '社員コードが必要です' });
    
    const attendance = readJson('attendance.json', []);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === today);
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_in = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成
      attendance.push({
        code,
        date: today,
        clock_in: now,
        clock_out: null,
        created_at: now
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '出勤を記録しました', checkin: now });
  } catch (error) {
    res.status(500).json({ ok: false, error: '出勤記録に失敗しました' });
  }
});

// フロントエンド互換: 退勤打刻
admin.post('/attendance/checkout', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ ok: false, error: '社員コードが必要です' });
    
    const attendance = readJson('attendance.json', []);
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    // 既存の記録を探す
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === today);
    
    if (existingIndex >= 0) {
      // 既存の記録を更新
      attendance[existingIndex].clock_out = now;
      attendance[existingIndex].updated_at = now;
    } else {
      // 新規作成（出勤なしで退勤のみ）
      attendance.push({
        code,
        date: today,
        clock_in: null,
        clock_out: now,
        created_at: now
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '退勤を記録しました', checkout: now });
  } catch (error) {
    res.status(500).json({ ok: false, error: '退勤記録に失敗しました' });
  }
});

// 勤怠時間修正
admin.put('/attendance/update', (req, res) => {
  try {
    const { code, date, clock_in, clock_out } = req.body;
    if (!code || !date) return res.status(400).json({ ok: false, error: '社員コードと日付が必要です' });
    
    const attendance = readJson('attendance.json', []);
    const existingIndex = attendance.findIndex((a: any) => a.code === code && a.date === date);
    
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
        code,
        date,
        clock_in,
        clock_out,
        created_at: new Date().toISOString()
      });
    }
    
    writeJson('attendance.json', attendance);
    res.json({ ok: true, message: '勤怠を更新しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: '勤怠の更新に失敗しました' });
  }
});

// ============================================================================
// 備考管理 API
// ============================================================================

// 備考保存
admin.post('/remarks', (req, res) => {
  try {
    const { employeeCode: code, date, remark } = req.body;
    if (!code || !date) return res.status(400).json({ ok: false, error: '社員コードと日付が必要です' });
    
    const remarks = readJson('remarks.json', []);
    const existingIndex = remarks.findIndex((r: any) => r.code === code && r.date === date);
    
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
    res.status(500).json({ ok: false, error: '備考の保存に失敗しました' });
  }
});

// 個別備考取得
admin.get('/remarks/:employeeCode/:date', (req, res) => {
  try {
    const { employeeCode: code, date } = req.params;
    const remarks = readJson('remarks.json', []);
    const remark = remarks.find((r: any) => r.code === code && r.date === date);
    
    if (remark) {
      res.json({ ok: true, remark: remark.remark });
    } else {
      res.json({ ok: true, remark: '' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: '備考の取得に失敗しました' });
  }
});

// 月別備考取得
admin.get('/remarks/:employeeCode', (req, res) => {
  try {
    const { employeeCode: code } = req.params;
    const { month } = req.query;
    const remarks = readJson('remarks.json', []);
    
    let filteredRemarks = remarks.filter((r: any) => r.code === code);
    
    if (month) {
      const monthStr = month.toString();
      filteredRemarks = filteredRemarks.filter((r: any) => r.date.startsWith(monthStr));
    }
    
    const remarksData = filteredRemarks.map((r: any) => ({
      date: r.date,
      remark: r.remark
    }));
    
    res.json({ ok: true, remarks: remarksData });
  } catch (error) {
    res.status(500).json({ ok: false, error: '備考の取得に失敗しました' });
  }
});

// ============================================================================
// マスターデータ API
// ============================================================================

// マスターデータ取得
admin.get('/master', (req, res) => {
  try {
    const date = String(req.query.date ?? '');
    const employees = readJson('employees.json', []);
    const departments = readJson('departments.json', []);
    const attendance = readJson('attendance.json', []);
    const remarks = readJson('remarks.json', []);
    
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
    res.status(500).json({ ok: false, error: 'マスターデータの読み込みに失敗しました' });
  }
});

// ============================================================================
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
    res.status(500).json({ ok: false, error: '祝日データの取得に失敗しました' });
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
    res.status(500).json({ ok: false, error: '祝日チェックに失敗しました' });
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
    
    const attendance = readJson('attendance.json', []);
    const employees = readJson('employees.json', []);
    
    // 週のデータを生成
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateStr = currentDate.toISOString().slice(0, 10);
      
      const dayAttendance = attendance.filter((a: any) => a.date === dateStr);
      const dayData = {
        date: dateStr,
        employees: employees.map((emp: any) => {
          const att = dayAttendance.find((a: any) => a.code === emp.code);
          return {
            code: emp.code,
            name: emp.name,
            clock_in: att?.clock_in || null,
            clock_out: att?.clock_out || null,
            work_hours: att?.work_hours || 0
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
    res.status(500).json({ ok: false, error: '週次レポートの取得に失敗しました' });
  }
});

// ============================================================================
// セッション管理 API
// ============================================================================

// セッション保存
admin.post('/sessions', (req, res) => {
  try {
    const { code, name, department, rememberMe } = req.body;
    if (!code || !name) return res.status(400).json({ ok: false, error: '社員コードと名前が必要です' });
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = { code, name, department };
    
    // セッションデータを保存（実際の実装ではRedisやデータベースを使用）
    const sessions = readJson('sessions.json', {});
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
    res.status(500).json({ ok: false, error: 'セッションの保存に失敗しました' });
  }
});

// セッション取得
admin.get('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = readJson('sessions.json', {});
    const session = sessions[sessionId];
    
    if (!session) {
      return res.status(404).json({ ok: false, error: 'セッションが見つかりません' });
    }
    
    // セッションの有効期限をチェック
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      // 期限切れのセッションを削除
      delete sessions[sessionId];
      writeJson('sessions.json', sessions);
      return res.status(401).json({ ok: false, error: 'セッションが期限切れです' });
    }
    
    res.json({ ok: true, user: session.user });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'セッションの取得に失敗しました' });
  }
});

// セッション削除
admin.delete('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = readJson('sessions.json', {});
    
    if (sessions[sessionId]) {
      delete sessions[sessionId];
      writeJson('sessions.json', sessions);
      res.json({ ok: true, message: 'セッションを削除しました' });
    } else {
      res.status(404).json({ ok: false, error: 'セッションが見つかりません' });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error: 'セッションの削除に失敗しました' });
  }
});

// ============================================================================
// バックアップ管理 API
// ============================================================================

// バックアップ一覧取得
admin.get('/backups', (_req, res) => {
  try {
    const backups = readJson('backup_metadata.json', []);
    res.json({ ok: true, backups });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップ一覧の読み込みに失敗しました' });
  }
});

// バックアップ作成
admin.post('/backups/create', (req, res) => {
  try {
    const { reason = 'manual' } = req.body;
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // 全データをバックアップ
    const backup = {
      id: backupId,
      timestamp,
      reason,
      employees: readJson('employees.json', []),
      departments: readJson('departments.json', []),
      attendance: readJson('attendance.json', []),
      remarks: readJson('remarks.json', [])
    };
    
    // バックアップファイルに保存
    writeJson(`backups/${backupId}.json`, backup);
    
    // メタデータを更新
    const metadata = readJson('backup_metadata.json', []);
    metadata.push({ 
      id: backupId, 
      timestamp, 
      reason,
      size: JSON.stringify(backup).length,
      name: `バックアップ ${timestamp.slice(0, 19)}` 
    });
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, backupId, timestamp, message: 'バックアップを作成しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップの作成に失敗しました' });
  }
});

// フロントエンド互換: バックアップ作成
admin.post('/backup', (req, res) => {
  try {
    const { reason = 'manual' } = req.body;
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // 全データをバックアップ
    const backup = {
      id: backupId,
      timestamp,
      reason,
      employees: readJson('employees.json', []),
      departments: readJson('departments.json', []),
      attendance: readJson('attendance.json', []),
      remarks: readJson('remarks.json', [])
    };
    
    // バックアップファイルに保存
    writeJson(`backups/${backupId}.json`, backup);
    
    // メタデータを更新
    const metadata = readJson('backup_metadata.json', []);
    metadata.push({ 
      id: backupId, 
      timestamp, 
      reason,
      size: JSON.stringify(backup).length,
      name: `バックアップ ${timestamp.slice(0, 19)}` 
    });
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, backupId, timestamp, message: 'バックアップを作成しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップの作成に失敗しました' });
  }
});

// バックアップ削除
admin.delete('/backups/:name', (req, res) => {
  try {
    const { name } = req.params;
    const metadata = readJson('backup_metadata.json', []);
    const index = metadata.findIndex((b: any) => b.id === name);
    
    if (index === -1) return res.status(404).json({ ok: false, error: 'バックアップが見つかりません' });
    
    metadata.splice(index, 1);
    writeJson('backup_metadata.json', metadata);
    
    res.json({ ok: true, message: 'バックアップを削除しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップの削除に失敗しました' });
  }
});

// バックアッププレビュー
admin.get('/backups/:id/preview', (req, res) => {
  try {
    const { id } = req.params;
    const backup = readJson(`backups/${id}.json`, null);
    
    if (!backup) return res.status(404).json({ ok: false, error: 'バックアップが見つかりません' });
    
    res.json({ ok: true, backup });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップの読み込みに失敗しました' });
  }
});

// バックアップ復元
admin.post('/backups/restore', (req, res) => {
  try {
    const { backup_id } = req.body;
    if (!backup_id) return res.status(400).json({ ok: false, error: 'バックアップIDが必要です' });
    
    const backup = readJson(`backups/${backup_id}.json`, null);
    if (!backup) return res.status(404).json({ ok: false, error: 'バックアップが見つかりません' });
    
    // データを復元
    writeJson('employees.json', backup.employees || []);
    writeJson('departments.json', backup.departments || []);
    writeJson('attendance.json', backup.attendance || []);
    writeJson('remarks.json', backup.remarks || []);
    
    res.json({ ok: true, message: 'バックアップを復元しました' });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップの復元に失敗しました' });
  }
});

// フロントエンド互換: バックアップ復元
admin.post('/backups/:id/restore', (req, res) => {
  try {
    const { id } = req.params;
    
    const backup = readJson(`backups/${id}.json`, null);
    if (!backup) return res.status(404).json({ ok: false, error: 'バックアップが見つかりません' });
    
    // データを復元
    writeJson('employees.json', backup.employees || []);
    writeJson('departments.json', backup.departments || []);
    writeJson('attendance.json', backup.attendance || []);
    writeJson('remarks.json', backup.remarks || []);
    
    res.json({ 
      ok: true, 
      message: 'バックアップを復元しました',
      restoredAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'バックアップの復元に失敗しました' });
  }
});

// バックアップクリーンアップ
admin.post('/backups/cleanup', (req, res) => {
  try {
    const { maxKeep = 10 } = req.body;
    const metadata = readJson('backup_metadata.json', []);
    
    // タイムスタンプでソート（古い順）
    metadata.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const toDelete = metadata.slice(0, Math.max(0, metadata.length - maxKeep));
    const remaining = metadata.slice(Math.max(0, metadata.length - maxKeep));
    
    // 古いバックアップを削除
    toDelete.forEach((backup: any) => {
      try {
        // バックアップファイルを削除（実際の実装ではfs.unlinkSyncを使用）
        // fs.unlinkSync(`backups/${backup.id}.json`);
      } catch (error) {
        console.error(`バックアップファイルの削除に失敗: ${backup.id}`, error);
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
    res.status(500).json({ ok: false, error: 'バックアップのクリーンアップに失敗しました' });
  }
});

export default admin;

