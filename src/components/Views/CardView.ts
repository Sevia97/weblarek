import { View } from './View';
import { IProduct, ICardView } from '../../types';
import { categoryMap } from '../../utils/constants';

export abstract class CardView extends View<IProduct> implements ICardView<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image: HTMLImageElement | null;
  protected _category: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    
    this._title = this.ensureElement<HTMLElement>('.card__title');
    this._price = this.ensureElement<HTMLElement>('.card__price');
    
    this._image = this.container.querySelector('.card__image');
    this._category = this.container.querySelector('.card__category');
  }

  setTitle(title: string): void {
    this.setText(this._title, title);
  }

  setPrice(price: number | null): void {
    if (price === null) {
      this.setText(this._price, 'Бесценно');
    } else {
      this.setText(this._price, `${price} синапсов`);
    }
  }

  setCardImage(src: string, alt?: string): void {
    if (this._image) {
      this.setImage(this._image, src, alt);
    }
  }

  setCategory(category: string): void {
    if (this._category) {
      this.setText(this._category, category);
      
      Object.values(categoryMap).forEach(className => {
        this._category!.classList.remove(className);
      });
      
      if (categoryMap[category]) {
        this._category!.classList.add(categoryMap[category]);
      }
    }
  }
}