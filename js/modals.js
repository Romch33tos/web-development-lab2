// js/modals.js
import { state, editTask, removeTask } from './state.js';

const modalElements = {
    delete: document.querySelector('[data-modal="delete"]'),
    edit: document.querySelector('[data-modal="edit"]'),
    share: document.querySelector('[data-modal="share"]'),
    info: document.querySelector('[data-modal="info"]'),
};

let currentTaskId = null;

export function openModal(name, taskId) {
    currentTaskId = taskId;

    const task = state.tasks.find(t => t.id === taskId);

    if (name === 'edit') {
        if (!task) return;
        document.querySelector('#edit-title-input').value = task.title;
        document.querySelector('#edit-body-input').value = task.body;
    }

    modalElements[name].hidden = false;

    const focusTarget = modalElements[name].querySelector('input, textarea')
        || modalElements[name].querySelector('button:not([data-modal-close])')
        || modalElements[name].querySelector('button');
    if (focusTarget) focusTarget.focus();
}

export function closeModal(name) {
    modalElements[name].hidden = true;
    currentTaskId = null;
}

export function closeAllModals() {
    Object.keys(modalElements).forEach(name => {
        if (!modalElements[name].hidden) closeModal(name);
    });
}

export function getCurrentTaskId() {
    return currentTaskId;
}
