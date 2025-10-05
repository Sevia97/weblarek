import { View } from './View';
import { EventEmitter } from '../base/Events';

export class PageView extends View<void> {
  private _cartCounter: HTMLElement;
  private _basketButton: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this._cartCounter = this.ensureElement<HTMLElement>('.header__basket-counter');
    this._basketButton = this.ensureElement<HTMLButtonElement>('.header__basket');

    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:click');
    });
  }

  setCartCounter(count: number): void {
    this.setText(this._cartCounter, String(count));
  }
}