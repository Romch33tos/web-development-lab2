// js/storage.js
const STORAGE_KEY = 'todo-app:v1';

export function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { tasks: [] };

        const data = JSON.parse(raw);

        if (!data || !Array.isArray(data.tasks)) {
            console.warn('Повреждённая структура данных, стартуем с пустым списком');
            return { tasks: [] };
        }

        return { tasks: data.tasks };
    } catch (error) {
        console.warn('Не удалось прочитать сохранённые задачи', error);
        return { tasks: [] };
    }
}
