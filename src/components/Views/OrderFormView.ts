import { FormView } from './FormView';
import { EventEmitter } from '../base/Events';

export class OrderFormView extends FormView {
  private _address: HTMLInputElement;
  private _paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    
    this._address = this.ensureElement<HTMLInputElement>('input[name="address"]');
    this._paymentButtons = container.querySelectorAll('.button_alt');

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.handlePaymentSelect(button);
      });
    });

    this._address.addEventListener('input', () => {
      this.handleInputChange();
    });
  }

  private handlePaymentSelect(button: HTMLButtonElement): void {
    this._paymentButtons.forEach(btn => {
      btn.classList.remove('button_alt-active');
    });
    button.classList.add('button_alt-active');
    
    this.events.emit('order:change', { 
      payment: button.getAttribute('name') === 'card' ? 'online' : 'offline' 
    });
  }

  private handleInputChange(): void {
    this.events.emit('order:change', { address: this._address.value });
  }

  protected setupSubmitHandler(): void {
    this._submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }
}