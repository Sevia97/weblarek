import { CardView } from './CardView';
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/Events';

export class PreviewCardView extends CardView {
  private _currentProductId: string | null = null;
  private _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    this._description = this.ensureElement<HTMLElement>('.card__text');
    this._button = this.ensureElement<HTMLButtonElement>('.card__button');

    this._button.addEventListener('click', () => {
      this.handleButtonClick();
    });
  }

  render(data: IProduct): HTMLElement {
    this._currentProductId = data.id;
    this.setTitle(data.title);
    this.setPrice(data.price);
    
    const imageUrl = data.image.startsWith('http') ? data.image : `${CDN_URL}/${data.image}`;
    this.setCardImage(imageUrl, data.title);
    this.setCategory(data.category);
    this.setDescription(data.description);
    
    if (data.price === null) {
      this.setButtonText('Недоступно');
      this.setButtonDisabled(true);
    }
    
    return this.container;
  }

  setDescription(description: string): void {
    this.setText(this._description, description);
  }

  setInCart(isInCart: boolean): void {
    if (isInCart) {
      this.setButtonText('Удалить из корзины');
      this.setButtonDisabled(false);
    } else {
      this.setButtonText('В корзину');
      this.setButtonDisabled(false);
    }
  }

  setButtonText(text: string): void {
    this.setText(this._button, text);
  }

  setButtonDisabled(state: boolean): void {
    this.setDisabled(this._button, state);
  }

  protected handleButtonClick(): void {
    if (!this._currentProductId) return;
    
    const buttonText = this._button.textContent;
    this.events.emit('card:action', { 
      productId: this._currentProductId,
      action: buttonText === 'Удалить из корзины' ? 'remove' : 'add'
    });
  }
}