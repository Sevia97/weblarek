import { View } from './View';

export class PageView extends View<void> {
  private _cartCounter: HTMLElement;
  private _basketButton: HTMLButtonElement;
  private onBasketClickCallback?: () => void;

  constructor(container: HTMLElement) {
    super(container);
    this._cartCounter = this.ensureElement<HTMLElement>('.header__basket-counter');
    this._basketButton = this.ensureElement<HTMLButtonElement>('.header__basket');

    this._basketButton.addEventListener('click', () => {
      this.onBasketClickCallback?.();
    });
  }

  setCartCounter(count: number): void {
    this.setText(this._cartCounter, String(count));
  }

  onBasketClick(callback: () => void): void {
    this.onBasketClickCallback = callback;
  }
}