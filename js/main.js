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
