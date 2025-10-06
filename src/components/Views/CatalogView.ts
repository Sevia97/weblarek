import { View } from './View';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CatalogView extends View<IProduct[]> {
  private _itemsContainer: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    
    if (container.classList.contains('gallery')) {
      this._itemsContainer = container;
    } else {
      this._itemsContainer = this.ensureElement<HTMLElement>('.gallery');
    }
  }

  clear(): void {
    this._itemsContainer.innerHTML = '';
  }

  addCard(cardElement: HTMLElement): void {
    this._itemsContainer.appendChild(cardElement);
  }
}