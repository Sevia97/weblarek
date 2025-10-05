import { View } from './View';
import { EventEmitter } from '../base/Events';

export class SuccessView extends View<{ total: number }> {
  private _total: HTMLElement;
  private _button: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._total = this.ensureElement<HTMLElement>('.order-success__description');
    this._button = this.ensureElement<HTMLButtonElement>('.order-success__close');

    this._button.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  setTotal(total: number): void {
    this.setText(this._total, `Списано ${total} синапсов`);
  }
}