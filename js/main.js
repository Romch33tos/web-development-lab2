// js/main.js
import { state, subscribe, addTask, toggleTask } from './state.js';
import { render } from './view.js';
import { openModal, onDelete, onEdit } from './modals.js';

const addForm = document.querySelector('[data-add-form]');
const titleInput = document.querySelector('#new-task-title');
const bodyInput = document.querySelector('#new-task-body');
const errorElement = document.querySelector('#new-task-error');
const taskList = document.querySelector('[data-list]');
const statusElement = document.querySelector('[data-status]');

subscribe(render);
render(state);

function announce(message) {
    statusElement.textContent = '';
    setTimeout(() => {
        statusElement.textContent = message;
    }, 50);
}

function showError(message) {
    errorElement.textContent = message;
}

function clearError() {
    errorElement.textContent = '';
    titleInput.removeAttribute('aria-invalid');
}

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showError('Введите заголовок задачи');
        titleInput.setAttribute('aria-invalid', 'true');
        titleInput.focus();
        return;
    }

    addTask(title, body);
    announce(`Задача «${title}» добавлена`);

    addForm.reset();
    clearError();
    titleInput.focus();
});

titleInput.addEventListener('input', () => {
    if (titleInput.getAttribute('aria-invalid') === 'true') clearError();
});

taskList.addEventListener('click', (event) => {
    if (event.target.matches('.task__check')) return;

    const taskItem = event.target.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;

    if (event.target.closest('[data-action="delete"]')) {
        event.stopPropagation();
        openModal('delete', taskId);
        return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
        const { action } = actionButton.dataset;
        if (action === 'share') openModal('share', taskId);
        if (action === 'info') openModal('info', taskId);
        if (action === 'edit') openModal('edit', taskId);
        return;
    }

    if (event.target.closest('[data-task-toggle]')) {
        const tools = taskItem.querySelector('.task__tools');
        tools.hidden = !tools.hidden;
    }
});
