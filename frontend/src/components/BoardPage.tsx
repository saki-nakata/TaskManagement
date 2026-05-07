import { useEffect, useRef, useState } from 'react';
import {
  DndContext, DragOverlay,
  closestCenter, pointerWithin,
  PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent, type DragMoveEvent,
  type CollisionDetection,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { fetchTasks, createTask, updateTask, reorderTasks, deleteTask } from '../api/taskApi';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, SortOrder, ReorderItem } from '../types/task';
import Column from './Column';
import SearchBar from './SearchBar';
import AddTaskModal from './AddTaskModal';
import TaskDetailModal from './TaskDetailModal';
import TaskCard from './TaskCard';
import ConfirmDialog from './ConfirmDialog';

const PRIORITY_RANK: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const STATUS_VALUES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const COLUMN_ORDER_KEY = 'taskboard-column-order';

// ポインターがカード上にある場合はカードを優先、それ以外はカラムを含む最近傍で検出
const cardPriorityCollision: CollisionDetection = (args) => {
  const cardDroppables = args.droppableContainers.filter(
    c => !STATUS_VALUES.includes(c.id as TaskStatus)
  );
  const pointerInCard = pointerWithin({ ...args, droppableContainers: cardDroppables });
  if (pointerInCard.length > 0) return pointerInCard;
  return closestCenter(args);
};

function loadColumnOrder(): Partial<Record<TaskStatus, number[]>> {
  try {
    const stored = localStorage.getItem(COLUMN_ORDER_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore malformed localStorage data */ }
  return {};
}

function saveColumnOrder(orders: Partial<Record<TaskStatus, number[]>>) {
  localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(orders));
}

// ローカルに保存した並び順を適用。DBにない ID は除外し、新規タスクは末尾に追加する。
function applyColumnOrder(tasks: Task[], ids: number[] | undefined): Task[] {
  if (!ids || ids.length === 0) return [...tasks].sort((a, b) => a.position - b.position);
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  const ordered = ids.filter(id => taskMap.has(id)).map(id => taskMap.get(id)!);
  const remaining = tasks.filter(t => !ids.includes(t.id));
  return [...ordered, ...remaining];
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

type SortCriterion = 'priority' | 'dueDate';

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [columnOrders, setColumnOrders] = useState<Partial<Record<TaskStatus, number[]>>>(loadColumnOrder);
  // ソート方向のトグル（セッション内のみ、localStorage に保存しない）
  const [sortDirections, setSortDirections] = useState<Record<TaskStatus, Record<SortCriterion, 'asc' | 'desc'>>>({
    TODO:        { priority: 'asc', dueDate: 'asc' },
    IN_PROGRESS: { priority: 'asc', dueDate: 'asc' },
    DONE:        { priority: 'asc', dueDate: 'asc' },
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<number | string | null>(null);
  const [overInsertBefore, setOverInsertBefore] = useState(true);
  const overInsertBeforeRef = useRef(true);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string>('');

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

  const handleDeleteRequest = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setDeleteTargetId(id);
    setDeleteTargetTitle(task?.title ?? '');
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    setTasks(prev => prev.filter(t => t.id !== deleteTargetId));
    // 削除されたタスクを localStorage の順序からも除去
    setColumnOrders(prev => {
      const updated = { ...prev };
      for (const s of STATUS_VALUES) {
        if (updated[s]) updated[s] = updated[s]!.filter(id => id !== deleteTargetId);
      }
      saveColumnOrder(updated);
      return updated;
    });
    setDeleteTargetId(null);
    setDeleteTargetTitle('');
    await deleteTask(deleteTargetId);
  };

  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
    setDeleteTargetTitle('');
  };

  // ソートボタン: DB 保存なし。表示順（columnOrders）を更新して localStorage に保存。
  const handleSort = (colStatus: TaskStatus, criterion: SortCriterion) => {
    const currentDir = sortDirections[colStatus][criterion];
    const newDir = currentDir === 'asc' ? 'desc' : 'asc';
    setSortDirections(prev => ({
      ...prev,
      [colStatus]: { ...prev[colStatus], [criterion]: newDir },
    }));

    const colTasks = tasks.filter(t => t.status === colStatus);
    const displayed = applyColumnOrder(colTasks, columnOrders[colStatus]);
    const sorted = applySortOrder(displayed, `${criterion}-${newDir}` as SortOrder);
    const newIds = sorted.map(t => t.id);

    const newOrders = { ...columnOrders, [colStatus]: newIds };
    setColumnOrders(newOrders);
    saveColumnOrder(newOrders);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === Number(event.active.id));
    setActiveTask(task ?? null);
  };

  const handleDragMove = ({ over, active }: DragMoveEvent) => {
    if (!over || !active.rect.current.translated) return;
    const activeCenterY = active.rect.current.translated.top + active.rect.current.translated.height / 2;
    const overCenterY = over.rect.top + over.rect.height / 2;
    overInsertBeforeRef.current = activeCenterY <= overCenterY;
  };

  const handleDragOver = ({ over, active }: DragOverEvent) => {
    setOverId(over?.id ?? null);
    if (over && active.rect.current.translated) {
      const activeCenterY = active.rect.current.translated.top + active.rect.current.translated.height / 2;
      const overCenterY = over.rect.top + over.rect.height / 2;
      setOverInsertBefore(activeCenterY <= overCenterY);
    } else {
      setOverInsertBefore(true);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const insertBefore = overInsertBeforeRef.current;
    setActiveTask(null);
    setOverId(null);
    setOverInsertBefore(true);
    overInsertBeforeRef.current = true;
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

    // 現在の表示順（localStorage 反映済み）でインデックスを計算する
    const sourceColTasks = applyColumnOrder(
      tasks.filter(t => t.status === sourceStatus),
      columnOrders[sourceStatus],
    );
    const targetColTasks = sourceStatus === targetStatus
      ? sourceColTasks
      : applyColumnOrder(
          tasks.filter(t => t.status === targetStatus),
          columnOrders[targetStatus],
        );

    let reorderItems: ReorderItem[];
    const newColumnOrders = { ...columnOrders };

    if (sourceStatus === targetStatus) {
      const oldIndex = sourceColTasks.findIndex(t => t.id === draggedId);
      const newIndex = isOverColumn
        ? sourceColTasks.length - 1
        : sourceColTasks.findIndex(t => t.id === Number(overId));
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const newOrder = arrayMove(sourceColTasks, oldIndex, newIndex);
      reorderItems = newOrder.map((t, i) => ({ id: t.id, status: sourceStatus, position: i * 1000 }));
      newColumnOrders[sourceStatus] = newOrder.map(t => t.id);
    } else {
      const newSourceCol = sourceColTasks.filter(t => t.id !== draggedId);
      let insertIndex = targetColTasks.length;
      if (!isOverColumn) {
        const overIdx = targetColTasks.findIndex(t => t.id === Number(overId));
        if (overIdx !== -1) {
          insertIndex = insertBefore ? overIdx : overIdx + 1;
        }
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
      newColumnOrders[sourceStatus] = newSourceCol.map(t => t.id);
      newColumnOrders[targetStatus] = newTargetCol.map(t => t.id);
    }

    setColumnOrders(newColumnOrders);
    saveColumnOrder(newColumnOrders);

    const posMap = new Map(reorderItems.map(r => [r.id, r]));
    setTasks(prev =>
      prev.map(t => {
        const r = posMap.get(t.id);
        return r ? { ...t, status: r.status, position: r.position } : t;
      })
    );
    await reorderTasks(reorderItems);
  };

  const todoTasks       = applyColumnOrder(tasks.filter(t => t.status === 'TODO'),        columnOrders.TODO);
  const inProgressTasks = applyColumnOrder(tasks.filter(t => t.status === 'IN_PROGRESS'), columnOrders.IN_PROGRESS);
  const doneTasks       = applyColumnOrder(tasks.filter(t => t.status === 'DONE'),         columnOrders.DONE);

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
        <DndContext sensors={sensors} collisionDetection={cardPriorityCollision} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 mt-4 items-start overflow-x-auto pb-4">
            <Column
              status="TODO" tasks={todoTasks}
              onTaskClick={setSelectedTask}
              onSort={criterion => handleSort('TODO', criterion)}
              activeTaskId={activeTask?.id ?? null}
              overId={overId}
              overInsertBefore={overInsertBefore}
              onDelete={handleDeleteRequest}
            />
            <Column
              status="IN_PROGRESS" tasks={inProgressTasks}
              onTaskClick={setSelectedTask}
              onSort={criterion => handleSort('IN_PROGRESS', criterion)}
              activeTaskId={activeTask?.id ?? null}
              overId={overId}
              overInsertBefore={overInsertBefore}
              onDelete={handleDeleteRequest}
            />
            <Column
              status="DONE" tasks={doneTasks}
              onTaskClick={setSelectedTask}
              onSort={criterion => handleSort('DONE', criterion)}
              activeTaskId={activeTask?.id ?? null}
              overId={overId}
              overInsertBefore={overInsertBefore}
              onDelete={handleDeleteRequest}
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
          onDelete={() => {
            setSelectedTask(null);
            handleDeleteRequest(selectedTask.id);
          }}
        />
      )}
      {deleteTargetId !== null && (
        <ConfirmDialog
          message={`「${deleteTargetTitle}」を削除してもよろしいですか？`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}
