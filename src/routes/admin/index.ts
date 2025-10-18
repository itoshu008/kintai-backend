// backend/src/routes/admin/index.ts
import { Router } from "express";
import { readJson, writeJson } from "../../utils/dataStore";

// ==============================
// ローカル型（最小限・暫定）
// ==============================
type ISODateTime = string;

interface Department {
  id: number;
  name: string;
  created_at: ISODateTime;
  updated_at?: ISODateTime;
}

interface Employee {
  code: string;
  name: string;
  department_id: number;
  created_at: ISODateTime;
  updated_at?: ISODateTime;
}

interface Remark {
  code: string;
  date: string;             // YYYY-MM-DD
  remark: string;
  created_at: ISODateTime;
  updated_at?: ISODateTime;
}

interface AttendanceItem {
  employeeCode: string;
  date: string;             // YYYY-MM-DD
  clock_in: string | null;
  clock_out: string | null;
  work_hours: number;
  // 既存コードが参照していたフィールドを暫定で許容
  updated_at?: ISODateTime;
  code?: string;
}

interface BackupBlob {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceItem[];
  remarks: Remark[];
}

interface BackupMeta {
  id: string;
  timestamp: ISODateTime;
  reason: any;
  size: number;
  name: string;
}

type SessionInfo = {
  user?: { code: string; name: string; department?: any };
  created_at: ISODateTime;
  expires_at?: ISODateTime;
};
type SessionsMap = Record<string, SessionInfo>;

// ==============================

const admin = Router();

// ヘルス
admin.get("/health", (_req, res) =>
  res.json({ ok: true, now: new Date().toISOString() })
);

// ============================================================================
// 部署管理
// ============================================================================

// 一覧（フロント互換：items と departments の両方を返す）
admin.get("/departments", (_req, res) => {
  try {
    const departments = readJson<Department[]>("departments.json", []);
    res.json({ ok: true, items: departments, departments });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to read departments" });
  }
});

// 追加（作成直後に最新一覧も返す／重複チェックあり）
admin.post("/departments", (req, res) => {
  try {
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ ok: false, error: "name required" });

    const departments = readJson<Department[]>("departments.json", []);

    // 重複チェック（name が同一）
    if (departments.some(d => d.name === name)) {
      return res.status(409).json({ ok:false, error:"department already exists" });
    }

    const id = Date.now();
    const dept: Department = { id, name, created_at: new Date().toISOString() };
    departments.push(dept);
    writeJson("departments.json", departments);

    res.status(201).json({
      ok: true,
      item: dept,
      items: departments,     // 互換用
      departments             // 互換用
    });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to create department" });
  }
});

// 更新
admin.put("/departments/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ ok: false, error: "name required" });

    const departments = readJson<Department[]>("departments.json", []);
    const index = departments.findIndex((d) => d.id === id);
    if (index === -1) return res.status(404).json({ ok: false, error: "department not found" });

    departments[index] = {
      ...departments[index],
      name,
      updated_at: new Date().toISOString(),
    };
    writeJson("departments.json", departments);

    res.json({ ok: true, item: departments[index] });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to update department" });
  }
});

// 削除（削除後に一覧も返すと便利）
admin.delete("/departments/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const departments = readJson<Department[]>("departments.json", []);
    const index = departments.findIndex((d) => d.id === id);
    if (index === -1) return res.status(404).json({ ok: false, error: "department not found" });

    const deleted = departments.splice(index, 1)[0];
    writeJson("departments.json", departments);

    res.json({ ok: true, item: deleted, items: departments, departments });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to delete department" });
  }
});

// ============================================================================
// 社員管理
// ============================================================================

// 一覧
admin.get("/employees", (_req, res) => {
  try {
    const employees = readJson<Employee[]>("employees.json", []);
    res.json({ ok: true, employees });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to read employees" });
  }
});

// 追加
admin.post("/employees", (req, res) => {
  try {
    const { code, name, department_id } = req.body ?? {};
    if (!code || !name || !department_id) {
      return res
        .status(400)
        .json({ ok: false, error: "code, name, and department_id are required" });
    }

    const employees = readJson<Employee[]>("employees.json", []);
    const idx = employees.findIndex((e) => e.code === code);

    if (idx >= 0) {
      if (String(req.query.overwrite) === "true") {
        employees[idx] = {
          ...employees[idx],
          name: String(name),
          department_id: Number(department_id),
          updated_at: new Date().toISOString(),
        };
        writeJson("employees.json", employees);
        return res.json({ ok: true, employee: employees[idx] });
      }
      return res.status(409).json({ ok: false, error: "code already exists" });
    }

    const employee: Employee = {
      code: String(code),
      name: String(name),
      department_id: Number(department_id),
      created_at: new Date().toISOString(),
    };
    employees.push(employee);
    writeJson("employees.json", employees);

    res.status(201).json({ ok: true, employee });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to create employee" });
  }
});

// 更新
admin.put("/employees/:code", (req, res) => {
  try {
    const { code } = req.params;
    const { name, department_id } = req.body ?? {};
    if (!name || !department_id) {
      return res
        .status(400)
        .json({ ok: false, error: "name and department_id are required" });
    }

    const employees = readJson<Employee[]>("employees.json", []);
    const index = employees.findIndex((e) => e.code === code);
    if (index === -1) return res.status(404).json({ ok: false, error: "employee not found" });

    employees[index] = {
      ...employees[index],
      name: String(name),
      department_id: Number(department_id),
      updated_at: new Date().toISOString(),
    };
    writeJson("employees.json", employees);

    res.json({ ok: true, employee: employees[index] });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to update employee" });
  }
});

// 削除
admin.delete("/employees/:code", (req, res) => {
  try {
    const { code } = req.params;
    const employees = readJson<Employee[]>("employees.json", []);
    const index = employees.findIndex((e) => e.code === code);
    if (index === -1) return res.status(404).json({ ok: false, error: "employee not found" });

    const deleted = employees.splice(index, 1)[0];
    writeJson("employees.json", employees);

    res.json({ ok: true, employee: deleted });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to delete employee" });
  }
});

// 存在チェック
admin.get("/employees/:code/exists", (req, res) => {
  try {
    const { code } = req.params;
    const employees = readJson<Employee[]>("employees.json", []);
    const exists = employees.some((e) => e.code === code);
    res.json({ ok: true, code, exists });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to check employee code" });
  }
});

// ============================================================================
// 勤怠管理
// ============================================================================

const todayStr = () => new Date().toISOString().slice(0, 10);

// 出勤
admin.post("/clock/in", (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ ok: false, error: "code is required" });

    const attendance = readJson<AttendanceItem[]>("attendance.json", []);
    const today = todayStr();
    const now = new Date().toISOString();

    const idx = attendance.findIndex((a) => a.code === code && a.date === today);
    if (idx >= 0) {
      attendance[idx].clock_in = now;
      attendance[idx].updated_at = now;
    } else {
      attendance.push({
        employeeCode: String(code),
        code: String(code),
        date: today,
        clock_in: now,
        clock_out: null,
        work_hours: 0,
        updated_at: now,
      });
    }
    writeJson("attendance.json", attendance);
    res.json({ ok: true, message: "出勤を記録しました" });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to record clock in" });
  }
});

// 退勤
admin.post("/clock/out", (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ ok: false, error: "code is required" });

    const attendance = readJson<AttendanceItem[]>("attendance.json", []);
    const today = todayStr();
    const now = new Date().toISOString();

    const idx = attendance.findIndex((a) => a.code === code && a.date === today);
    if (idx >= 0) {
      attendance[idx].clock_out = now;
      attendance[idx].updated_at = now;
    } else {
      attendance.push({
        employeeCode: String(code),
        code: String(code),
        date: today,
        clock_in: null,
        clock_out: now,
        work_hours: 0,
        updated_at: now,
      });
    }
    writeJson("attendance.json", attendance);
    res.json({ ok: true, message: "退勤を記録しました" });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to record clock out" });
  }
});

// 互換：出勤打刻
admin.post("/attendance/checkin", (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ ok: false, error: "code is required" });

    const attendance = readJson<AttendanceItem[]>("attendance.json", []);
    const today = todayStr();
    const now = new Date().toISOString();

    const idx = attendance.findIndex((a) => a.code === code && a.date === today);
    if (idx >= 0) {
      attendance[idx].clock_in = now;
      attendance[idx].updated_at = now;
    } else {
      attendance.push({
        employeeCode: String(code),
        code: String(code),
        date: today,
        clock_in: now,
        clock_out: null,
        work_hours: 0,
        updated_at: now,
      });
    }
    writeJson("attendance.json", attendance);
    res.json({ ok: true, message: "出勤を記録しました", checkin: now });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to record clock in" });
  }
});

// 互換：退勤打刻
admin.post("/attendance/checkout", (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ ok: false, error: "code is required" });

    const attendance = readJson<AttendanceItem[]>("attendance.json", []);
    const today = todayStr();
    const now = new Date().toISOString();

    const idx = attendance.findIndex((a) => a.code === code && a.date === today);
    if (idx >= 0) {
      attendance[idx].clock_out = now;
      attendance[idx].updated_at = now;
    } else {
      attendance.push({
        employeeCode: String(code),
        code: String(code),
        date: today,
        clock_in: null,
        clock_out: now,
        work_hours: 0,
        updated_at: now,
      });
    }
    writeJson("attendance.json", attendance);
    res.json({ ok: true, message: "退勤を記録しました", checkout: now });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to record clock out" });
  }
});

// 勤怠修正
admin.put("/attendance/update", (req, res) => {
  try {
    const { code, date, clock_in, clock_out } = req.body ?? {};
    if (!code || !date)
      return res.status(400).json({ ok: false, error: "code and date are required" });

    const attendance = readJson<AttendanceItem[]>("attendance.json", []);
    const idx = attendance.findIndex((a) => a.code === code && a.date === String(date));
    const now = new Date().toISOString();

    if (idx >= 0) {
      attendance[idx] = {
        ...attendance[idx],
        clock_in: clock_in ?? attendance[idx].clock_in ?? null,
        clock_out: clock_out ?? attendance[idx].clock_out ?? null,
        updated_at: now,
      };
    } else {
      attendance.push({
        employeeCode: String(code),
        code: String(code),
        date: String(date),
        clock_in: clock_in ?? null,
        clock_out: clock_out ?? null,
        work_hours: 0,
        updated_at: now,
      });
    }
    writeJson("attendance.json", attendance);
    res.json({ ok: true, message: "勤怠を更新しました" });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to update attendance" });
  }
});

// ============================================================================
// 備考管理
// ============================================================================

// 保存
admin.post("/remarks", (req, res) => {
  try {
    const { employeeCode: code, date, remark } = req.body ?? {};
    if (!code || !date)
      return res
        .status(400)
        .json({ ok: false, error: "employeeCode and date are required" });

    const remarks = readJson<Remark[]>("remarks.json", []);
    const idx = remarks.findIndex((r) => r.code === code && r.date === date);

    if (idx >= 0) {
      remarks[idx] = { ...remarks[idx], remark: String(remark ?? ""), updated_at: new Date().toISOString() };
    } else {
      remarks.push({ code: String(code), date: String(date), remark: String(remark ?? ""), created_at: new Date().toISOString() } as any);
    }
    writeJson("remarks.json", remarks);
    res.json({ ok: true, message: "備考を保存しました" });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to save remark" });
  }
});

// 個別取得
admin.get("/remarks/:employeeCode/:date", (req, res) => {
  try {
    const { employeeCode: code, date } = req.params as any;
    const remarks = readJson<Remark[]>("remarks.json", []);
    const r = remarks.find((x) => x.code === code && x.date === date);
    res.json({ ok: true, remark: r?.remark ?? "" });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to get remark" });
  }
});

// 月別取得
admin.get("/remarks/:employeeCode", (req, res) => {
  try {
    const { employeeCode: code } = req.params as any;
    const month = req.query.month?.toString();
    const remarks = readJson<Remark[]>("remarks.json", []);
    let filtered = remarks.filter((r) => r.code === code);
    if (month) filtered = filtered.filter((r) => r.date.startsWith(month));
    const data = filtered.map((r) => ({ date: r.date, remark: r.remark }));
    res.json({ ok: true, remarks: data });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to get remarks" });
  }
});

// ============================================================================
// マスター
// ============================================================================

admin.get("/master", (req, res) => {
  try {
    const date = String(req.query.date ?? "");
    const employees = readJson<Employee[]>("employees.json", []);
    const departments = readJson<Department[]>("departments.json", []);
    const attendance = readJson<AttendanceItem[]>("attendance.json", []);
    const remarks = readJson<Remark[]>("remarks.json", []);
    res.json({ ok: true, date, employees, departments, attendance, remarks, list: employees });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to read master data" });
  }
});

// ============================================================================
// 祝日（ダミー）
// ============================================================================

admin.get("/holidays", (_req, res) => {
  try {
    const holidays: Record<string, string> = {
      "2024-01-01": "元日",
      "2024-01-08": "成人の日",
      "2024-02-11": "建国記念の日",
      "2024-02-12": "建国記念の日 振替休日",
      "2024-02-23": "天皇誕生日",
      "2024-03-20": "春分の日",
      "2024-04-29": "昭和の日",
      "2024-05-03": "憲法記念日",
      "2024-05-04": "みどりの日",
      "2024-05-05": "こどもの日",
      "2024-05-06": "こどもの日 振替休日",
      "2024-07-15": "海の日",
      "2024-08-11": "山の日",
      "2024-08-12": "山の日 振替休日",
      "2024-09-16": "敬老の日",
      "2024-09-22": "秋分の日",
      "2024-09-23": "秋分の日 振替休日",
      "2024-10-14": "スポーツの日",
      "2024-11-03": "文化の日",
      "2024-11-04": "文化の日 振替休日",
      "2024-11-23": "勤労感謝の日"
    };
    res.json({ ok: true, holidays });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to fetch holidays" });
  }
});

admin.get("/holidays/:date", (req, res) => {
  try {
    const { date } = req.params;
    const holidays: Record<string, string> = {
      "2024-01-01": "元日",
      "2024-01-08": "成人の日",
      // …（上と同様）
    };
    const holidayName = holidays[date] || null;
    res.json({ ok: true, date, isHoliday: !!holidayName, holidayName });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to check holiday" });
  }
});

// ============================================================================
// セッション（簡易JSON）
// ============================================================================

admin.post("/sessions", (req, res) => {
  try {
    const { code, name, department, rememberMe } = req.body ?? {};
    if (!code || !name) return res.status(400).json({ ok:false, error:"code and name are required" });

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const user = { code, name, department };
    const sessions = readJson<SessionsMap>("sessions.json", {});
    sessions[sessionId] = {
      user,
      created_at: new Date().toISOString(),
      expires_at: (rememberMe ? new Date(Date.now() + 30*24*60*60*1000) : new Date(Date.now() + 24*60*60*1000)).toISOString()
    };
    writeJson("sessions.json", sessions);
    res.json({ ok:true, sessionId, user });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to save session" });
  }
});

admin.get("/sessions/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = readJson<SessionsMap>("sessions.json", {});
    const session = sessions[sessionId];
    if (!session) return res.status(404).json({ ok:false, error:"Session not found" });

    const now = new Date();
    const expiresAt = new Date(session.expires_at ?? now.toISOString());
    if (now > expiresAt) {
      delete sessions[sessionId];
      writeJson("sessions.json", sessions);
      return res.status(401).json({ ok:false, error:"Session expired" });
    }
    res.json({ ok:true, user: session.user });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to get session" });
  }
});

admin.delete("/sessions/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessions = readJson<SessionsMap>("sessions.json", {});
    if (sessions[sessionId]) {
      delete sessions[sessionId];
      writeJson("sessions.json", sessions);
      return res.json({ ok:true, message:"Session deleted" });
    }
    res.status(404).json({ ok:false, error:"Session not found" });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to delete session" });
  }
});

// ============================================================================
// バックアップ
// ============================================================================

admin.get("/backups", (_req, res) => {
  try {
    const backups = readJson<BackupMeta[]>("backup_metadata.json", []);
    res.json({ ok:true, backups });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to read backups" });
  }
});

admin.post("/backups/create", (req, res) => {
  try {
    const { reason = "manual" } = req.body ?? {};
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const backup: BackupBlob = {
      employees: readJson<Employee[]>("employees.json", []),
      departments: readJson<Department[]>("departments.json", []),
      attendance: readJson<AttendanceItem[]>("attendance.json", []),
      remarks: readJson<Remark[]>("remarks.json", [])
    };

    writeJson(`backups/${backupId}.json`, backup);

    const metadata = readJson<BackupMeta[]>("backup_metadata.json", []);
    metadata.push({
      id: backupId,
      timestamp,
      reason,
      size: JSON.stringify(backup).length,
      name: `Backup ${timestamp.slice(0,19)}`
    });
    writeJson("backup_metadata.json", metadata);

    res.json({ ok:true, backupId, timestamp, message:"バックアップを作成しました" });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to create backup" });
  }
});

admin.post("/backup", (req, res) => {
  try {
    const { reason = "manual" } = req.body ?? {};
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const backup: BackupBlob = {
      employees: readJson<Employee[]>("employees.json", []),
      departments: readJson<Department[]>("departments.json", []),
      attendance: readJson<AttendanceItem[]>("attendance.json", []),
      remarks: readJson<Remark[]>("remarks.json", [])
    };

    writeJson(`backups/${backupId}.json`, backup);

    const metadata = readJson<BackupMeta[]>("backup_metadata.json", []);
    metadata.push({
      id: backupId,
      timestamp,
      reason,
      size: JSON.stringify(backup).length,
      name: `Backup ${timestamp.slice(0,19)}`
    });
    writeJson("backup_metadata.json", metadata);

    res.json({ ok:true, backupId, timestamp, message:"バックアップを作成しました" });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to create backup" });
  }
});

admin.delete("/backups/:id", (req, res) => {
  try {
    const { id } = req.params;
    const metadata = readJson<BackupMeta[]>("backup_metadata.json", []);
    const index = metadata.findIndex((b) => b.id === id);
    if (index === -1) return res.status(404).json({ ok:false, error:"backup not found" });
    metadata.splice(index, 1);
    writeJson("backup_metadata.json", metadata);
    res.json({ ok:true, message:"バックアップを削除しました" });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to delete backup" });
  }
});

admin.get("/backups/:id/preview", (req, res) => {
  try {
    const { id } = req.params;
    const backup = readJson<BackupBlob | null>(`backups/${id}.json`, null);
    if (!backup) return res.status(404).json({ ok:false, error:"backup not found" });
    res.json({ ok:true, backup });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to read backup" });
  }
});

admin.post("/backups/restore", (req, res) => {
  try {
    const { backup_id } = req.body ?? {};
    if (!backup_id) return res.status(400).json({ ok:false, error:"backup_id is required" });

    const backup = readJson<BackupBlob | null>(`backups/${backup_id}.json`, null);
    if (!backup) return res.status(404).json({ ok:false, error:"backup not found" });

    writeJson("employees.json", backup.employees ?? []);
    writeJson("departments.json", backup.departments ?? []);
    writeJson("attendance.json", backup.attendance ?? []);
    writeJson("remarks.json", backup.remarks ?? []);

    res.json({ ok:true, message:"バックアップを復元しました" });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to restore backup" });
  }
});

admin.post("/backups/:id/restore", (req, res) => {
  try {
    const { id } = req.params;
    const backup = readJson<BackupBlob | null>(`backups/${id}.json`, null);
    if (!backup) return res.status(404).json({ ok:false, error:"backup not found" });

    writeJson("employees.json", backup.employees ?? []);
    writeJson("departments.json", backup.departments ?? []);
    writeJson("attendance.json", backup.attendance ?? []);
    writeJson("remarks.json", backup.remarks ?? []);

    res.json({ ok:true, message:"バックアップを復元しました", restoredAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to restore backup" });
  }
});

admin.post("/backups/cleanup", (req, res) => {
  try {
    const maxKeep = Number(req.body?.maxKeep ?? 10);
    const metadata = readJson<BackupMeta[]>("backup_metadata.json", []);
    metadata.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const remaining = metadata.slice(-maxKeep);
    writeJson("backup_metadata.json", remaining);
    res.json({ ok:true, message:"古いバックアップをクリーンアップしました", deletedCount: metadata.length - remaining.length, remainingCount: remaining.length });
  } catch {
    res.status(500).json({ ok:false, error:"Failed to cleanup backups" });
  }
});

export default admin;
