import { FormView } from './FormView';
import { EventEmitter } from '../base/Events';

export class ContactFormView extends FormView {
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
  }

  private handleInputChange(): void {
    this.events.emit('contacts:change', { 
      email: this._email.value,
      phone: this._phone.value
    });
  }

  protected setupSubmitHandler(): void {
    this._submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:submit');
    });
  }
}