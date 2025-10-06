import { CardView } from './CardView';
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/Events';

export class CatalogCardView extends CardView {
  protected events: EventEmitter;
  private _currentProduct: IProduct | null = null;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    // Добавляем обработчик клика на всю карточку
    container.addEventListener('click', () => {
      this.handleCardClick();
    });
  }

  render(data: IProduct): HTMLElement {
    this._currentProduct = data;
    this.setTitle(data.title);
    this.setPrice(data.price);
    
    const imageUrl = data.image.startsWith('http') ? data.image : `${CDN_URL}/${data.image}`;
    this.setCardImage(imageUrl, data.title);
    this.setCategory(data.category);
    
    return this.container;
  }

  private handleCardClick(): void {
    if (this._currentProduct) {
      this.events.emit('card:select', { product: this._currentProduct });
    }
  }
}