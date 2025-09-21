import './scss/styles.scss'

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

// Получаем реальные товары по ID из данных
const testProduct1 = productsModel.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'); // +1 час в сутках
const testProduct2 = productsModel.getItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'); // HEX-леденец
const testProduct3 = productsModel.getItem('b06cde61-912f-4663-9751-09956c0eed67'); // Мамка-таймер

console.log('Товар с ID "854cef69-976d-4c2a-a18c-2aa45046c390":', testProduct1);
console.log('Товар с ID "c101ab44-ed99-4a54-990d-47aa2bb4e7d9":', testProduct2);
console.log('Товар с ID "b06cde61-912f-4663-9751-09956c0eed67":', testProduct3);

// Выбираем товар для детального просмотра
if (testProduct1) {
  productsModel.setSelectedItem(testProduct1);
  console.log('Выбранный товар:', productsModel.getSelectedItem());
}

console.log('\n2. ТЕСТИРОВАНИЕ CARTMODEL:');
console.log('Исходная корзина (пустая):', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость корзины:', cartModel.getTotal());

// Добавляем товары в корзину
if (testProduct1) {
  cartModel.addItem(testProduct1);
  console.log('После добавления первого товара:', cartModel.getItems());
  console.log('Количество товаров:', cartModel.getCount());
  console.log('Общая стоимость:', cartModel.getTotal());
  console.log('Товар "854cef69-976d-4c2a-a18c-2aa45046c390" в корзине?', cartModel.checkInCart('854cef69-976d-4c2a-a18c-2aa45046c390'));
  console.log('Товар "несуществующий-id" в корзине?', cartModel.checkInCart('несуществующий-id'));
}

// Добавляем еще один товар
if (testProduct2) {
  cartModel.addItem(testProduct2);
  console.log('После добавления второго товара:', cartModel.getItems());
  console.log('Количество товаров:', cartModel.getCount());
  console.log('Общая стоимость:', cartModel.getTotal());
}

// Добавляем товар с null ценой
if (testProduct3) {
  cartModel.addItem(testProduct3);
  console.log('После добавления товара с null ценой:', cartModel.getItems());
  console.log('Общая стоимость (должна игнорировать null):', cartModel.getTotal());
}

// Удаляем товар
cartModel.removeItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9');
console.log('После удаления HEX-леденца:', cartModel.getItems());
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
    // Подготавливаем тестовые данные заказа с реальными ID
    const testOrder: IOrderData = {
      payment: 'online',
      email: 'test@example.com',
      phone: '+79991234567',
      address: 'ул. Тестовая, д. 1',
      items: [
        '854cef69-976d-4c2a-a18c-2aa45046c390',
        'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'
      ],
      total: 2200 // 750 + 1450
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