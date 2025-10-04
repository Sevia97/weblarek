import { View } from './View';
import { IProduct } from '../../types';
import { CatalogCardView } from './CatalogCardView';

export class CatalogView extends View<IProduct[]> {
  private onCardSelectCallback?: (product: IProduct) => void;
  private _itemsContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    if (container.classList.contains('gallery')) {
      this._itemsContainer = container;
    } else {
      this._itemsContainer = container.querySelector('.gallery') as HTMLElement;
    }
    
    if (!this._itemsContainer) {
      throw new Error('Items container not found for CatalogView');
    }
  }

  setItems(products: IProduct[]): void {
    this._itemsContainer.innerHTML = '';
    
    products.forEach(product => {
      const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
      if (!cardTemplate) return;
      
      const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
      const cardContainer = cardElement.querySelector('.card') as HTMLElement;
      
      if (!cardContainer) return;
      
      const cardView = new CatalogCardView(cardContainer);
      cardView.render(product);
      
      cardContainer.addEventListener('click', () => {
        this.handleCardClick(product);
      });
      
      this._itemsContainer.appendChild(cardElement);
    });
  }

  clear(): void {
    this._itemsContainer.innerHTML = '';
  }

  onCardSelect(callback: (product: IProduct) => void): void {
    this.onCardSelectCallback = callback;
  }

  private handleCardClick(product: IProduct): void {
    this.onCardSelectCallback?.(product);
  }
}