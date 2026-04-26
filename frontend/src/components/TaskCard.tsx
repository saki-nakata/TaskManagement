import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, Priority } from '../types/task';

const PRIORITY_BADGE: Record<Priority, { bg: string; text: string; label: string }> = {
  HIGH:   { bg: 'bg-[#FFEBE6]', text: 'text-[#BF2600]', label: '高' },
  MEDIUM: { bg: 'bg-[#FFFAE6]', text: 'text-[#974F0C]', label: '中' },
  LOW:    { bg: 'bg-[#DEEBFF]', text: 'text-[#0052CC]', label: '低' },
};

function formatDueDate(dueDate: string): { label: string; overdue: boolean } {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = due < today;
  const label = `${due.getFullYear()}/${String(due.getMonth() + 1).padStart(2, '0')}/${String(due.getDate()).padStart(2, '0')}`;
  return { label, overdue };
}

interface Props {
  task: Task;
  onClick?: () => void;
  onDelete?: (id: number) => void;
}

export default function TaskCard({ task, onClick, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const priorityBadge = task.priority ? PRIORITY_BADGE[task.priority] : null;
  const due = formatDueDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      {...attributes}
      {...listeners}
      className="bg-surface rounded shadow-sm px-3 py-2.5 border border-transparent hover:border-border hover:-translate-y-px hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <div className="flex items-start gap-1 mb-2">
        <p className="flex-1 text-sm font-medium leading-snug break-words text-text">{task.title}</p>
        {onDelete && (
          <button
            type="button"
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="flex-shrink-0 p-1 rounded text-text-sub hover:text-red-600 hover:bg-red-50"
            aria-label="タスクを削除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {priorityBadge && (
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${priorityBadge.bg} ${priorityBadge.text}`}>
            {priorityBadge.label}
          </span>
        )}
        <span className={`inline-block text-xs px-2 py-0.5 rounded ${due.overdue ? 'text-red-600 font-semibold' : 'text-text-sub'}`}>
          期限：{due.label}
        </span>
      </div>
    </div>
  );
}
