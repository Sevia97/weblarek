import { View } from './View';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartView extends View<IProduct[]> {
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _submitButton: HTMLButtonElement;
  private _emptyMessage: HTMLElement | null;
  private _modalContainer: HTMLElement | null;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._list = this.ensureElement<HTMLElement>('.basket__list');
    this._total = this.ensureElement<HTMLElement>('.basket__price');
    this._submitButton = this.ensureElement<HTMLButtonElement>('.basket__button');
    
    this._emptyMessage = this.container.querySelector('.basket__empty');
    this._modalContainer = null;

    this._submitButton.addEventListener('click', () => {
      this.events.emit('basket:submit');
    });

    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  setModalContainer(modalContainer: HTMLElement): void {
    this._modalContainer = modalContainer;
  }

  setItems(items: IProduct[]): void {
    this._list.innerHTML = '';
    
    if (items.length === 0) {
      if (this._emptyMessage) {
        this._emptyMessage.style.display = 'block';
      }
      this.setSubmitDisabled(true);
    } else {
      if (this._emptyMessage) {
        this._emptyMessage.style.display = 'none';
      }
      this.setSubmitDisabled(false);
    }

    setTimeout(() => {
      this.checkScrollNeeded();
    }, 0);
  }

  /**
   * Добавляет готовую карточку товара в корзину
   */
  addCard(cardElement: HTMLElement, index: number): void {
    const indexElement = cardElement.querySelector('.basket__item-index') as HTMLElement;
    if (indexElement) {
      indexElement.textContent = String(index + 1);
    }
    
    this._list.appendChild(cardElement);
  }

  setTotal(total: number): void {
    this.setText(this._total, `${total} синапсов`);
  }

  setSubmitDisabled(state: boolean): void {
    this.setDisabled(this._submitButton, state);
  }

  private checkScrollNeeded(): void {
    if (!this._modalContainer) return;

    const modalContent = this._modalContainer.querySelector('.modal__content') as HTMLElement;
    if (!modalContent) return;

    const windowHeight = window.innerHeight;
    const modalContentRect = modalContent.getBoundingClientRect();
    const modalBottom = modalContentRect.bottom;
    const needsScroll = modalBottom > windowHeight - 20;

    if (needsScroll) {
      this.enableModalScroll();
    } else {
      this.disableModalScroll();
    }
  }

  private enableModalScroll(): void {
    if (!this._modalContainer) return;
    
    const modalContent = this._modalContainer.querySelector('.modal__content') as HTMLElement;
    if (modalContent) {
      const maxHeight = window.innerHeight - 100;
      modalContent.style.maxHeight = `${maxHeight}px`;
      modalContent.style.overflowY = 'auto';
      modalContent.style.overflowX = 'hidden';
    }
  }

  private disableModalScroll(): void {
    if (!this._modalContainer) return;
    
    const modalContent = this._modalContainer.querySelector('.modal__content') as HTMLElement;
    if (modalContent) {
      modalContent.style.maxHeight = 'none';
      modalContent.style.overflowY = 'visible';
      modalContent.style.overflowX = 'visible';
    }
  }

  private handleResize(): void {
    if (this._modalContainer && this._modalContainer.classList.contains('modal_active')) {
      this.checkScrollNeeded();
    }
  }

  updateScroll(): void {
    this.checkScrollNeeded();
  }
}