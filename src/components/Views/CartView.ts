import { View } from './View';
import { IProduct } from '../../types';
import { CartCardView } from './CartCardView';

export class CartView extends View<IProduct[]> {
  private onItemRemoveCallback?: (productId: string) => void;
  private onCartSubmitCallback?: () => void;
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _submitButton: HTMLButtonElement;
  private _emptyMessage: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    
    this._list = this.ensureElement<HTMLElement>('.basket__list');
    this._total = this.ensureElement<HTMLElement>('.basket__price');
    this._submitButton = this.ensureElement<HTMLButtonElement>('.basket__button');
    
    this._emptyMessage = this.container.querySelector('.basket__empty');

    this._submitButton.addEventListener('click', () => {
      this.onCartSubmitCallback?.();
    });
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
      
      items.forEach((item, index) => {
        const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        if (!cardTemplate) return;
        
        const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
        const cardContainer = cardElement.querySelector('.card') as HTMLElement;
        
        if (!cardContainer) return;
        
        const indexElement = cardContainer.querySelector('.basket__item-index') as HTMLElement;
        if (indexElement) {
          indexElement.textContent = String(index + 1);
        }
        
        const cardView = new CartCardView(cardContainer);
        cardView.render(item);
        cardView.onRemove((productId: string) => {
          this.onItemRemoveCallback?.(productId);
        });
        
        this._list.appendChild(cardElement);
      });
    }
  }

  setTotal(total: number): void {
    this.setText(this._total, `${total} синапсов`);
  }

  setSubmitDisabled(state: boolean): void {
    this.setDisabled(this._submitButton, state);
  }

  onItemRemove(callback: (productId: string) => void): void {
    this.onItemRemoveCallback = callback;
  }

  onCartSubmit(callback: () => void): void {
    this.onCartSubmitCallback = callback;
  }
}