import AsyncStorage from '@react-native-async-storage/async-storage';

export type Period = 'diaria' | 'semanal' | 'mensal' | 'semestral' | 'anual';

export interface Task {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export const PERIODS: Period[] = ['diaria', 'semanal', 'mensal', 'semestral', 'anual'];

export const PERIOD_LABELS: Record<Period, string> = {
  diaria: 'Diária',
  semanal: 'Semanal',
  mensal: 'Mensal',
  semestral: 'Semestral',
  anual: 'Anual',
};

export const PERIOD_ICONS: Record<Period, string> = {
  diaria: 'sunny',
  semanal: 'calendar',
  mensal: 'moon',
  semestral: 'star',
  anual: 'trophy',
};

export const PERIOD_COLORS: Record<Period, string> = {
  diaria: '#C8F135',
  semanal: '#7B61FF',
  mensal: '#FF9F43',
  semestral: '#48DBFB',
  anual: '#FF6B6B',
};

const KEY = (period: Period) => `metas_v1_${period}`;

export async function loadTasks(period: Period): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY(period));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTasks(period: Period, tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY(period), JSON.stringify(tasks));
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

export async function loadAllTasks(): Promise<Record<Period, Task[]>> {
  const result = {} as Record<Period, Task[]>;
  for (const p of PERIODS) {
    result[p] = await loadTasks(p);
  }
  return result;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
