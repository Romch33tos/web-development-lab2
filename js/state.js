// js/state.js
import { load, save } from './storage.js';

export const state = load();

let onChange = () => {};

export function subscribe(listener) {
    onChange = listener;
}

function commit() {
    save(state);
    onChange(state);
}

export function addTask(title, body = '') {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle) return false;

    state.tasks.push({
        id: crypto.randomUUID(),
        title: trimmedTitle,
        body: trimmedBody,
        done: false,
        createdAt: Date.now(),
    });

    commit();
    return true;
}

export function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    task.done = !task.done;
    commit();
}

export function removeTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    commit();
}
