import { View } from './View';
import { EventEmitter } from '../base/Events';

export class ModalView extends View<void> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;
  private _isOpen: boolean = false;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
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

    window.addEventListener('resize', () => {
      if (this._isOpen) {
        this.handleResize();
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    this._isOpen = true;
    
    this._content.style.overflowY = 'visible';
    this._content.style.maxHeight = 'none';
    
    setTimeout(() => {
      this.events.emit('modal:open');
    }, 10);
  }

  close(): void {
    if (!this._isOpen) return;
    
    this.container.classList.remove('modal_active');
    document.body.style.overflow = 'auto';
    this._isOpen = false;
    
    this._content.style.overflowY = 'visible';
    this._content.style.maxHeight = 'none';
    
    this.events.emit('modal:close');
  }

  setContent(content: HTMLElement): void {
    this._content.innerHTML = '';
    this._content.appendChild(content);
  }

  clearContent(): void {
    this._content.innerHTML = '';
    this._content.style.overflowY = 'visible';
    this._content.style.maxHeight = 'none';
  }

  private handleResize(): void {
    setTimeout(() => {
      this.events.emit('modal:resize');
    }, 100);
  }
}