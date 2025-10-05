import { IProduct, IProductModel } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductModel implements IProductModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setItems(data: IProduct[]): void {
    this._items = data;
    this.events.emit('items:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | null {
    return this._items.find(item => item.id === id) || null;
  }

  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit('item:selected', { item: this._selectedItem });
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}