import { useState } from 'react';
import type { Task, UpdateTaskInput } from '../types/task';

interface Props {
  task: Task;
  onClose: () => void;
  onSubmit: (id: number, input: UpdateTaskInput) => Promise<void>;
}

export default function TaskDetailModal({ task, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<UpdateTaskInput>({
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority ?? 'MEDIUM',
    dueDate: task.dueDate,
  });
  const [titleError, setTitleError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'title') setTitleError('');
    if (e.target.name === 'dueDate') setDueDateError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!form.title.trim()) {
      setTitleError('タイトルは必須です');
      hasError = true;
    }
    if (!form.dueDate) {
      setDueDateError('期日は必須です');
      hasError = true;
    }
    if (hasError) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(task.id, { ...form, title: form.title.trim() });
      onClose();
    } catch {
      setSubmitError('更新に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-text">タスクを編集</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-sub hover:text-text text-lg leading-none"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="タスクのタイトル"
              className={`w-full border rounded px-3 py-2 text-sm text-text placeholder:text-text-sub focus:outline-none focus:ring-2 focus:ring-primary ${titleError ? 'border-red-500' : 'border-border'}`}
            />
            {titleError && (
              <p className="mt-1 text-xs text-red-500">{titleError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">説明</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="タスクの詳細（任意）"
              className="w-full border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-sub focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">ステータス</label>
            <div className="flex rounded border border-border overflow-hidden">
              {([['TODO', 'Todo'], ['IN_PROGRESS', 'In Progress'], ['DONE', 'Done']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, status: value }))}
                  className={`flex-1 py-2 text-sm font-medium transition-colors
                    ${form.status === value
                      ? 'bg-green-500 text-white'
                      : 'bg-surface text-text-sub hover:bg-bg'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">優先度</label>
            <div className="flex rounded border border-border overflow-hidden">
              {([['HIGH', '高'], ['MEDIUM', '中'], ['LOW', '低']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, priority: value }))}
                  className={`flex-1 py-2 text-sm font-medium transition-colors
                    ${form.priority === value
                      ? 'bg-green-500 text-white'
                      : 'bg-surface text-text-sub hover:bg-bg'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              期日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary ${dueDateError ? 'border-red-500' : 'border-border'}`}
            />
            {dueDateError && (
              <p className="mt-1 text-xs text-red-500">{dueDateError}</p>
            )}
          </div>

          {submitError && (
            <p className="text-xs text-red-500">{submitError}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-border text-text hover:bg-bg"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm rounded bg-primary text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? '更新中...' : '更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
