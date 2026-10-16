import { state, editTask, removeTask } from './state.js';

const modalElements = {
    delete: document.querySelector('[data-modal="delete"]'),
    edit: document.querySelector('[data-modal="edit"]'),
    share: document.querySelector('[data-modal="share"]'),
    info: document.querySelector('[data-modal="info"]'),
};

let currentTaskId = null;
let afterDeleteCallback = () => {};
let afterEditCallback = () => {};

export function openModal(name, taskId) {
    currentTaskId = taskId;

    const task = state.tasks.find(t => t.id === taskId);

    if (name === 'edit') {
        if (!task) return;
        document.querySelector('#edit-title-input').value = task.title;
        document.querySelector('#edit-body-input').value = task.body;
    }

    if (name === 'info') {
        if (!task) return;
        renderInfoContent(task);
    }

    modalElements[name].hidden = false;

    const focusTarget = modalElements[name].querySelector('input, textarea')
        || modalElements[name].querySelector('button:not([data-modal-close])')
        || modalElements[name].querySelector('button');
    if (focusTarget) focusTarget.focus();
}

function renderInfoContent(task) {
    const createdAt = new Date(task.createdAt);
    const infoContent = document.querySelector('[data-info-content]');
    infoContent.innerHTML = '';
    const definitionList = document.createElement('dl');

    const fields = [
        ['Заголовок', task.title],
        ['Описание', task.body || '—'],
        ['Создана', createdAt.toLocaleString('ru-RU')],
        ['Статус', task.done ? 'Выполнена' : 'В работе'],
    ];

    for (const [label, value] of fields) {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        definitionList.append(dt, dd);
    }

    infoContent.appendChild(definitionList);
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

export function onDelete(callback) {
    afterDeleteCallback = callback;
}

export function onEdit(callback) {
    afterEditCallback = callback;
}

document.querySelectorAll('[data-modal-close]').forEach(element => {
    element.addEventListener('click', () => {
        const modal = element.closest('.modal');
        if (modal) closeModal(modal.dataset.modal);
    });
});

document.querySelector('[data-modal-confirm-delete]').addEventListener('click', () => {
    if (currentTaskId) {
        removeTask(currentTaskId);
        afterDeleteCallback(currentTaskId);
    }
    closeModal('delete');
});

document.querySelector('[data-modal-confirm-edit]').addEventListener('click', () => {
    if (currentTaskId) {
        const newTitle = document.querySelector('#edit-title-input').value;
        const newBody = document.querySelector('#edit-body-input').value;
        editTask(currentTaskId, newTitle, newBody);
        afterEditCallback(currentTaskId);
    }
    closeModal('edit');
});

document.querySelectorAll('[data-share-action]').forEach(button => {
    button.addEventListener('click', () => {
        const { shareAction } = button.dataset;
        const task = state.tasks.find(t => t.id === currentTaskId);
        const text = task ? `${task.title}\n${task.body}` : '';

        if (shareAction === 'copy' && navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(() => {});
        }
        closeModal('share');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    ['edit', 'share', 'info', 'delete'].some(name => {
        if (!modalElements[name].hidden) {
            closeModal(name);
            return true;
        }
        return false;
    });
});
