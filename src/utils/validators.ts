export class Validators {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
  }

  static validateAddress(address: string): boolean {
    return address.trim().length >= 5;
  }

  static validatePayment(payment: string | null): boolean {
    return payment === 'online' || payment === 'offline';
  }
}