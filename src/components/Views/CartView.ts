// components/views/CartView.ts
import { View } from './View';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartView extends View<IProduct[]> {
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _submitButton: HTMLButtonElement;
  private _emptyMessage: HTMLElement | null;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._list = this.ensureElement<HTMLElement>('.basket__list');
    this._total = this.ensureElement<HTMLElement>('.basket__price');
    this._submitButton = this.ensureElement<HTMLButtonElement>('.basket__button');
    
    this._emptyMessage = this.container.querySelector('.basket__empty');

    this._submitButton.addEventListener('click', () => {
      this.events.emit('basket:submit');
    });
  }

  setItems(items: IProduct[]): void {
    this._list.innerHTML = '';
    
    
    if (items.length === 0) {
      if (this._emptyMessage) {
        this._emptyMessage.style.display = 'block';
      }
      this.setSubmitDisabled(true);
    } else {
      if (this._emptyMessage) {
        this._emptyMessage.style.display = 'none';
      }
      this.setSubmitDisabled(false);
    }
    
   
  }

  addCard(cardElement: HTMLElement): void {
    this._list.appendChild(cardElement);
  }

  setTotal(total: number): void {
    this.setText(this._total, `${total} синапсов`);
  }

  setSubmitDisabled(state: boolean): void {
    this.setDisabled(this._submitButton, state);
  }
}