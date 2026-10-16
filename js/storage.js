// js/storage.js
const STORAGE_KEY = 'todo-app:v1';

export function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { tasks: [] };

        const data = JSON.parse(raw);
        return data;
    } catch (error) {
        console.warn('Не удалось прочитать сохранённые задачи', error);
        return { tasks: [] };
    }
}
