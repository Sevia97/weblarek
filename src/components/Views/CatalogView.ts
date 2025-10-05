import { View } from './View';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CatalogView extends View<IProduct[]> {
  private _itemsContainer: HTMLElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    if (container.classList.contains('gallery')) {
      this._itemsContainer = container;
    } else {
      this._itemsContainer = this.ensureElement<HTMLElement>('.gallery');
    }
  }

  setItems(products: IProduct[]): void {
    this._itemsContainer.innerHTML = '';
  }

  addCard(cardElement: HTMLElement, product: IProduct): void {
    cardElement.addEventListener('click', () => {
      this.events.emit('card:select', { product });
    });
    
    this._itemsContainer.appendChild(cardElement);
  }

  clear(): void {
    this._itemsContainer.innerHTML = '';
  }
}