export const HISTORY_KEY = 'icanpick-history';
export const DRAFT_KEY = 'icanpick-draft';
export function readHistory(storage) {
  try {
    const data = JSON.parse(storage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(data) ? data.filter(item => item && typeof item.result === 'string' && typeof item.title === 'string' && typeof item.date === 'string' && Number.isFinite(Date.parse(item.date))).slice(0, 20) : [];
  } catch { return []; }
}
export function readDraft(storage) {
  const fallback = { title: '', options: ['', ''] };
  try {
    const data = JSON.parse(storage.getItem(DRAFT_KEY));
    if (!data || typeof data.title !== 'string' || !Array.isArray(data.options) || data.options.length < 2 || data.options.length > 8 || !data.options.every(value => typeof value === 'string')) return fallback;
    return { title: data.title.slice(0, 60), options: data.options.map(value => value.slice(0, 80)) };
  } catch { return fallback; }
}
