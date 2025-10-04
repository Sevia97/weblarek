import { CardView } from './CardView';
import { IProduct } from '../../types';

export class CatalogCardView extends CardView {
  private product: IProduct | null = null;

  constructor(container: HTMLElement) {
    super(container);
  }

  render(data: IProduct): HTMLElement {
    this.product = data;
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setCardImage(data.image, data.title);
    this.setCategory(data.category);
    
    return this.container;
  }

  protected handleButtonClick(): void {
    // Пустая реализация, так как кнопки нет
  }
}