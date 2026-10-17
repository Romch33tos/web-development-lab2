import { state } from './state.js';
import { closeModal, getCurrentTaskId } from './modals.js';

export function handleSubmit(event, { addTask, form }) {
  event.preventDefault();

  const titleInput = form.querySelector('#new-task-title');
  const bodyInput = form.querySelector('#new-task-body');
  const errorElement = form.querySelector('#new-task-error');

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showError(errorElement, titleInput, 'Введите заголовок задачи');
    return;
  }

  addTask(title, body);
  announce(`Задача «${title}» добавлена`);

  form.reset();
  clearError(errorElement, titleInput);
  titleInput.focus();
}

export function attachTitleInputListener(form) {
  const titleInput = form.querySelector('#new-task-title');
  const errorElement = form.querySelector('#new-task-error');
  titleInput.addEventListener('input', () => {
    if (titleInput.getAttribute('aria-invalid') === 'true') {
      clearError(errorElement, titleInput);
    }
  });
}

function showError(errorElement, input, message) {
  errorElement.textContent = message;
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

function clearError(errorElement, input) {
  errorElement.textContent = '';
  input.removeAttribute('aria-invalid');
}

export function handleChange(event, { toggleTask }) {
  if (!event.target.matches('.task__check')) return;

  const taskItem = event.target.closest('.task-item');
  if (!taskItem) return;

  const taskId = taskItem.dataset.id;
  const titleElement = taskItem.querySelector('.task__title');
  const taskTitle = titleElement ? titleElement.textContent : '';

  toggleTask(taskId);

  announce(event.target.checked
    ? `Задача «${taskTitle}» отмечена выполненной`
    : `Отметка с задачи «${taskTitle}» снята`
  );
}

export function handleClick(event, { openModal }) {
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
    if (tools) tools.hidden = !tools.hidden;
  }
}

export function handleKeyDownOnCard(event, { toggleTask }) {
  if (event.key !== ' ') return;
  if (!event.target.classList.contains('task') || event.target.closest('button, input')) return;

  event.preventDefault();

  const taskItem = event.target.closest('.task-item');
  const check = taskItem.querySelector('.task__check');
  if (!check) return;

  check.checked = !check.checked;
  check.dispatchEvent(new Event('change', { bubbles: true }));
}

export function setupEditModal({ editTask, closeModal }) {
  const editTitleInput = document.querySelector('#edit-title-input');
  const editBodyInput = document.querySelector('#edit-body-input');

  let isSaving = false;

  const saveEdit = () => {
    if (isSaving) return;
    isSaving = true;

    const taskId = getCurrentTaskId();
    if (taskId) {
      editTask(taskId, editTitleInput.value, editBodyInput.value);
    }
    closeModal('edit');
    announce('Задача изменена');

    setTimeout(() => { isSaving = false; }, 100);
  };

  editTitleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit();
    }
  });

  editBodyInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    }
  });

  const handleBlur = (event) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && relatedTarget.closest('.modal[data-modal="edit"]')) return;
    saveEdit();
  };

  editTitleInput.addEventListener('blur', handleBlur);
  editBodyInput.addEventListener('blur', handleBlur);
}
