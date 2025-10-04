import { View } from './View';

export class ModalView extends View<void> {
  private onCloseCallback?: () => void;
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;
  private _isOpen: boolean = false;

  constructor(container: HTMLElement) {
    super(container);
    
    this._closeButton = this.ensureElement<HTMLButtonElement>('.modal__close');
    this._content = this.ensureElement<HTMLElement>('.modal__content');

    this._closeButton.addEventListener('click', () => {
      this.close();
    });

    container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === container) {
        this.close();
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this._isOpen) {
        this.close();
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    this._isOpen = true;
  }

  close(): void {
    if (!this._isOpen) return;
    
    this.container.classList.remove('modal_active');
    document.body.style.overflow = 'auto';
    this._isOpen = false;
    this.onCloseCallback?.();
  }

  setContent(content: HTMLElement): void {
    this._content.innerHTML = '';
    this._content.appendChild(content);
  }

  clearContent(): void {
    this._content.innerHTML = '';
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }
}