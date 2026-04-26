import type { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

const COLUMN_LABELS: Record<TaskStatus, string> = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

interface Props {
  status: TaskStatus;
  tasks: Task[];
}

export default function Column({ status, tasks }: Props) {
  return (
    <div className="w-72 flex-shrink-0 bg-col-bg rounded-lg flex flex-col max-h-[calc(100vh-10rem)]">
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-text-sub">
          {COLUMN_LABELS[status]}
        </span>
        <span className="bg-border text-text-sub text-xs font-bold rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-2 min-h-[60px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
