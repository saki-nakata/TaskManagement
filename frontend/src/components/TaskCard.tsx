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
}

export default function TaskCard({ task }: Props) {
  const priorityBadge = task.priority ? PRIORITY_BADGE[task.priority] : null;
  const due = formatDueDate(task.dueDate);

  return (
    <div className="bg-surface rounded shadow-sm px-3 py-2.5 border border-transparent hover:border-border hover:-translate-y-px hover:shadow-md transition-all cursor-pointer">
      <p className="text-sm font-medium leading-snug break-words text-text mb-2">{task.title}</p>
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
