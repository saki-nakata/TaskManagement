import type { Task, TaskStatus } from '../types/task';

const STATUS_BADGE: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  TODO: { bg: 'bg-[#EBECF0]', text: 'text-[#6B778C]', label: 'Todo' },
  IN_PROGRESS: { bg: 'bg-[#FFFAE6]', text: 'text-[#974F0C]', label: 'In Progress' },
  DONE: { bg: 'bg-[#E3FCEF]', text: 'text-[#006644]', label: 'Done' },
};

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const badge = STATUS_BADGE[task.status];
  return (
    <div className="bg-surface rounded shadow-sm px-3 py-2.5 border border-transparent hover:border-border hover:-translate-y-px hover:shadow-md transition-all cursor-pointer">
      <p className="text-sm font-medium leading-snug break-words text-text mb-2">{task.title}</p>
      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    </div>
  );
}
