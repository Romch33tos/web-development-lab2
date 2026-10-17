import { state, subscribe, addTask, toggleTask, removeTask, editTask } from './state.js';
import { render } from './view.js';
import { openModal, closeModal, onDelete, onEdit, getCurrentTaskId } from './modals.js';
import {
  handleSubmit,
  handleChange,
  handleClick,
  handleKeyDownOnCard,
  handleAfterDelete,
  handleAfterEdit,
  attachTitleInputListener,
  setupEditModal,
} from './handlers.js';

const addForm = document.querySelector('[data-add-form]');
const taskList = document.querySelector('[data-list]');
const titleInput = document.querySelector('#new-task-title');

subscribe(render);
render(state);

attachTitleInputListener(addForm);

setupEditModal({ editTask, closeModal, getCurrentTaskId });

addForm.addEventListener('submit', (event) => {
  handleSubmit(event, { addTask, form: addForm });
});

taskList.addEventListener('click', (event) => {
  handleClick(event, { openModal });
});

taskList.addEventListener('change', (event) => {
  handleChange(event, { toggleTask });
});

taskList.addEventListener('keydown', (event) => {
  handleKeyDownOnCard(event, { toggleTask });
});

document.querySelector('[data-modal-confirm-delete]').addEventListener('click', () => {
  const id = getCurrentTaskId();
  if (id) {
    removeTask(id);
    handleAfterDelete({ list: taskList, form: addForm });
  }
  closeModal('delete');
});

onDelete(() => {
  handleAfterDelete({ list: taskList, form: addForm });
});

onEdit((id) => {
  handleAfterEdit({ id, list: taskList, form: addForm });
});
