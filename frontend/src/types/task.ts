export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
}
