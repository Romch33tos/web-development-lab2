import { state } from './state.js';
import { closeModal, getCurrentTaskId } from './modals.js';

function showError(errorElement, input, message) {
  errorElement.textContent = message;
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

function clearError(errorElement, input) {
  errorElement.textContent = '';
  input.removeAttribute('aria-invalid');
}
