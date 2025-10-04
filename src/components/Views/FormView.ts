import { View } from './View';
import { IFormView } from '../../types';

export abstract class FormView<T extends Record<string, any>> extends View<T> implements IFormView<T> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);

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
    this.validateForm();
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

  protected validateForm(): void {
    const errors = this.validate();
    this.setSubmitDisabled(Object.keys(errors).length > 0);
  }

  protected abstract validate(): Record<string, string | undefined>;
  protected abstract setupSubmitHandler(): void;
}