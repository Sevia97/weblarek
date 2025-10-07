import { View } from './View';
import { EventEmitter } from '../base/Events';

export class ModalView extends View<void> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;
  private _isOpen: boolean = false;
  protected events: EventEmitter;
  private _handleKeydown: (event: KeyboardEvent) => void;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._closeButton = this.ensureElement<HTMLButtonElement>('.modal__close');
    this._content = this.ensureElement<HTMLElement>('.modal__content');

    // Сохраняем ссылку на обработчик для removeEventListener
    this._handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this._isOpen) {
        this.close();
      }
    };

    this._closeButton.addEventListener('click', () => {
      this.close();
    });

    container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === container) {
        this.close();
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.classList.add('modal-open');
    this._isOpen = true;
    
    document.addEventListener('keydown', this._handleKeydown);
    
    this.events.emit('modal:open');
  }

  close(): void {
    if (!this._isOpen) return;
    
    this.container.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
    this._isOpen = false;
    
    document.removeEventListener('keydown', this._handleKeydown);
    
    this.events.emit('modal:close');
  }

  setContent(content: HTMLElement): void {
    this._content.innerHTML = '';
    this._content.appendChild(content);
  }

  clearContent(): void {
    this._content.innerHTML = '';
  }
}