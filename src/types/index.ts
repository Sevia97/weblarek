export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
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

// Интерфейс для объекта с ошибками валидации
export interface IBuyerFormErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Данные для отправки заказа на сервер
export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
}

// Ответ сервера на успешное оформление заказа
export interface IOrderResult {
  id: string; 
  total: number;
}