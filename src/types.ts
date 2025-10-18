// Type definitions for kintai-backend

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