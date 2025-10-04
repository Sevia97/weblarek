import { ProductModel } from '../Models/ProductModel';
import { CartModel } from '../Models/CartModel';
import { BuyerModel } from '../Models/BuyerModel';
import { ApiService } from '../Services/ApiService';
import { CatalogView } from '../Views/CatalogView';
import { CartView } from '../Views/CartView';
import { ModalView } from '../Views/ModalView';
import { PreviewCardView } from '../Views/PreviewCardView';
import { OrderFormView } from '../Views/OrderFormView';
import { ContactFormView } from '../Views/ContactFormView';
import { SuccessView } from '../Views/SuccessView';
import { PageView } from '../Views/PageView';
import { IProduct, IBuyer } from '../../types';

export class AppPresenter {
  constructor(
    private productsModel: ProductModel,
    private cartModel: CartModel,
    private buyerModel: BuyerModel,
    private apiService: ApiService,
    private views: {
      pageView: PageView;
      catalogView: CatalogView;
      cartView: CartView;
      modalView: ModalView;
      previewCardView: PreviewCardView;
      orderFormView: OrderFormView;
      contactFormView: ContactFormView;
      successView: SuccessView;
    }
  ) {
    this.setupModelCallbacks();
    this.setupViewHandlers();
  }

  private setupModelCallbacks(): void {
    // Презентер подписывается на изменения моделей
    this.productsModel.setItemsChangedCallback((items: IProduct[]) => {
      this.views.catalogView.setItems(items);
    });

    this.productsModel.setSelectedItemChangedCallback((item: IProduct | null) => {
      if (item) {
        this.handleProductSelection(item);
      }
    });

    this.cartModel.setCartChangedCallback((items: IProduct[]) => {
      // CartView отвечает только за список товаров и общую сумму
      this.views.cartView.setItems(items);
      this.views.cartView.setTotal(this.cartModel.getTotal());
      this.views.cartView.setSubmitDisabled(items.length === 0);
      
      // PageView отвечает за счетчик в header
      this.views.pageView.setCartCounter(this.cartModel.getCount());
    });

    this.buyerModel.setDataChangedCallback((data: IBuyer) => {
      this.views.orderFormView.setFormData(data);
      this.views.contactFormView.setFormData(data);
    });
  }

  private setupViewHandlers(): void {
    // Презентер обрабатывает события от представлений
    this.views.catalogView.onCardSelect((product: IProduct) => {
    this.productsModel.setSelectedItem(product);
  });

    this.views.previewCardView.onBuy((productId: string) => {
      const product = this.productsModel.getItem(productId);
      if (product && product.price !== null) {
        this.cartModel.addItem(product);
        // Обновляем состояние кнопки через модель
        const isInCart = this.cartModel.checkInCart(productId);
        this.views.previewCardView.setInCart(isInCart);
      }
    });

    this.views.previewCardView.onRemove((productId: string) => {
      const product = this.productsModel.getItem(productId);
      if (product && product.price !== null) {
        this.cartModel.removeItem(productId);
        // Обновляем состояние кнопки через модель
        const isInCart = this.cartModel.checkInCart(productId);
        this.views.previewCardView.setInCart(isInCart);
      }
    });

    this.views.cartView.onItemRemove((productId: string) => {
      this.cartModel.removeItem(productId);
    });

    this.views.cartView.onCartSubmit(() => {
      this.handleCartSubmit();
    });

    this.views.orderFormView.onSubmit((data: IBuyer) => {
      this.handleOrderFormSubmit(data);
    });

    this.views.contactFormView.onSubmit(async (data: IBuyer) => {
      await this.handleContactFormSubmit(data);
    });

    this.views.modalView.onClose(() => {
      this.views.modalView.clearContent();
    });

    this.views.successView.onClose(() => {
      this.views.modalView.close();
    });

    // Обработчик клика на корзину в header
    this.views.pageView.onBasketClick(() => {
      this.handleBasketClick();
    });
  }

 private handleProductSelection(product: IProduct): void {
  this.views.previewCardView.render(product);
  
  if (product.price !== null) {
    const isInCart = this.cartModel.checkInCart(product.id);
    this.views.previewCardView.setInCart(isInCart);
  }
  
  this.views.modalView.setContent(this.views.previewCardView.getContent());
  this.views.modalView.open();
}

  private handleBasketClick(): void {
    // Открываем корзину в модальном окне
    this.views.modalView.setContent(this.views.cartView.getContent());
    this.views.modalView.open();
  }

  private handleCartSubmit(): void {
    this.views.orderFormView.clearForm();
    const currentData = this.buyerModel.getData();
    
    this.views.orderFormView.setFormData({
      address: currentData.address || '',
      payment: currentData.payment || null
    });
    
    this.views.modalView.setContent(this.views.orderFormView.getContent());
    this.views.modalView.open();
  }

  private handleOrderFormSubmit(data: IBuyer): void {
    this.buyerModel.setData({
      payment: data.payment,
      address: data.address
    });

    this.views.contactFormView.clearForm();
    const currentData = this.buyerModel.getData();
    
    this.views.contactFormView.setFormData({
      email: currentData.email || '',
      phone: currentData.phone || ''
    });
    
    this.views.modalView.setContent(this.views.contactFormView.getContent());
    this.views.modalView.open();
  }

  private async handleContactFormSubmit(data: IBuyer): Promise<void> {
    this.buyerModel.setData({
      email: data.email,
      phone: data.phone
    });

    const completeData = this.buyerModel.getData();
    
    if (!completeData.payment || !completeData.address || !completeData.email || !completeData.phone) {
      console.error('Не все данные заполнены:', completeData);
      return;
    }

    const orderData = {
      payment: completeData.payment,
      email: completeData.email,
      phone: completeData.phone,
      address: completeData.address,
      items: this.cartModel.getItems().map(item => item.id),
      total: this.cartModel.getTotal()
    };

    try {
      await this.apiService.submitOrder(orderData);
      this.cartModel.clearCart();
      this.buyerModel.clearData();
      this.views.successView.setTotal(orderData.total);
      this.views.modalView.setContent(this.views.successView.getContent());
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  }

  async initializeApp(): Promise<void> {
    try {
      const products = await this.apiService.getProductList();
      this.productsModel.setItems(products);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  }
}