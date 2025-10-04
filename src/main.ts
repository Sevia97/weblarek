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
import { AppPresenter } from './components/Presenters/AppPresenter';
import { API_URL } from './utils/constants';

// Инициализация моделей данных
const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Инициализация сервиса API
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Инициализация представлений
const pageView = new PageView(document.body);

const galleryElement = document.querySelector('.gallery') as HTMLElement;
if (!galleryElement) {
  throw new Error('Element .gallery not found on page');
}
const catalogView = new CatalogView(galleryElement);

// Создание компонента корзины из шаблона
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = basketTemplate.content.querySelector('.basket') as HTMLElement;
const cartView = new CartView(basketContainer);

const modalView = new ModalView(
  document.querySelector('.modal') as HTMLElement
);

// Создание компонентов для модальных окон
const previewCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const previewCardContainer = previewCardTemplate.content.querySelector('.card') as HTMLElement;
const previewCardView = new PreviewCardView(previewCardContainer);

const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderFormContainer = orderFormTemplate.content.querySelector('.form') as HTMLFormElement;
const orderFormView = new OrderFormView(orderFormContainer);

const contactFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactFormContainer = contactFormTemplate.content.querySelector('.form') as HTMLFormElement;
const contactFormView = new ContactFormView(contactFormContainer);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successContainer = successTemplate.content.querySelector('.order-success') as HTMLElement;
const successView = new SuccessView(successContainer);

// Инициализация презентера
const appPresenter = new AppPresenter(
  productsModel,
  cartModel,
  buyerModel,
  apiService,
  {
    pageView,
    catalogView,
    cartView,
    modalView,
    previewCardView,
    orderFormView,
    contactFormView,
    successView
  }
);

// Запуск приложения
appPresenter.initializeApp();

// Экспорт для отладки (можно удалить в production)
export { 
  productsModel, 
  cartModel, 
  buyerModel,
  appPresenter
};