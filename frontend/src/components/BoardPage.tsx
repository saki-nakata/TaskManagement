import { useEffect, useState } from 'react';
import { fetchTasks } from '../api/taskApi';
import type { Task } from '../types/task';
import Column from './Column';
import SearchBar from './SearchBar';

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTasks({
          keyword: keyword || undefined,
          status: status || undefined,
        });
        setTasks(data);
      } catch {
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, status]);

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 h-14 bg-surface border-b border-border px-6 flex items-center">
        <span className="text-base font-bold text-text">TaskManagement</span>
      </header>
      <div className="p-6">
        <SearchBar
          keyword={keyword}
          status={status}
          onKeywordChange={setKeyword}
          onStatusChange={setStatus}
        />
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
        {loading && (
          <p className="mt-4 text-sm text-text-sub">読み込み中...</p>
        )}
        <div className="flex gap-4 mt-4 items-start overflow-x-auto pb-4">
          <Column status="TODO" tasks={todoTasks} />
          <Column status="IN_PROGRESS" tasks={inProgressTasks} />
          <Column status="DONE" tasks={doneTasks} />
        </div>
      </div>
    </div>
  );
}
