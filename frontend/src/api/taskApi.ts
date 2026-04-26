import axios from 'axios';
import type { Task, CreateTaskInput, UpdateTaskInput, ReorderItem } from '../types/task';

const api = axios.create({ baseURL: '/api' });

export interface SearchParams {
  keyword?: string;
  status?: string;
}

export async function fetchTasks(params: SearchParams): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks', { params });
  return data;
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const payload = {
    title: input.title,
    description: input.description || null,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
  };
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
}

export async function reorderTasks(items: ReorderItem[]): Promise<void> {
  await api.patch('/tasks/reorder', items);
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const payload = {
    title: input.title,
    description: input.description || null,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
  };
  const { data } = await api.post<Task>('/tasks', payload);
  return data;
}
