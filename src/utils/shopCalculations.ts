import { CartItem, Product } from '../types';

// Konstanta Toko - Nirwana Flora
export const SHOP_INFO = {
  name: 'Nirwana Flora',
  location: 'Gapura, Sumenep, Jawa Timur',
  address: 'Jl. Raya Gapura, Sumenep, Jawa Timur 69472',
  freeShippingMin: 50000,
  defaultShippingCost: 15000,
} as const;

/**
 * Format a numeric amount to Indonesian Rupiah (e.g. Rp75.000)
 * Fix: nominal 0 tidak lagi muncul kalau harga belum ke-load dari Supabase
 */
export function formatRupiah(amount: number): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp0';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${formatted}`;
}

/**
 * Calculate cart subtotals and totals based on selected items
 * Fix: shipping gratis kalau subtotal >= 50000 (Gapura) atau voucher free ongkir
 */
export function calculateCartTotals(
  items: CartItem[],
  voucherDiscountPercentage: number = 0,
  shippingCost: number = SHOP_INFO.defaultShippingCost,
  freeShippingApplied: boolean = false
) {
  const selectedItems = items.filter((item) => item.selected);
  const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = selectedItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  // Gratis ongkir kalau sudah ada flag ATAU subtotal >= 50rb
  const effectiveShipping = freeShippingApplied || subtotal >= SHOP_INFO.freeShippingMin ? 0 : shippingCost;

  const discountAmount = Math.min(
    subtotal,
    Math.round((subtotal * voucherDiscountPercentage) / 100)
  );

  const total = Math.max(0, subtotal - discountAmount + effectiveShipping);

  return {
    selectedCount,
    subtotal,
    discountAmount,
    shippingFee: effectiveShipping,
    total,
  };
}

/**
 * Apply voucher code validation - Voucher khusus Nirwana Flora
 */
export function validateVoucherCode(code: string): { valid: boolean; discountPercentage: number; message: string } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discountPercentage: 0, message: 'Masukkan kode voucher' };
  }

  const vouchers: Record<string, { percent: number; desc: string }> = {
    'KASAPHIJAU': { percent: 20, desc: 'Diskon 20% Spesial KASAP Hijau' },
    'NIRWANA10': { percent: 10, desc: 'Diskon 10% Nirwana Flora' },
    'GAPURA15': { percent: 15, desc: 'Diskon 15% Khusus Gapura' },
    'ONGKIRNOL': { percent: 10, desc: 'Diskon 10% + Bebas Ongkir' },
    'HEMAT50': { percent: 50, desc: 'Diskon 50% Flash Deal' },
  };

  if (vouchers[normalized]) {
    return {
      valid: true,
      discountPercentage: vouchers[normalized].percent,
      message: vouchers[normalized].desc,
    };
  }

  return {
    valid: false,
    discountPercentage: 0,
    message: 'Kode voucher tidak valid atau sudah kadaluarsa',
  };
}

/**
 * Filter and sort products - alamat sudah disamakan ke Gapura
 */
export function filterProducts(
  products: Product[],
  options: {
    query?: string;
    category?: string;
    onlyMyProducts?: boolean;
    minRating?: number;
    sortBy?: 'popular' | 'latest' | 'price_asc' | 'price_desc';
  }
): Product[] {
  const { query = '', category = 'Semua', onlyMyProducts = false, minRating = 0, sortBy = 'popular' } = options;
  const q = query.trim().toLowerCase();

  let result = products.filter((p) => {
    if (onlyMyProducts && !p.isUserUploaded) return false;
    if (category && category !== 'Semua' && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    if (q) {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchShop = p.shopName.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      // Lokasi Gapura juga bisa dicari
      const matchLocation = p.location.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchShop && !matchCategory && !matchLocation) return false;
    }
    return true;
  });

  if (sortBy === 'latest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else {
    result.sort((a, b) => b.soldCount - a.soldCount);
  }

  return result;
}

/**
 * Deduct stock safely when purchasing items
 */
export function deductProductStock(
  products: Product[],
  purchasedItems: { productId: string; quantity: number }[]
): Product[] {
  const quantityMap = new Map<string, number>();
  for (const item of purchasedItems) {
    quantityMap.set(item.productId, (quantityMap.get(item.productId) || 0) + item.quantity);
  }

  return products.map((prod) => {
    const qty = quantityMap.get(prod.id);
    if (!qty) return prod;
    const newStock = Math.max(0, prod.stock - qty);
    const newSold = prod.soldCount + qty;
    return {
      ...prod,
      stock: newStock,
      soldCount: newSold,
    };
  });
}

/**
 * Calculate scaled dimensions fitting within maxDimension preserving aspect ratio
 */
export function calculateScaledDimensions(
  width: number,
  height: number,
  maxDimension: number = 400
): { width: number; height: number } {
  if (width <= 0 || height <= 0) {
    return { width: maxDimension, height: maxDimension };
  }
  if (width <= maxDimension && height <= maxDimension) {
    return { width: Math.round(width), height: Math.round(height) };
  }
  if (width > height) {
    const scale = maxDimension / width;
    return {
      width: maxDimension,
      height: Math.max(1, Math.round(height * scale)),
    };
  } else {
    const scale = maxDimension / height;
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: maxDimension,
    };
  }
}

/**
 * Helper: normalisasi produk dari Supabase ke tipe Product di app
 * Dipakai biar alamat & harga dari Supabase yang kosong tidak jadi Rp0 / alamat ngaco
 */
export function normalizeProductFromSupabase(row: any): Product {
  return {
    id: String(row.id),
    name: row.title || 'Produk Tanpa Nama',
    price: row.price ?? 0,
    rating: 4.9,
    soldCount: 0,
    stock: row.stock ?? 0,
    images: row.image_url ? [row.image_url] : [],
    category: row.category || 'Bunga',
    shopName: SHOP_INFO.name,
    location: SHOP_INFO.location,
    description: row.description || 'Produk dari Nirwana Flora Gapura',
    createdAt: row.created_at || new Date().toISOString(),
    isUserUploaded: true,
  };
}