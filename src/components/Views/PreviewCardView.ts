import { CardView } from './CardView';
import { IProduct } from '../../types';

export class PreviewCardView extends CardView {
  private onBuyCallback?: (productId: string) => void;
  private onRemoveCallback?: (productId: string) => void;
  private _description: HTMLElement;
  protected _button: HTMLButtonElement;
  private _currentProductId: string | null = null;

  constructor(container: HTMLElement) {
    super(container);
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
    this.setCardImage(data.image, data.title);
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

  onBuy(callback: (productId: string) => void): void {
    this.onBuyCallback = callback;
  }

  onRemove(callback: (productId: string) => void): void {
    this.onRemoveCallback = callback;
  }

  protected handleButtonClick(): void {
    if (!this._currentProductId) return;
    
    const buttonText = this._button.textContent;
    if (buttonText === 'Удалить из корзины') {
      this.onRemoveCallback?.(this._currentProductId);
    } else {
      this.onBuyCallback?.(this._currentProductId);
    }
  }
}