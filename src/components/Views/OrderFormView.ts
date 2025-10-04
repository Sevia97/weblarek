import { FormView } from './FormView';
import { IBuyer, IBuyerFormErrors } from '../../types';

export class OrderFormView extends FormView<IBuyer> {
  private onSubmitCallback?: (data: IBuyer) => void;
  private _address: HTMLInputElement;
  private _paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLFormElement) {
    super(container);
    
    this._address = this.ensureElement<HTMLInputElement>('input[name="address"]');
    this._paymentButtons = container.querySelectorAll('.button_alt');

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.handlePaymentSelect(button);
      });
    });

    this._address.addEventListener('input', () => {
      this.validateForm();
    });
  }

  validate(): IBuyerFormErrors {
    const errors: IBuyerFormErrors = {};

    if (!this._address.value.trim()) {
      errors.address = 'Не указан адрес';
    }

    const selectedPayment = this.container.querySelector('.button_alt-active');
    if (!selectedPayment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    return errors;
  }

  private handlePaymentSelect(button: HTMLButtonElement): void {
    this._paymentButtons.forEach(btn => {
      btn.classList.remove('button_alt-active');
    });
    button.classList.add('button_alt-active');
    this.validateForm();
  }

  getFormData(): IBuyer {
    const selectedPayment = this.container.querySelector('.button_alt-active') as HTMLButtonElement;
    
    let payment: 'online' | 'offline' | null = null;
    if (selectedPayment) {
      const buttonName = selectedPayment.getAttribute('name');
      payment = buttonName === 'card' ? 'online' : buttonName === 'cash' ? 'offline' : null;
    }
    
    const formData = {
      payment,
      address: this._address.value,
      email: '',
      phone: ''
    };

    return formData;
  }

  onSubmit(callback: (data: IBuyer) => void): void {
    this.onSubmitCallback = callback;
  }

  protected validateForm(): void {
    const errors = this.validate();
    this.setSubmitDisabled(Object.keys(errors).length > 0);
  }

  // Переопределяем обработчик отправки формы
  protected setupSubmitHandler(): void {
    this._submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      const errors = this.validate();
      if (Object.keys(errors).length === 0) {
        const formData = this.getFormData();
        this.onSubmitCallback?.(formData);
      } else {
        this.setErrors(errors);
      }
    });
  }
}