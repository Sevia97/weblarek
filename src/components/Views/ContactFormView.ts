import { FormView } from './FormView';
import { IBuyer, IBuyerFormErrors } from '../../types';
import { Validators } from '../../utils/validators';

export class ContactFormView extends FormView<IBuyer> {
  private onSubmitCallback?: (data: IBuyer) => void;
  private _email: HTMLInputElement;
  private _phone: HTMLInputElement;

  constructor(container: HTMLFormElement) {
    super(container);
    
    this._email = this.ensureElement<HTMLInputElement>('input[name="email"]');
    this._phone = this.ensureElement<HTMLInputElement>('input[name="phone"]');

    this._email.addEventListener('input', () => {
      this.validateForm();
    });

    this._phone.addEventListener('input', () => {
      this.validateForm();
    });
  }

  validate(): IBuyerFormErrors {
    const errors: IBuyerFormErrors = {};

    if (!this._email.value.trim()) {
      errors.email = 'Не указан email';
    } else if (!Validators.validateEmail(this._email.value)) {
      errors.email = 'Некорректный формат email';
    }

    if (!this._phone.value.trim()) {
      errors.phone = 'Не указан телефон';
    } else if (!Validators.validatePhone(this._phone.value)) {
      errors.phone = 'Формат телефона: +7 (XXX) XXX-XX-XX';
    }

    return errors;
  }

  getFormData(): IBuyer {
    const formData = {
      email: this._email.value,
      phone: this._phone.value,
      payment: null,
      address: ''
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