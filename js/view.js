// js/view.js
const taskList = document.querySelector('[data-list]');
const emptyState = document.querySelector('[data-empty]');
const taskTemplate = document.querySelector('#task-template');

export function render(state) {
    const items = state.tasks.map(createTaskItem);
    taskList.replaceChildren(...items);
    emptyState.hidden = state.tasks.length > 0;
}
