
import type {AccentAceHistoryItem} from '@/lib/types';

const HISTORY_KEY = 'accentAceHistory';

const getHistory = (): AccentAceHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const historyJson = localStorage.getItem(HISTORY_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
};

const saveHistory = (history: AccentAceHistoryItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export function addHistoryItem(
  phrase: string,
  referenceAudioUrl: string
): string {
  const history = getHistory();
  const newItem: any = {
    id: new Date().getTime().toString(),
    phrase,
    referenceAudioUrl,
    createdAt: new Date().toISOString(),
  };
  const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
  saveHistory(newHistory);
  return newItem.id;
}

export function updateHistoryItem(
  id: string,
  data: Partial<Omit<AccentAceHistoryItem, 'id'>>
) {
  const history = getHistory();
  const itemIndex = history.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    history[itemIndex] = {
      ...history[itemIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveHistory(history);
  }
}

export function getHistoryItems(): AccentAceHistoryItem[] {
  const history = getHistory();
  // Sort by creation date descending
  return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
