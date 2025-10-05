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
  catalogView.setItems(data.items);
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
  
  updateOrderSubmitButton();
  
  modalView.setContent(orderFormView.getContent());
  modalView.open();
});

// Обработка событий заказа
events.on('order:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
  updateOrderSubmitButton();
});

events.on('order:submit', (data: IBuyer) => {
  const errors = buyerModel.validateOrder();
  if (Object.keys(errors).length > 0) {
    orderFormView.setErrors(errors);
    return;
  }

  buyerModel.setData({
    payment: data.payment,
    address: data.address
  });

  contactFormView.clearForm();
  contactFormView.clearErrors();
  const currentData = buyerModel.getData();
  
  contactFormView.setFormData({
    email: currentData.email || '',
    phone: currentData.phone || ''
  });
  
  updateContactsSubmitButton();
  
  modalView.setContent(contactFormView.getContent());
  modalView.open();
});

events.on('contacts:submit', async (data: IBuyer) => {
  const errors = buyerModel.validateContacts();
  if (Object.keys(errors).length > 0) {
    contactFormView.setErrors(errors);
    return;
  }

  buyerModel.setData({
    email: data.email,
    phone: data.phone
  });

  const completeData = buyerModel.getData();
  
  const finalErrors = buyerModel.validate();
  if (Object.keys(finalErrors).length > 0) {
    console.error('Не все данные заполнены корректно:', finalErrors);
    return;
  }

  const orderData = {
    payment: completeData.payment,
    email: completeData.email,
    phone: completeData.phone,
    address: completeData.address,
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
  const modalContainer = modalView.getContent().closest('.modal');
  if (modalContainer) {
    cartView.setModalContainer(modalContainer as HTMLElement);
  }
  
  modalView.setContent(cartView.getContent());
  modalView.open();
});

// Функции для обновления состояния кнопок
function updateOrderSubmitButton(): void {
  const data = buyerModel.getData();
  const isPaymentSelected = data.payment !== null;
  const isAddressValid = data.address && data.address.trim().length >= 5;
  const isFormValid = isPaymentSelected && isAddressValid;
  
  orderFormView.setSubmitDisabled(!isFormValid);
}

function updateContactsSubmitButton(): void {
  const data = buyerModel.getData();
  
  const isEmailValid = data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  
  const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  const cleanPhone = data.phone ? data.phone.replace(/[^\d+]/g, '') : '';
  const digitCount = cleanPhone.replace('+', '').length;
  const isPhoneValid = data.phone && phoneRegex.test(data.phone) && (digitCount === 10 || digitCount === 11);
  
  const isFormValid = isEmailValid && isPhoneValid;
  
  contactFormView.setSubmitDisabled(!isFormValid);
}

// Обработчик изменений в контактных данных
events.on('contacts:change', (data: Partial<IBuyer>) => {
  buyerModel.setData(data);
  updateContactsSubmitButton();
});

// Функции рендеринга
function renderCatalogItems(products: IProduct[]): void {
  products.forEach((product) => {
    try {
      const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
      if (!template) return;
      
      const cardElement = template.content.cloneNode(true) as DocumentFragment;
      const cardContainer = cardElement.querySelector('.gallery__item') as HTMLElement;
      
      if (cardContainer) {
        const cardView = new CatalogCardView(cardContainer, events);
        cardView.render(product);
        catalogView.addCard(cardContainer, product);
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
        cartView.addCard(cardContainer, index);
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