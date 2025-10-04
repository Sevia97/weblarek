import { Component } from '../base/Component';
import { IView } from '../../types';

export abstract class View<T> extends Component<T> implements IView<T> {
  getContent(): HTMLElement {
    return this.container;
  }

  protected ensureElement<T extends HTMLElement>(selector: string): T {
    const element = this.container.querySelector(selector) as T;
    if (!element) {
      throw new Error(`Element ${selector} not found in view`);
    }
    return element;
  }

  setValid(element: HTMLElement, isValid: boolean): void {
    if (isValid) {
      element.classList.remove('form__input_error');
    } else {
      element.classList.add('form__input_error');
    }
  }

  setDisabled(element: HTMLElement, state: boolean): void {
    if (state) {
      element.setAttribute('disabled', 'true');
    } else {
      element.removeAttribute('disabled');
    }
  }

  setText(element: HTMLElement, text: string): void {
    if (element) {
      element.textContent = text;
    }
  }

  setImage(element: HTMLImageElement, src: string, alt?: string): void {
    super.setImage(element, src, alt);
  }
}