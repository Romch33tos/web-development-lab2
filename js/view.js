const taskList = document.querySelector('[data-list]');
const emptyState = document.querySelector('[data-empty]');
const taskTemplate = document.querySelector('#task-template');

export function render(state) {
  const items = state.tasks.map(createTaskItem);
  taskList.replaceChildren(...items);
  emptyState.hidden = state.tasks.length > 0;
}

function createTaskItem(task) {
  const item = taskTemplate.content.firstElementChild.cloneNode(true);

  const card = item.querySelector('.task');
  const check = item.querySelector('.task__check');
  const title = item.querySelector('.task__title');
  const body = item.querySelector('.task__body');
  const tools = item.querySelector('.task__tools');

  item.dataset.id = task.id;

  card.classList.toggle('task--done', task.done);

  check.id = `task-check-${task.id}`;
  check.checked = task.done;
  check.setAttribute('aria-label', `Отметить «${task.title}» выполненной`);

  title.textContent = task.title;
  body.textContent = task.body;

  item.querySelector('.task__delete')
    .setAttribute('aria-label', `Удалить задачу «${task.title}»`);

  item.querySelector('[data-action="share"]')
    .setAttribute('aria-label', `Поделиться задачей «${task.title}»`);

  item.querySelector('[data-action="info"]')
    .setAttribute('aria-label', `Информация о задаче «${task.title}»`);

  item.querySelector('[data-action="edit"]')
    .setAttribute('aria-label', `Редактировать задачу «${task.title}»`);

  tools.hidden = true;

  return item;
}
