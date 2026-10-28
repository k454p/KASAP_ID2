// shopCalculations.ts - VERSI BARU untuk Nirwana Flora - Gapura, Sumenep
import { Product, CartItem } from './types';

export function formatRupiah(amount: number): string {
  if (!amount || amount === 0) return 'Rp0';
  return 'Rp' + amount.toLocaleString('id-ID');
}

export function calculateCartTotals(
  cart: CartItem[],
  discountPercentage: number = 0,
  shippingCost: number = 0,
  isFreeShipping: boolean = false
) {
  const selected = cart.filter((item) => item.selected);
  const selectedCount = selected.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selected.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const shippingFee = isFreeShipping ? 0 : shippingCost;
  const total = subtotal - discountAmount + shippingFee;
  return { selectedCount, subtotal, discountAmount, shippingFee, total };
}

export function validateVoucherCode(code: string) {
  const vouchers: Record<string, number> = {
    'KASAPHIJAU': 20,
    'NIRWANA10': 10,
    'GAPURA15': 15,
  };
  const upper = code.toUpperCase().trim();
  if (vouchers[upper]) {
    return { valid: true, discountPercentage: vouchers[upper] };
  }
  return { valid: false, discountPercentage: 0 };
}

export function filterProducts(
  products: Product[],
  options: { query?: string; category?: string; sortBy?: string }
) {
  let result = [...products];
  if (options.query) {
    const q = options.query.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (options.category) {
    result = result.filter((p) => p.category === options.category);
  }
  if (options.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
  if (options.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
  return result;
}

export function deductProductStock(
  products: Product[],
  orders: { productId: string; quantity: number }[]
) {
  return products.map((p) => {
    const order = orders.find((o) => o.productId === p.id);
    if (!order) return p;
    return { ...p, stock: Math.max(0, p.stock - order.quantity), soldCount: p.soldCount + order.quantity };
  });
}

export function calculateScaledDimensions(width: number, height: number, maxSize: number) {
  if (width <= maxSize && height <= maxSize) return { width, height };
  const scale = Math.min(maxSize / width, maxSize / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}