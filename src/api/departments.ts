// src/api/departments.ts
export type Department = { id: number; name: string; created_at?: string; updated_at?: string };

export async function listDepartments(): Promise<Department[]> {
  const r = await fetch("/api/admin/departments", { cache: "no-store" });
  if (!r.ok) throw new Error("failed to fetch departments");
  const j = await r.json();
  return j.items ?? j.departments ?? [];          // ← どちらでも受ける
}

export async function createDepartment(name: string): Promise<Department[]> {
  const r = await fetch("/api/admin/departments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error ?? "failed to create");
  }
  const j = await r.json();
  // 登録直後はサーバが items/departments を返すので、それを優先利用。
  return j.departments ?? j.items ?? [];          // ← 返ってきた一覧で即反映
}

export async function updateDepartment(id: number, name: string): Promise<Department[]> {
  const r = await fetch(`/api/admin/departments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error ?? "failed to update");
  }
  const j = await r.json();
  return j.departments ?? j.items ?? [];          // ← 返ってきた一覧で即反映
}

export async function deleteDepartment(id: number): Promise<Department[]> {
  const r = await fetch(`/api/admin/departments/${id}`, {
    method: "DELETE"
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error ?? "failed to delete");
  }
  const j = await r.json();
  return j.departments ?? j.items ?? [];          // ← 返ってきた一覧で即反映
}

