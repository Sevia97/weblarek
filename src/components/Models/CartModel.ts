import { IProduct, ICartModel } from "../../types";
import { EventEmitter } from "../base/Events";

export class CartModel implements ICartModel {
  private _items: IProduct[] = [];
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
    this.events.emit('basket:changed', { items: this._items });
  }

  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('basket:changed', { items: this._items });
  }

  clearCart(): void {
    this._items = [];
    this.events.emit('basket:changed', { items: this._items });
  }

  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  checkInCart(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}