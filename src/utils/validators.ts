export class Validators {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    // Упрощенная валидация: разрешаем +7 с 10 цифрами или 11 цифр без +
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    
    // Убираем все нецифровые символы кроме +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Проверяем что номер содержит 11 цифр (с +7) или 10 цифр (без +7)
    const digitCount = cleanPhone.replace('+', '').length;
    return phoneRegex.test(phone) && (digitCount === 10 || digitCount === 11);
  }

  static validateAddress(address: string): boolean {
    return address.trim().length >= 5;
  }

  static validatePayment(payment: string | null): boolean {
    return payment === 'online' || payment === 'offline';
  }

  // Новая функция для форматирования телефона в единый формат
  static formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('8'))) {
      return '+7' + cleanPhone.slice(1);
    }
    
    if (cleanPhone.length === 10) {
      return '+7' + cleanPhone;
    }
    
    if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
      return '+' + cleanPhone;
    }
    
    return phone;
  }
}