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
