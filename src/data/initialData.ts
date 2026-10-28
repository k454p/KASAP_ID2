import { Product, CartItem, OrderItem, NotificationItem, ChatConversation, UserProfile, UserAddress } from '../types';

// PRODUK - hanya produk Nirwana Floras yang dipertahankan (prod-5, prod-6)
// Produk dummy Shopee (Olymplast, Deli Tools, bungkuspack, Obeng, Batik, Telon) sudah dibuang
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-5',
    name: 'Bibit Tanaman Aglaonema Suksom Jaipong Merah Segar Nirwana Flora',
    price: 85000,
    originalPrice: 120000,
    rating: 5.0,
    soldCount: 420,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Tanaman & Flora',
    shopName: 'nirwanafloras Official',
    shopBadge: 'Star+',
    location: 'Kab. Bogor',
    description: 'Tanaman hias Aglaonema Suksom Jaipong berdaun merah merona segar dan sehat. Dikirim beserta media tanam cocopeat steril dan pot mini.',
    variants: [
      { name: 'Jumlah Daun', options: ['4-6 Daun (Remaja)', '7-10 Daun (Dewasa)'] },
    ],
    selectedVariant: '4-6 Daun (Remaja)',
    tags: ['Toko Saya', 'Gratis Ongkir Xtra', 'Best Seller Tanaman'],
    createdAt: '2026-10-01T11:00:00Z',
    isUserUploaded: true,
  },
  {
    id: 'prod-6',
    name: 'Pupuk NPK Mutiara 16-16-16 Daun dan Bunga Kualitas Premium 1 Kg',
    price: 32000,
    originalPrice: 40000,
    rating: 4.9,
    soldCount: 980,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Tanaman & Flora',
    shopName: 'nirwanafloras Official',
    shopBadge: 'Star+',
    location: 'Kab. Bogor',
    description: 'Pupuk penyubur lengkap NPK Mutiara formula seimbang 16-16-16. Mempercepat pertumbuhan tunas, menguatkan akar, dan memperbanyak bunga serta buah.',
    variants: [
      { name: 'Kemasan', options: ['1 Kg Repack', '500 Gram', '5 Kg Karung'] },
    ],
    selectedVariant: '1 Kg Repack',
    tags: ['Toko Saya', 'Star+'],
    createdAt: '2026-10-02T14:00:00Z',
    isUserUploaded: true,
  },
];

// KOSONG UNTUK UMUM - tidak ada keranjang dummy
export const INITIAL_CART: CartItem[] = [];

// KOSONG UNTUK UMUM - tidak ada pesanan dummy KASAP-20261009-0891 dll
export const INITIAL_ORDERS: OrderItem[] = [];

// KOSONG UNTUK UMUM - tidak ada notifikasi dummy
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

// KOSONG UNTUK UMUM - tidak ada chat dummy (Ksd 3, Baladraf, Neighbor Market, Toko SA)
export const INITIAL_CHATS: ChatConversation[] = [];

// KOSONG UNTUK UMUM - tidak ada alamat dummy Bogor
export const INITIAL_ADDRESSES: UserAddress[] = [];

// KOSONG UNTUK UMUM - Tamu, belum login, tidak ada email / HP hardcode
export const INITIAL_USER_PROFILE: UserProfile = {
  name: '',
  username: '',
  avatar: '',
  membershipLevel: '',
  followingCount: 0,
  followersCount: 0,
  kasapPayBalance: 0,
  koinKasap: 0,
  vouchersCount: 0,
  kasapPinjamLimit: 0,
  phone: '',
  email: '',
};