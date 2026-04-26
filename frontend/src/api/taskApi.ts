import axios from 'axios';
import type { Task, CreateTaskInput } from '../types/task';

const api = axios.create({ baseURL: '/api' });

export interface SearchParams {
  keyword?: string;
  status?: string;
}

export async function fetchTasks(params: SearchParams): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks', { params });
  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const payload = {
    title: input.title,
    description: input.description || null,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate || null,
  };
  const { data } = await api.post<Task>('/tasks', payload);
  return data;
}
