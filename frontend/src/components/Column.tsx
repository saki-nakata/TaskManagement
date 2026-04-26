import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus, SortOrder } from '../types/task';
import TaskCard from './TaskCard';

const COLUMN_LABELS: Record<TaskStatus, string> = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

type SortCriterion = 'priority' | 'dueDate';

interface Props {
  status: TaskStatus;
  tasks: Task[];
  sortOrder: SortOrder;
  onTaskClick: (task: Task) => void;
  onSort: (criterion: SortCriterion) => void;
  activeTaskId: number | null;
  overId: number | string | null;
}

function DropIndicator() {
  return (
    <div className="flex items-center px-1 py-0.5 pointer-events-none">
      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      <div className="flex-1 h-0.5 bg-primary rounded" />
    </div>
  );
}

export default function Column({ status, tasks, sortOrder, onTaskClick, onSort, activeTaskId, overId }: Props) {
  const { setNodeRef } = useDroppable({ id: status });
  const isDragging = activeTaskId !== null;

  return (
    <div className="w-72 flex-shrink-0 bg-col-bg rounded-lg flex flex-col max-h-[calc(100vh-10rem)]">
      <div className="p-3 flex items-center gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-text-sub">
          {COLUMN_LABELS[status]}
        </span>
        <span className="bg-border text-text-sub text-xs font-bold rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {([['priority', '優先度順'], ['dueDate', '期限順']] as const).map(([val, label]) => {
            const isActive = sortOrder.startsWith(val);
            const isDesc = sortOrder === `${val}-desc`;
            return (
              <button
                key={val}
                type="button"
                onClick={() => onSort(val)}
                className={`px-1.5 py-0.5 text-xs font-medium rounded border transition-colors
                  ${isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-sub border-border hover:bg-bg'
                  }`}
              >
                {label}{isActive ? (isDesc ? ' ↓' : ' ↑') : ''}
              </button>
            );
          })}
        </div>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col min-h-[60px]">
          {tasks.map(task => (
            <div key={task.id} className="flex flex-col">
              {isDragging && overId === task.id && activeTaskId !== task.id && <DropIndicator />}
              <div className="mb-2">
                <TaskCard task={task} onClick={() => onTaskClick(task)} />
              </div>
            </div>
          ))}
          {isDragging && overId === status && <DropIndicator />}
        </div>
      </SortableContext>
    </div>
  );
}
