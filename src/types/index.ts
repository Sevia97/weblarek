export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    readonly baseUrl: string;
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'online' | 'offline' | null;

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IBuyerFormErrors extends Record<string, string | undefined> {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IOrderData extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string; 
  total: number;
}

// Базовые интерфейсы для компонентов
export interface IComponent<T = any> {
  render(data?: Partial<T>): HTMLElement;
}

export interface IView<T = any> extends IComponent<T> {
  getContent(): HTMLElement;
  setValid(element: HTMLElement, isValid: boolean): void;
  setDisabled(element: HTMLElement, state: boolean): void;
  setText(element: HTMLElement, text: string): void;
  setImage(element: HTMLImageElement, src: string, alt?: string): void;
}

export interface ICardView<T = any> extends IView<T> {
  setTitle(title: string): void;
  setPrice(price: number | null): void;
  setCardImage(src: string, alt?: string): void;
  setCategory(category: string): void;
  setButtonText(text: string): void; 
  setButtonDisabled(state: boolean): void;
}

export interface IFormView<T extends Record<string, any>> extends IView<T> {
  getFormData(): T;
  setFormData(data: Partial<T>): void;
  clearForm(): void;
  setErrors(errors: Record<string, string | undefined>): void;
  clearErrors(): void;
  setSubmitDisabled(state: boolean): void;
}

// Интерфейсы для конструкторов
export interface IComponentConstructor<T = any> {
  new (container: HTMLElement): IComponent<T>;
}

export interface IViewConstructor<T = any> {
  new (container: HTMLElement): IView<T>;
}

export interface ICardViewConstructor {
  new (container: HTMLElement): ICardView;
}

export interface IFormViewConstructor<T extends Record<string, any>> {
  new (container: HTMLFormElement): IFormView<T>;
}

// Интерфейсы моделей (без наследования от IEventEmitter)
export interface IProductModel {
  setItems(data: IProduct[]): void;
  getItems(): IProduct[];
  getItem(id: string): IProduct | null;
  setSelectedItem(item: IProduct): void;
  getSelectedItem(): IProduct | null;
}

export interface ICartModel {
  getItems(): IProduct[];
  addItem(item: IProduct): void;
  removeItem(id: string): void;
  clearCart(): void;
  getTotal(): number;
  getCount(): number;
  checkInCart(id: string): boolean;
}

export interface IBuyerModel {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  clearData(): void;
  validate(): IBuyerFormErrors;
}

// Интерфейсы представлений с колбэками вместо EventEmitter
export interface ICatalogView {
  setItems(products: IProduct[]): void;
  clear(): void;
  onCardSelect(callback: (product: IProduct) => void): void;
}

export interface IPreviewCardView {
  render(product: IProduct): HTMLElement;
  setInCart(isInCart: boolean): void;
  onBuy(callback: (productId: string) => void): void;
  onRemove(callback: (productId: string) => void): void;
}

export interface ICartCardView {
  render(product: IProduct): HTMLElement;
  onRemove(callback: (productId: string) => void): void;
}

export interface ICartView {
  setItems(items: IProduct[]): void;
  setTotal(total: number): void;
  setSubmitDisabled(state: boolean): void;
  onItemRemove(callback: (productId: string) => void): void;
  onCartSubmit(callback: () => void): void;
}

export interface IModalView {
  open(): void;
  close(): void;
  setContent(content: HTMLElement): void;
  clearContent(): void;
  onClose(callback: () => void): void;
}

export interface IOrderFormView {
  clearForm(): void;
  setFormData(data: Partial<IBuyer>): void;
  onSubmit(callback: (data: IBuyer) => void): void;
}

export interface IContactFormView {
  clearForm(): void;
  setFormData(data: Partial<IBuyer>): void;
  onSubmit(callback: (data: IBuyer) => void): void;
}

export interface ISuccessView {
  setTotal(total: number): void;
  onClose(callback: () => void): void;
}

export interface IPageView {
  setCartCounter(count: number): void;
}

// Интерфейсы событий (для обратной совместимости)
export interface ICartEvents {
  itemRemove: IProduct;
  cartSubmit: void;
}

export interface IProductEvents {
  cardSelect: IProduct;
  buy: IProduct;
  remove: IProduct;
}

export interface IFormEvents<T> {
  submit: T;
}

export interface IModalEvents {
  close: void;
}

export interface IModelEvents {
  itemsChanged: { items: IProduct[] };
  selectedItemChanged: { selectedItem: IProduct | null };
  cartChanged: { items: IProduct[] };
  buyerDataChanged: IBuyer;
}

// Интерфейс для EventEmitter (если где-то еще используется)
export interface IEventEmitter {
  on<T extends object>(event: string, callback: (data: T) => void): void;
  off<T extends object>(event: string, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Интерфейс для ApiService
export interface IApiService {
  getProductList(): Promise<IProduct[]>;
  submitOrder(orderData: IOrderData): Promise<IOrderResult>;
}

// Интерфейс для AppPresenter
export interface IAppPresenter {
  initializeApp(): Promise<void>;
}