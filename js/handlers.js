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
