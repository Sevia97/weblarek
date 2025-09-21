import { EventEmitter, IEvents } from "../base/Events";
import { IProduct } from "../../types/index";

// Интерфейс для модели корзины
export interface ICartModel extends IEvents {
  getItems(): IProduct[];
  addItem(item: IProduct): void;
  removeItem(id: string): void;
  clearCart(): void;
  getTotal(): number;
  getCount(): number;
  checkInCart(id: string): boolean;
}

export class CartModel extends EventEmitter implements ICartModel {
  protected _items: IProduct[];

  constructor() {
    super();
    this._items = [];
  }

  // Возвращает массив товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавляет товар в корзину и уведомляет подписчиков
  addItem(item: IProduct): void {
    this._items.push(item);
    this.emit('cartChanged', { items: this._items });
  }

  // Удаляет товар из корзины по ID и уведомляет подписчиков
  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.emit('cartChanged', { items: this._items });
  }

  // Полностью очищает корзину и уведомляет подписчиков
  clearCart(): void {
    this._items = [];
    this.emit('cartChanged', { items: this._items });
  }

  // Вычисляет общую стоимость товаров в корзине
  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  // Возвращает количество товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // Проверяет, есть ли товар с указанным ID в корзине
  checkInCart(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}