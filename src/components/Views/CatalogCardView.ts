import { CardView } from './CardView';
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/Events';

export class CatalogCardView extends CardView {
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
  }

  render(data: IProduct): HTMLElement {
    this.setTitle(data.title);
    this.setPrice(data.price);
    
    const imageUrl = data.image.startsWith('http') ? data.image : `${CDN_URL}/${data.image}`;
    this.setCardImage(imageUrl, data.title);
    this.setCategory(data.category);
    
    return this.container;
  }

  protected handleButtonClick(): void {
    // Пустая реализация, так как кнопки нет
  }
}