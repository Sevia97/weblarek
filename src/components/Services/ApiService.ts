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
    console.log('🌐 API request to /product/');
    const response = await this.api.get('/product/');
    console.log('📡 API response:', response);
    
    // Предполагаем, что сервер возвращает объект с полем items
    const items = (response as any).items as IProduct[];
    console.log('📊 Parsed items:', items);
    return items;
  } catch (error) {
    console.error('❌ Ошибка при получении списка товаров:', error);
    throw error;
  }
}

  // Отправляет данные заказа на сервер
  async submitOrder(orderData: IOrderData): Promise<IOrderResult> {
    try {
      const response = await this.api.post('/order/', orderData);
      return response as IOrderResult;
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      throw error;
    }
  }
}




