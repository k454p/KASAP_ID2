import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  calculateCartTotals,
  validateVoucherCode,
  filterProducts,
  deductProductStock,
  calculateScaledDimensions,
} from './shopCalculations';
import { Product, CartItem } from '../types';

test('formatRupiah formats Indonesian currency correctly', () => {
  assert.equal(formatRupiah(0), 'Rp0');
  assert.equal(formatRupiah(103000), 'Rp103.000');
  assert.equal(formatRupiah(1770000), 'Rp1.770.000');
});

test('calculateCartTotals calculates subtotals with selected items and discounts', () => {
  const dummyProduct: Product = {
    id: 'p1',
    name: 'Deli Tools Staples',
    price: 100000,
    rating: 4.8,
    soldCount: 50,
    stock: 20,
    images: ['test.jpg'],
    category: 'Perkakas',
    shopName: 'Deli Store',
    location: 'Surabaya',
    description: 'Bagus',
    createdAt: new Date().toISOString(),
  };

  const dummyCart: CartItem[] = [
    {
      id: 'c1',
      productId: 'p1',
      quantity: 2,
      selected: true,
      product: dummyProduct,
    },
    {
      id: 'c2',
      productId: 'p1',
      quantity: 1,
      selected: false,
      product: dummyProduct,
    },
  ];

  // 2 items selected @ 100,000 = 200,000 subtotal
  // 20% discount = 40,000 discount
  // Free shipping = 0
  // Total = 160,000
  const totals = calculateCartTotals(dummyCart, 20, 15000, true);
  assert.equal(totals.selectedCount, 2);
  assert.equal(totals.subtotal, 200000);
  assert.equal(totals.discountAmount, 40000);
  assert.equal(totals.shippingFee, 0);
  assert.equal(totals.total, 160000);
});

test('validateVoucherCode handles valid and invalid codes', () => {
  const valid = validateVoucherCode('KASAPHIJAU');
  assert.equal(valid.valid, true);
  assert.equal(valid.discountPercentage, 20);

  const invalid = validateVoucherCode('SALAHKODE');
  assert.equal(invalid.valid, false);
  assert.equal(invalid.discountPercentage, 0);
});

test('filterProducts filters by query, category, and sorts by price', () => {
  const list: Product[] = [
    {
      id: '1',
      name: 'Obeng Set 16 in 1',
      price: 25000,
      rating: 4.9,
      soldCount: 200,
      stock: 10,
      images: [],
      category: 'Perkakas',
      shopName: 'Rosplay',
      location: 'Jakarta',
      description: 'Obeng komplit',
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      name: 'Kardus Besar Pindahan',
      price: 6000,
      rating: 4.7,
      soldCount: 500,
      stock: 50,
      images: [],
      category: 'Packaging',
      shopName: 'Bungkuspack',
      location: 'Bandung',
      description: 'Kardus tebal',
      createdAt: '2026-02-01',
    },
  ];

  const searchObeng = filterProducts(list, { query: 'obeng' });
  assert.equal(searchObeng.length, 1);
  assert.equal(searchObeng[0].name, 'Obeng Set 16 in 1');

  const categoryFilter = filterProducts(list, { category: 'Packaging' });
  assert.equal(categoryFilter.length, 1);
  assert.equal(categoryFilter[0].id, '2');

  const sortedAsc = filterProducts(list, { sortBy: 'price_asc' });
  assert.equal(sortedAsc[0].price, 6000);
});

test('deductProductStock decrements stock and increments sold count', () => {
  const products: Product[] = [
    {
      id: 'p1',
      name: 'Item 1',
      price: 10000,
      rating: 5,
      soldCount: 10,
      stock: 5,
      images: [],
      category: 'Umum',
      shopName: 'Toko',
      location: 'Jakarta',
      description: 'Desc',
      createdAt: '2026-01-01',
    },
  ];

  const updated = deductProductStock(products, [{ productId: 'p1', quantity: 2 }]);
  assert.equal(updated[0].stock, 3);
  assert.equal(updated[0].soldCount, 12);
});

test('calculateScaledDimensions scales image dimensions properly', () => {
  // Landscape high-res phone camera: 4000x3000 -> 400x300
  const landscape = calculateScaledDimensions(4000, 3000, 400);
  assert.equal(landscape.width, 400);
  assert.equal(landscape.height, 300);

  // Portrait phone camera: 3000x4000 -> 300x400
  const portrait = calculateScaledDimensions(3000, 4000, 400);
  assert.equal(portrait.width, 300);
  assert.equal(portrait.height, 400);

  // Small square: 200x200 -> unchanged 200x200
  const small = calculateScaledDimensions(200, 200, 400);
  assert.equal(small.width, 200);
  assert.equal(small.height, 200);
});
