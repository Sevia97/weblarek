import { IProduct, ICartModel } from "../../types";

export class CartModel implements ICartModel {
  private _items: IProduct[] = [];
  private onCartChanged?: (items: IProduct[]) => void;

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
    this.onCartChanged?.(this._items);
  }

  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.onCartChanged?.(this._items);
  }

  clearCart(): void {
    this._items = [];
    this.onCartChanged?.(this._items);
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

  setCartChangedCallback(callback: (items: IProduct[]) => void): void {
    this.onCartChanged = callback;
  }
}