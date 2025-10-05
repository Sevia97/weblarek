import { FormView } from './FormView';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class ContactFormView extends FormView<IBuyer> {
  private _email: HTMLInputElement;
  private _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    
    this._email = this.ensureElement<HTMLInputElement>('input[name="email"]');
    this._phone = this.ensureElement<HTMLInputElement>('input[name="phone"]');

    this._email.addEventListener('input', () => {
      this.handleInputChange();
    });

    this._phone.addEventListener('input', () => {
      this.handleInputChange();
    });

    // Убираем автоматическую подписку на валидацию
  }

  private handleInputChange(): void {
    // ИСПРАВЛЯЕМ: используем contacts:change вместо order:change
    this.events.emit('contacts:change', { 
      email: this._email.value,
      phone: this._phone.value
    });
  }

  getFormData(): IBuyer {
    return {
      email: this._email.value,
      phone: this._phone.value,
      payment: null,
      address: ''
    };
  }

  protected setupSubmitHandler(): void {
    this._submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:submit', this.getFormData());
    });
  }

  protected validate(): Record<string, string | undefined> {
    return {};
  }
}