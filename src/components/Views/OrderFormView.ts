import { FormView } from './FormView';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderFormView extends FormView<IBuyer> {
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

    // Убираем автоматическую подписку на валидацию
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

  getFormData(): IBuyer {
    const selectedPayment = this.container.querySelector('.button_alt-active') as HTMLButtonElement;
    
    let payment: 'online' | 'offline' | null = null;
    if (selectedPayment) {
      const buttonName = selectedPayment.getAttribute('name');
      payment = buttonName === 'card' ? 'online' : buttonName === 'cash' ? 'offline' : null;
    }
    
    return {
      payment,
      address: this._address.value,
      email: '',
      phone: ''
    };
  }

  protected setupSubmitHandler(): void {
    this._submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('order:submit', this.getFormData());
    });
  }

  protected validate(): Record<string, string | undefined> {
    return {};
  }
}