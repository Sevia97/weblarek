import { CardView } from './CardView';
import { IProduct } from '../../types';

export class CartCardView extends CardView {
  private onRemoveCallback?: (productId: string) => void;
  protected _button: HTMLButtonElement;
  private _currentProductId: string | null = null;

  constructor(container: HTMLElement) {
    super(container);
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

  onRemove(callback: (productId: string) => void): void {
    this.onRemoveCallback = callback;
  }

  protected handleButtonClick(): void {
    if (this._currentProductId && this._button) {
      this.onRemoveCallback?.(this._currentProductId);
    }
  }
}