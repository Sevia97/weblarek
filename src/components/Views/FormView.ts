import { View } from './View';
import { IFormView } from '../../types';
import { EventEmitter } from '../base/Events';

export abstract class FormView<T extends Record<string, any>> extends View<T> implements IFormView<T> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected events: EventEmitter;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this._submitButton = this.ensureElement<HTMLButtonElement>('.button[type="submit"]');
    this._errors = this.ensureElement<HTMLElement>('.form__errors');

    this.setupSubmitHandler();

    // Изначально блокируем кнопку
    this.setSubmitDisabled(true);
  }

  getFormData(): T {
    const formData = new FormData(this.container as HTMLFormElement);
    return Object.fromEntries(formData.entries()) as T;
  }

  setFormData(data: Partial<T>): void {
    Object.keys(data).forEach(key => {
      const element = this.container.querySelector(`[name="${key}"]`) as HTMLInputElement;
      if (element && data[key as keyof T] !== undefined) {
        element.value = data[key as keyof T] as string;
      }
    });
  }

  clearForm(): void {
    (this.container as HTMLFormElement).reset();
    this.clearErrors();
    this.setSubmitDisabled(true);
  }

  setErrors(errors: Record<string, string | undefined>): void {
    this.clearErrors();
    Object.values(errors).forEach(message => {
      if (message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('form__error');
        errorElement.textContent = message;
        this._errors.appendChild(errorElement);
      }
    });
  }

  clearErrors(): void {
    this._errors.innerHTML = '';
  }

  setSubmitDisabled(state: boolean): void {
    this.setDisabled(this._submitButton, state);
  }

  protected abstract setupSubmitHandler(): void;
  protected abstract validate(): Record<string, string | undefined>;
}