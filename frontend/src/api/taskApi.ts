import axios from 'axios';
import type { Task } from '../types/task';

const api = axios.create({ baseURL: '/api' });

export interface SearchParams {
  keyword?: string;
  status?: string;
}

export async function fetchTasks(params: SearchParams): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks', { params });
  return data;
}
