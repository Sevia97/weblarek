import { View } from './View';

export class SuccessView extends View<{ total: number }> {
  private onCloseCallback?: () => void;
  private _total: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this._total = this.ensureElement<HTMLElement>('.order-success__description');
    this._button = this.ensureElement<HTMLButtonElement>('.order-success__close');

    this._button.addEventListener('click', () => {
      this.onCloseCallback?.();
    });
  }

  setTotal(total: number): void {
    this.setText(this._total, `Списано ${total} синапсов`);
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }
}