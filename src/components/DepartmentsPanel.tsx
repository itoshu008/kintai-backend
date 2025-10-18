// 例: src/components/DepartmentsPanel.tsx の部署一覧部分
import { useEffect, useState } from "react";
import { listDepartments, createDepartment, updateDepartment, deleteDepartment, type Department } from "../api/departments";

export default function DepartmentsPanel() {
  const [deps, setDeps] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const departments = await listDepartments();
      setDeps(departments);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      const newList = await createDepartment(name.trim()); // ← 一覧が返る
      setDeps(newList);                                    // ← 即反映
      setName("");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (dept: Department) => {
    setEditingId(dept.id);
    setEditingName(dept.name);
  };

  const onUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    try {
      setLoading(true);
      const newList = await updateDepartment(id, editingName.trim()); // ← 一覧が返る
      setDeps(newList);                                               // ← 即反映
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("この部署を削除しますか？")) return;
    try {
      setLoading(true);
      const newList = await deleteDepartment(id); // ← 一覧が返る
      setDeps(newList);                           // ← 即反映
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <section className="departments-panel">
      <h2>部署管理</h2>
      
      {/* 追加フォーム */}
      <form onSubmit={onAdd} className="add-form">
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="部署名" 
          disabled={loading}
        />
        <button type="submit" disabled={loading || !name.trim()}>
          {loading ? "追加中..." : "追加"}
        </button>
      </form>

      {/* 部署一覧 */}
      <div className="departments-list">
        {deps.length === 0 ? (
          <p>部署がありません</p>
        ) : (
          <ul>
            {deps.map(dept => (
              <li key={dept.id} className="department-item">
                {editingId === dept.id ? (
                  <div className="edit-form">
                    <input 
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={loading}
                    />
                    <button 
                      onClick={() => onUpdate(dept.id)}
                      disabled={loading || !editingName.trim()}
                    >
                      {loading ? "更新中..." : "保存"}
                    </button>
                    <button 
                      onClick={onCancelEdit}
                      disabled={loading}
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <div className="department-display">
                    <span className="department-name">{dept.name}</span>
                    <div className="department-actions">
                      <button 
                        onClick={() => onEdit(dept)}
                        disabled={loading}
                      >
                        編集
                      </button>
                      <button 
                        onClick={() => onDelete(dept.id)}
                        disabled={loading}
                        className="delete-btn"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 再取得ボタン（デバッグ用） */}
      <button 
        onClick={loadDepartments} 
        disabled={loading}
        className="refresh-btn"
      >
        {loading ? "読み込み中..." : "再取得"}
      </button>
    </section>
  );
}

