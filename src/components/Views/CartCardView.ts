import { CardView } from './CardView';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartCardView extends CardView {
  protected _button: HTMLButtonElement;
  protected events: EventEmitter;
  private _currentProductId: string | null = null;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this._button = this.ensureElement<HTMLButtonElement>('.card__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        this.handleButtonClick();
      });
    }
  }

  render(data: IProduct): HTMLElement {
    this._currentProductId = data.id;
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setButtonText('Удалить');
    
    return this.container;
  }

  setButtonText(text: string): void {
    if (this._button) {
      this.setText(this._button, text);
    }
  }

  protected handleButtonClick(): void {
    if (this._currentProductId && this._button) {
      this.events.emit('card:action', { 
        productId: this._currentProductId,
        action: 'remove'
      });
    }
  }
}