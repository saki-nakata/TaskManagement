export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: Priority | null;
  dueDate: string | null;   // YYYY-MM-DD
  position: number;
  createdAt: string;
  updatedAt: string;
}
