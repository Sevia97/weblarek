import './scss/styles.scss'

// Файл: /src/main.ts
import { Api } from './components/base/Api';
import { ApiService } from './components/Services/ApiService';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { IOrderData } from './types';

// Создаем экземпляр базового API
const api = new Api(API_URL);

// Создаем сервис для работы с API
const apiService = new ApiService(api);

// Создаем экземпляры моделей
const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===\n');

// Тестирование ProductModel
console.log('1. ТЕСТИРОВАНИЕ PRODUCTMODEL:');
console.log('Исходный массив товаров (пустой):', productsModel.getItems());

// Сохраняем товары из тестовых данных
productsModel.setItems(apiProducts.items);
console.log('После setItems():', productsModel.getItems());

// Получаем товар по ID
const testProduct = productsModel.getItem('002');
console.log('Товар с ID "002":', testProduct);

// Выбираем товар для детального просмотра
if (testProduct) {
  productsModel.setSelectedItem(testProduct);
  console.log('Выбранный товар:', productsModel.getSelectedItem());
}

console.log('\n2. ТЕСТИРОВАНИЕ CARTMODEL:');
console.log('Исходная корзина (пустая):', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость корзины:', cartModel.getTotal());

// Добавляем товары в корзину
if (testProduct) {
  cartModel.addItem(testProduct);
  console.log('После добавления товара:', cartModel.getItems());
  console.log('Количество товаров:', cartModel.getCount());
  console.log('Общая стоимость:', cartModel.getTotal());
  console.log('Товар "002" в корзине?', cartModel.checkInCart('002'));
  console.log('Товар "999" в корзине?', cartModel.checkInCart('999'));
}

// Добавляем еще один товар
const anotherProduct = productsModel.getItem('004');
if (anotherProduct) {
  cartModel.addItem(anotherProduct);
  console.log('После добавления второго товара:', cartModel.getItems());
  console.log('Общая стоимость:', cartModel.getTotal());
}

// Удаляем товар
cartModel.removeItem('002');
console.log('После удаления товара "002":', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotal());

// Очищаем корзину
cartModel.clearCart();
console.log('После очистки корзины:', cartModel.getItems());

console.log('\n3. ТЕСТИРОВАНИЕ BUYERMODEL:');
console.log('Исходные данные покупателя:', buyerModel.getData());

// Тестирование частичного сохранения данных
buyerModel.setData({ email: 'test@example.com' });
console.log('Только email установлен:', buyerModel.getData());

buyerModel.setData({ phone: '+79991234567' });
console.log('Добавлен телефон:', buyerModel.getData());

buyerModel.setData({ payment: 'online' });
console.log('Добавлен способ оплаты:', buyerModel.getData());

buyerModel.setData({ address: 'ул. Программистов, д. 42' });
console.log('Все данные установлены:', buyerModel.getData());

// Проверяем валидацию полных данных
const validationResult = buyerModel.validate();
console.log('Валидация полных данных:', validationResult);
console.log('Все поля валидны?', Object.keys(validationResult).length === 0);

// Тестирование с невалидными данными
buyerModel.setData({
  payment: null,
  email: '',
  address: ''
});
console.log('Невалидные данные:', buyerModel.getData());

const invalidValidation = buyerModel.validate();
console.log('Валидация невалидных данных:', invalidValidation);
console.log('Ошибка payment:', invalidValidation.payment || 'нет ошибки');
console.log('Ошибка email:', invalidValidation.email || 'нет ошибки');
console.log('Ошибка address:', invalidValidation.address || 'нет ошибки');
console.log('Ошибка phone:', invalidValidation.phone || 'нет ошибки');

// Очищаем данные
buyerModel.clearData();
console.log('После очистки данных:', buyerModel.getData());

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');

console.log('\n=== ТЕСТИРОВАНИЕ РАБОТЫ С СЕРВЕРОМ ===');

// Тестирование получения данных с сервера
async function testServerConnection() {
  try {
    console.log('Запрашиваем данные с сервера...');
    
    // Получаем товары с сервера
    const serverProducts = await apiService.getProductList();
    console.log('Получено с сервера:', serverProducts);

    // Сохраняем в модель
    productsModel.setItems(serverProducts);
    console.log('Сохранено в модель:', productsModel.getItems());

    // Проверяем работу методов модели с реальными данными
    const firstProduct = productsModel.getItems()[0];
    if (firstProduct) {
      console.log('Первый товар из каталога:', firstProduct.title);
      console.log('Цена:', firstProduct.price);
    }

  } catch (error) {
    console.error('Ошибка при работе с сервером:', error);
    
    // Fallback: используем тестовые данные если сервер недоступен
    console.log('Используем тестовые данные...');
    productsModel.setItems(apiProducts.items);
    console.log('Тестовые данные сохранены в модель');
  }
}

// Тестирование отправки заказа (для демонстрации)
async function testOrderSubmission() {
  try {
    // Подготавливаем тестовые данные заказа
    const testOrder: IOrderData = {
      payment: 'online',
      email: 'test@example.com',
      phone: '+79991234567',
      address: 'ул. Тестовая, д. 1',
      items: ['001', '002'],
      total: 2700
    };

    console.log('Отправляем тестовый заказ:', testOrder);
    
    console.log('Запрос отправки заказа отключен для демонстрации');

  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
}

// Запускаем тесты
testServerConnection().then(() => {
  testOrderSubmission();
});