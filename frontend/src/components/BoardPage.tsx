import { useEffect, useState } from 'react';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { fetchTasks, createTask, updateTask, reorderTasks } from '../api/taskApi';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, SortOrder, ReorderItem } from '../types/task';
import Column from './Column';
import SearchBar from './SearchBar';
import AddTaskModal from './AddTaskModal';
import TaskDetailModal from './TaskDetailModal';
import TaskCard from './TaskCard';

const PRIORITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const STATUS_VALUES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const SORT_STORAGE_KEY = 'taskboard-sort';

function loadSortOrders(): Record<TaskStatus, SortOrder> {
  try {
    const stored = localStorage.getItem(SORT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { TODO: 'position', IN_PROGRESS: 'position', DONE: 'position' };
}

function saveSortOrders(orders: Record<TaskStatus, SortOrder>) {
  localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(orders));
}

function applySortOrder(tasks: Task[], order: SortOrder): Task[] {
  if (order === 'priority-asc') {
    return [...tasks].sort((a, b) =>
      (PRIORITY_RANK[a.priority ?? 'LOW'] ?? 2) - (PRIORITY_RANK[b.priority ?? 'LOW'] ?? 2)
    );
  }
  if (order === 'priority-desc') {
    return [...tasks].sort((a, b) =>
      (PRIORITY_RANK[b.priority ?? 'LOW'] ?? 2) - (PRIORITY_RANK[a.priority ?? 'LOW'] ?? 2)
    );
  }
  if (order === 'dueDate-asc') {
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }
  if (order === 'dueDate-desc') {
    return [...tasks].sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  }
  return [...tasks].sort((a, b) => a.position - b.position);
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortOrders, setSortOrders] = useState<Record<TaskStatus, SortOrder>>(loadSortOrders);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<number | string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  const handleUpdateTask = async (id: number, input: UpdateTaskInput) => {
    await updateTask(id, input);
    const data = await fetchTasks({
      keyword: keyword || undefined,
      status: status || undefined,
    });
    setTasks(data);
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    await createTask(input);
    const data = await fetchTasks({
      keyword: keyword || undefined,
      status: status || undefined,
    });
    setTasks(data);
  };

  const handleSort = (colStatus: TaskStatus, criterion: 'priority' | 'dueDate') => {
    setSortOrders(prev => {
      const current = prev[colStatus];
      const newOrder: SortOrder = current === `${criterion}-asc`
        ? `${criterion}-desc`
        : `${criterion}-asc`;
      const updated = { ...prev, [colStatus]: newOrder };
      saveSortOrders(updated);
      return updated;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === Number(event.active.id));
    setActiveTask(task ?? null);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    setOverId(null);
    const { active, over } = event;
    if (!over) return;

    const draggedId = Number(active.id);
    const draggedTask = tasks.find(t => t.id === draggedId);
    if (!draggedTask) return;

    const overId = over.id as string | number;
    const isOverColumn = STATUS_VALUES.includes(overId as TaskStatus);
    const targetStatus: TaskStatus = isOverColumn
      ? (overId as TaskStatus)
      : (tasks.find(t => t.id === Number(overId))?.status ?? draggedTask.status);

    const sourceStatus = draggedTask.status;

    const sourceColTasks = applySortOrder(tasks.filter(t => t.status === sourceStatus), sortOrders[sourceStatus]);
    const targetColTasks = sourceStatus === targetStatus
      ? sourceColTasks
      : applySortOrder(tasks.filter(t => t.status === targetStatus), sortOrders[targetStatus]);

    let reorderItems: ReorderItem[];

    if (sourceStatus === targetStatus) {
      const oldIndex = sourceColTasks.findIndex(t => t.id === draggedId);
      const newIndex = isOverColumn
        ? sourceColTasks.length - 1
        : sourceColTasks.findIndex(t => t.id === Number(overId));
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const newOrder = arrayMove(sourceColTasks, oldIndex, newIndex);
      reorderItems = newOrder.map((t, i) => ({ id: t.id, status: sourceStatus, position: i * 1000 }));
    } else {
      const newSourceCol = sourceColTasks.filter(t => t.id !== draggedId);
      let insertIndex = targetColTasks.length;
      if (!STATUS_VALUES.includes(overId as TaskStatus)) {
        const overIdx = targetColTasks.findIndex(t => t.id === Number(overId));
        if (overIdx !== -1) insertIndex = overIdx;
      }
      const newTargetCol = [
        ...targetColTasks.slice(0, insertIndex),
        { ...draggedTask, status: targetStatus },
        ...targetColTasks.slice(insertIndex),
      ];
      reorderItems = [
        ...newSourceCol.map((t, i) => ({ id: t.id, status: sourceStatus, position: i * 1000 })),
        ...newTargetCol.map((t, i) => ({ id: t.id, status: targetStatus, position: i * 1000 })),
      ];
    }

    const posMap = new Map(reorderItems.map(r => [r.id, r]));
    setTasks(prev =>
      prev.map(t => {
        const r = posMap.get(t.id);
        return r ? { ...t, status: r.status, position: r.position } : t;
      })
    );
    await reorderTasks(reorderItems);
  };

  const todoTasks      = applySortOrder(tasks.filter(t => t.status === 'TODO'),        sortOrders.TODO);
  const inProgressTasks = applySortOrder(tasks.filter(t => t.status === 'IN_PROGRESS'), sortOrders.IN_PROGRESS);
  const doneTasks      = applySortOrder(tasks.filter(t => t.status === 'DONE'),         sortOrders.DONE);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 h-14 bg-surface border-b border-border px-6 flex items-center">
        <span className="text-base font-bold text-text">TaskManagement</span>
        <button
          onClick={() => setShowModal(true)}
          className="ml-auto px-3 py-1.5 text-sm rounded bg-primary text-white hover:bg-blue-700"
        >
          + タスクを追加
        </button>
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
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 mt-4 items-start overflow-x-auto pb-4">
            <Column
              status="TODO" tasks={todoTasks}
              sortOrder={sortOrders.TODO}
              onTaskClick={setSelectedTask}
              onSort={criterion => handleSort('TODO', criterion)}
              activeTaskId={activeTask?.id ?? null}
              overId={overId}
            />
            <Column
              status="IN_PROGRESS" tasks={inProgressTasks}
              sortOrder={sortOrders.IN_PROGRESS}
              onTaskClick={setSelectedTask}
              onSort={criterion => handleSort('IN_PROGRESS', criterion)}
              activeTaskId={activeTask?.id ?? null}
              overId={overId}
            />
            <Column
              status="DONE" tasks={doneTasks}
              sortOrder={sortOrders.DONE}
              onTaskClick={setSelectedTask}
              onSort={criterion => handleSort('DONE', criterion)}
              activeTaskId={activeTask?.id ?? null}
              overId={overId}
            />
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>
        </DndContext>
      </div>
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmit={handleUpdateTask}
        />
      )}
    </div>
  );
}
