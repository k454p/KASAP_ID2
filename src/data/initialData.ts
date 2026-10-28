import { Product, CartItem, OrderItem, NotificationItem, ChatConversation, UserProfile, UserAddress } from '../types';

// PRODUK - Hanya produk Nirwana Flora Gapura
// Produk dummy Shopee / Bogor sudah dibuang semua
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Buket Mawar Merah 10 Tangkai - Segar dari Gapura',
    price: 75000,
    originalPrice: 95000,
    rating: 5.0,
    soldCount: 120,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Buket Bunga',
    shopName: 'Nirwana Flora',
    shopBadge: 'Star+',
    location: 'Gapura, Sumenep, Jawa Timur',
    description: 'Buket mawar merah segar petik langsung dari Gapura, Sumenep. 10 tangkai mawar merah premium, dibungkus kertas buket cantik, cocok untuk wisuda, ulang tahun, dan hadiah spesial.',
    variants: [
      { name: 'Jumlah Tangkai', options: ['10 Tangkai', '20 Tangkai', '30 Tangkai'] },
    ],
    selectedVariant: '10 Tangkai',
    tags: ['Toko Saya', 'Gratis Ongkir Xtra', 'Best Seller'],
    createdAt: '2026-10-01T11:00:00Z',
    isUserUploaded: true,
  },
  {
    id: 'prod-2',
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
    category: 'Tanaman Hias',
    shopName: 'Nirwana Flora',
    shopBadge: 'Star+',
    location: 'Gapura, Sumenep, Jawa Timur',
    description: 'Tanaman hias Aglaonema Suksom Jaipong berdaun merah merona segar dan sehat dari Gapura. Dikirim beserta media tanam cocopeat steril dan pot mini.',
    variants: [
      { name: 'Jumlah Daun', options: ['4-6 Daun (Remaja)', '7-10 Daun (Dewasa)'] },
    ],
    selectedVariant: '4-6 Daun (Remaja)',
    tags: ['Toko Saya', 'Gratis Ongkir Xtra', 'Best Seller Tanaman'],
    createdAt: '2026-10-01T11:00:00Z',
    isUserUploaded: true,
  },
  {
    id: 'prod-3',
    name: 'Papan Bunga Duka Cita & Ucapan Selamat - Gapura',
    price: 350000,
    originalPrice: 450000,
    rating: 4.9,
    soldCount: 89,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&auto=format&fit=crop&q=80',
    ],
    category: 'Papan Bunga',
    shopName: 'Nirwana Flora',
    shopBadge: 'Star+',
    location: 'Gapura, Sumenep, Jawa Timur',
    description: 'Papan bunga ucapan duka cita, selamat, peresmian, dan pernikahan. Bunga segar, tulisan bisa custom, gratis antar area Gapura - Sumenep.',
    variants: [
      { name: 'Ukuran', options: ['Standar 1.5x2m', 'Jumbo 2x2.5m'] },
    ],
    selectedVariant: 'Standar 1.5x2m',
    tags: ['Toko Saya', 'Star+'],
    createdAt: '2026-10-02T14:00:00Z',
    isUserUploaded: true,
  },
  {
    id: 'prod-4',
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
    shopName: 'Nirwana Flora',
    shopBadge: 'Star+',
    location: 'Gapura, Sumenep, Jawa Timur',
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

// KOSONG UNTUK UMUM - tidak ada pesanan dummy
export const INITIAL_ORDERS: OrderItem[] = [];

// KOSONG UNTUK UMUM - tidak ada notifikasi dummy
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

// KOSONG UNTUK UMUM - tidak ada chat dummy
export const INITIAL_CHATS: ChatConversation[] = [];

// KOSONG UNTUK UMUM - tidak ada alamat dummy Bogor, nanti user isi sendiri
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