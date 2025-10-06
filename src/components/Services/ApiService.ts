import { IApi, IProduct, IOrderData, IOrderResult } from '../../types';

export interface IApiService {
  getProductList(): Promise<IProduct[]>;
  submitOrder(orderData: IOrderData): Promise<IOrderResult>;
}

export class ApiService implements IApiService {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получает список товаров с сервера
  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get('/product/');
      
      // Предполагаем, что сервер возвращает объект с полем items
      const items = (response as any).items as IProduct[];
      return items;
    } catch (error) {
      throw error;
    }
  }

  // Отправляет данные заказа на сервер
  async submitOrder(orderData: IOrderData): Promise<IOrderResult> {
    try {
      const response = await this.api.post('/order/', orderData);
      return response as IOrderResult;
    } catch (error) {
      throw error;
    }
  }
}



