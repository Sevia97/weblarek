import { EventEmitter, IEvents } from "../base/Events";
import { IBuyer, TPayment, IBuyerFormErrors } from "../../types/index";

// Интерфейс для модели данных покупателя
export interface IBuyerModel extends IEvents {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  clearData(): void;
  validate(): IBuyerFormErrors;
}

export class BuyerModel extends EventEmitter implements IBuyerModel {
  protected _payment: TPayment;
  protected _email: string;
  protected _phone: string;
  protected _address: string;

  constructor() {
    super();
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  // Обновляет данные покупателя (частично или полностью) и уведомляет подписчиков
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
    this.emit('buyerDataChanged', this.getData());
  }

  // Возвращает все данные покупателя
  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    };
  }

  // Сбрасывает все данные покупателя к значениям по умолчанию и уведомляет подписчиков
  clearData(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.emit('buyerDataChanged', this.getData());
  }

  // Проверяет валидность данных
  validate(): IBuyerFormErrors {
    const errors: IBuyerFormErrors = {};

    if (this._payment === null) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this._email.trim()) {
      errors.email = 'Не указан email';
    }
    if (!this._phone.trim()) {
      errors.phone = 'Не указан телефон';
    }
    if (!this._address.trim()) {
      errors.address = 'Не указан адрес';
    }

    return errors;
  }
}