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
  
  const card = event.target.closest('.task');
  if (!card) return;

  if (event.target.matches('input, button')) return;

  event.preventDefault(); 
  event.stopPropagation(); 

  const taskItem = card.closest('.task-item');
  const check = taskItem.querySelector('.task__check');
  if (!check) return;

  check.click();
}

export function setupEditModal({ editTask, closeModal, getCurrentTaskId }) {
  const editTitleInput = document.querySelector('#edit-title-input');
  const editBodyInput = document.querySelector('#edit-body-input');
  let isSaving = false;

  const saveEdit = () => {
    if (isSaving) return;
    isSaving = true;

    const taskId = getCurrentTaskId();
    if (taskId) {
      editTask(taskId, editTitleInput.value, editBodyInput.value);
      announce('Задача изменена');
    }
    
    closeModal('edit');
    setTimeout(() => { isSaving = false; }, 200);
  };

  editTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    }
  });

  editBodyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
  });

  const handleBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.closest('.modal[data-modal="edit"]')) {
      return;
    }
    saveEdit();
  };

  editTitleInput.addEventListener('blur', handleBlur);
  editBodyInput.addEventListener('blur', handleBlur);
}

export function handleAfterDelete({ list, form }) {
  const firstItem = list.querySelector('.task-item');
  if (firstItem) {
    firstItem.querySelector('.task__delete')?.focus();
  } else {
    form.querySelector('#new-task-title')?.focus();
  }
  announce('Задача удалена');
}

export function handleAfterEdit({ id, list, form }) {
  const taskItem = list.querySelector(`.task-item[data-id="${id}"]`);
  const titleElement = taskItem?.querySelector('.task__title');
  if (titleElement) {
    titleElement.setAttribute('tabindex', '-1');
    titleElement.focus();
    titleElement.removeAttribute('tabindex');
  } else {
    form.querySelector('#new-task-title')?.focus();
  }
}

function announce(message) {
  const statusElement = document.querySelector('[data-status]');
  if (!statusElement) return;
  statusElement.textContent = '';
  setTimeout(() => {
    statusElement.textContent = message;
  }, 50);
}
