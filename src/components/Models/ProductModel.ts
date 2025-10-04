import { IProduct, IProductModel } from "../../types";

export class ProductModel implements IProductModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  private onItemsChanged?: (items: IProduct[]) => void;
  private onSelectedItemChanged?: (item: IProduct | null) => void;

  setItems(data: IProduct[]): void {
    this._items = data;
    this.onItemsChanged?.(this._items);
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | null {
    return this._items.find(item => item.id === id) || null;
  }

  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.onSelectedItemChanged?.(this._selectedItem);
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }

  setItemsChangedCallback(callback: (items: IProduct[]) => void): void {
    this.onItemsChanged = callback;
  }

  setSelectedItemChangedCallback(callback: (item: IProduct | null) => void): void {
    this.onSelectedItemChanged = callback;
  }
}