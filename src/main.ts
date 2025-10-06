// main.ts
import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ApiService } from './components/Services/ApiService';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { CatalogView } from './components/Views/CatalogView';
import { CartView } from './components/Views/CartView';
import { ModalView } from './components/Views/ModalView';
import { PreviewCardView } from './components/Views/PreviewCardView';
import { OrderFormView } from './components/Views/OrderFormView';
import { ContactFormView } from './components/Views/ContactFormView';
import { SuccessView } from './components/Views/SuccessView';
import { PageView } from './components/Views/PageView';
import { CatalogCardView } from './components/Views/CatalogCardView';
import { CartCardView } from './components/Views/CartCardView';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { IProduct, IBuyer } from './types';

// Создаем глобальный EventEmitter
const events = new EventEmitter();

// Инициализация моделей данных с EventEmitter
const productsModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Инициализация сервиса API
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Инициализация представлений с EventEmitter
const pageView = new PageView(document.body, events);

const galleryElement = ensureElement<HTMLElement>('.gallery');
const catalogView = new CatalogView(galleryElement, events);

// Создание компонента корзины
const basketElement = cloneTemplate<HTMLElement>('#basket');
const cartView = new CartView(basketElement, events);

const modalElement = ensureElement<HTMLElement>('.modal');
const modalView = new ModalView(modalElement, events);

// Создание компонентов для модальных окон
const previewCardElement = cloneTemplate<HTMLElement>('#card-preview');
const previewCardView = new PreviewCardView(previewCardElement, events);

const orderFormElement = cloneTemplate<HTMLFormElement>('#order');
const orderFormView = new OrderFormView(orderFormElement, events);

const contactFormElement = cloneTemplate<HTMLFormElement>('#contacts');
const contactFormView = new ContactFormView(contactFormElement, events);

const successElement = cloneTemplate<HTMLElement>('#success');
const successView = new SuccessView(successElement, events);

// Обработчики событий

// Загрузка товаров
async function initializeApp(): Promise<void> {
  try {
    const products = await apiService.getProductList();
    productsModel.setItems(products);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}

// Обработка событий каталога
events.on('items:changed', (data: { items: IProduct[] }) => {
  renderCatalogItems(data.items);
});

events.on('card:select', (data: { product: IProduct }) => {
  productsModel.setSelectedItem(data.product);
});

events.on('item:selected', (data: { item: IProduct }) => {
  previewCardView.render(data.item);
  
  if (data.item.price !== null) {
    const isInCart = cartModel.checkInCart(data.item.id);
    previewCardView.setInCart(isInCart);
  }
  
  modalView.setContent(previewCardView.getContent());
  modalView.open();
});

// Обработка событий корзины
events.on('basket:changed', (data: { items: IProduct[] }) => {
  cartView.setItems(data.items);
  renderCartItems(data.items);
  cartView.setTotal(cartModel.getTotal());
  cartView.setSubmitDisabled(data.items.length === 0);
  pageView.setCartCounter(cartModel.getCount());
  
  // Обновляем состояние кнопки в preview, если открыто модальное окно
  const selectedItem = productsModel.getSelectedItem();
  if (selectedItem) {
    const isInCart = cartModel.checkInCart(selectedItem.id);
    previewCardView.setInCart(isInCart);
  }
});

events.on('card:action', (data: { productId: string; action: string }) => {
  const product = productsModel.getItem(data.productId);
  if (product && product.price !== null) {
    if (data.action === 'add') {
      cartModel.addItem(product);
    } else {
      cartModel.removeItem(data.productId);
    }
  }
});

events.on('basket:submit', () => {
  orderFormView.clearForm();
  orderFormView.clearErrors();
  const currentData = buyerModel.getData();
  
  orderFormView.setFormData({
    address: currentData.address || '',
    payment: currentData.payment || null
  });
  
  modalView.setContent(orderFormView.getContent());
  modalView.open();
});

// Обработка событий заказа
events.on('order:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
  // Валидация выполняется автоматически в BuyerModel.setData()
});

events.on('order:submit', () => {
  // Валидация уже выполнена в модели, кнопка заблокирована при ошибках
  contactFormView.clearForm();
  contactFormView.clearErrors();
  const currentData = buyerModel.getData();
  
  contactFormView.setFormData({
    email: currentData.email || '',
    phone: currentData.phone || ''
  });
  
  modalView.setContent(contactFormView.getContent());
  modalView.open();
});

events.on('contacts:submit', async () => {
  // Валидация уже выполнена в модели, кнопка заблокирована при ошибках
  
  // Финальная проверка всех данных
  const finalErrors = buyerModel.validate();
  if (Object.keys(finalErrors).length > 0) {
    console.error('Не все данные заполнены корректно:', finalErrors);
    return;
  }

  const currentData = buyerModel.getData();
  const orderData = {
    payment: currentData.payment,
    email: currentData.email,
    phone: currentData.phone,
    address: currentData.address,
    items: cartModel.getItems().map(item => item.id),
    total: cartModel.getTotal()
  };

  try {
    await apiService.submitOrder(orderData);
    cartModel.clearCart();
    buyerModel.clearData();
    successView.setTotal(orderData.total);
    modalView.setContent(successView.getContent());
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);
  }
});

// Обработка событий модальных окон
events.on('modal:close', () => {
  modalView.clearContent();
});

events.on('success:close', () => {
  modalView.close();
});

events.on('basket:click', () => {
  modalView.setContent(cartView.getContent());
  modalView.open();
});

// Обработчик изменений в контактных данных
events.on('contacts:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
});

// Обработчики валидации из модели
events.on('order:validate', (errors: any) => {
  orderFormView.setErrors(errors);
  // Блокируем кнопку, если есть ошибки
  const hasErrors = Object.keys(errors).length > 0;
  orderFormView.setSubmitDisabled(hasErrors);
});

events.on('contacts:validate', (errors: any) => {
  contactFormView.setErrors(errors);
  // Блокируем кнопку, если есть ошибки
  const hasErrors = Object.keys(errors).length > 0;
  contactFormView.setSubmitDisabled(hasErrors);
});

// Функции рендеринга
function renderCatalogItems(products: IProduct[]): void {
  catalogView.clear();
  
  products.forEach((product) => {
    try {
      const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
      if (!template) return;
      
      const cardElement = template.content.cloneNode(true) as DocumentFragment;
      const cardContainer = cardElement.querySelector('.gallery__item') as HTMLElement;
      
      if (cardContainer) {
        const cardView = new CatalogCardView(cardContainer, events);
        cardView.render(product);
        catalogView.addCard(cardContainer);
      }
    } catch (error) {
      console.error('Error rendering catalog card:', error, product);
    }
  });
}

function renderCartItems(products: IProduct[]): void {
  products.forEach((product, index) => {
    try {
      const template = document.querySelector('#card-basket') as HTMLTemplateElement;
      if (!template) return;
      
      const cardElement = template.content.cloneNode(true) as DocumentFragment;
      const cardContainer = cardElement.querySelector('.basket__item') as HTMLElement;
      
      if (cardContainer) {
        const cardView = new CartCardView(cardContainer, events);
        cardView.render(product);
        cardView.setIndex(index);
        cartView.addCard(cardContainer);
      }
    } catch (error) {
      console.error('Error rendering cart card:', error, product);
    }
  });
}

// Запуск приложения
initializeApp();

// Экспорт для отладки
export { 
  productsModel, 
  cartModel, 
  buyerModel,
  events
};