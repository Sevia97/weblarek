import { EventEmitter, IEvents } from "../base/Events";
import { IProduct } from "../../types/index";

// Интерфейс для модели товаров, расширяет IEvents для возможности генерации событий
export interface IProductModel extends IEvents {
  setItems(data: IProduct[]): void;
  getItems(): IProduct[];
  getItem(id: string): IProduct | null;
  setSelectedItem(item: IProduct): void;
  getSelectedItem(): IProduct | null;
}

export class ProductModel extends EventEmitter implements IProductModel {
  protected _items: IProduct[];
  protected _selectedItem: IProduct | null;

  constructor() {
    super();
    this._items = [];
    this._selectedItem = null;
  }

  // Сохраняет массив товаров и уведомляет подписчиков
  setItems(data: IProduct[]): void {
    this._items = data;
    this.emit('itemsChanged', { items: this._items });
  }

  // Возвращает массив всех товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Находит и возвращает товар по ID
  getItem(id: string): IProduct | null {
    return this._items.find(item => item.id === id) || null;
  }

  // Сохраняет выбранный товар и уведомляет подписчиков
  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.emit('selectedItemChanged', { selectedItem: this._selectedItem });
  }

  // Возвращает данные выбранного товара
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}