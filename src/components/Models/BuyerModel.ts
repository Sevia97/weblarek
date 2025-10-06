// components/models/BuyerModel.ts
import { IBuyer, TPayment, IBuyerModel, IBuyerFormErrors } from "../../types";
import { EventEmitter } from "../base/Events";
import { Validators } from "../../utils/validators";

export class BuyerModel implements IBuyerModel {
  protected _payment: TPayment = null;
  protected _email: string = '';
  protected _phone: string = '';
  protected _address: string = '';
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    if (!data) return;
    
    let changed = false;

    if (data.payment !== undefined) {
      this._payment = data.payment;
      changed = true;
    }
    if (data.email !== undefined) {
      this._email = data.email;
      changed = true;
    }
    if (data.phone !== undefined) {
      this._phone = Validators.formatPhone(data.phone);
      changed = true;
    }
    if (data.address !== undefined) {
      this._address = data.address;
      changed = true;
    }

    if (changed) {
      //ДОБАВЛЕНО: автоматически валидируем при каждом изменении данных
      this.validateAndEmit();
    }
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    };
  }

  clearData(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  validate(): IBuyerFormErrors {
    const errors: IBuyerFormErrors = {};

    if (!Validators.validatePayment(this._payment)) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._email.trim()) {
      errors.email = 'Не указан email';
    } else if (!Validators.validateEmail(this._email)) {
      errors.email = 'Некорректный формат email';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Не указан телефон';
    } else if (!Validators.validatePhone(this._phone)) {
      errors.phone = 'Формат телефона: +7 XXX XXX-XX-XX или 8 XXX XXX-XX-XX';
    }

    if (!this._address.trim()) {
      errors.address = 'Не указан адрес';
    } else if (!Validators.validateAddress(this._address)) {
      errors.address = 'Адрес должен содержать не менее 5 символов';
    }

    return errors;
  }

  validateOrder(): IBuyerFormErrors {
    const errors: IBuyerFormErrors = {};

    if (!Validators.validatePayment(this._payment)) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._address.trim()) {
      errors.address = 'Не указан адрес';
    } else if (!Validators.validateAddress(this._address)) {
      errors.address = 'Адрес должен содержать не менее 5 символов';
    }

    return errors;
  }

  validateContacts(): IBuyerFormErrors {
    const errors: IBuyerFormErrors = {};

    if (!this._email.trim()) {
      errors.email = 'Не указан email';
    } else if (!Validators.validateEmail(this._email)) {
      errors.email = 'Некорректный формат email';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Не указан телефон';
    } else if (!Validators.validatePhone(this._phone)) {
      errors.phone = 'Формат телефона: +7 XXX XXX-XX-XX или 8 XXX XXX-XX-XX';
    }

    return errors;
  }

  private validateAndEmit(): void {
    const orderErrors = this.validateOrder();
    const contactErrors = this.validateContacts();
    
    //Эмитим события валидации для каждой формы
    this.events.emit('order:validate', orderErrors);
    this.events.emit('contacts:validate', contactErrors);
  }
}