export type TabType = 'beranda' | 'kelola' | 'keranjang' | 'notifikasi' | 'saya';

export type ShopBadge = 'Star+' | 'Mall ORI' | 'Official' | 'Star' | 'Super';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  soldCount: number;
  stock: number;
  images: string[];
  category: string;
  shopName: string;
  shopBadge?: ShopBadge;
  location: string;
  description: string;
  variants?: ProductVariant[];
  selectedVariant?: string;
  tags?: string[];
  isUserUploaded?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  selectedVariant?: string;
  quantity: number;
  selected: boolean;
  product: Product;
}

export type OrderStatus = 'belum_bayar' | 'dikemas' | 'dikirim' | 'penilaian' | 'selesai';

export interface OrderItem {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  discount: number;
  status: OrderStatus;
  date: string;
  trackingNumber: string;
  courier: string;
  recipientName: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'status_pesanan' | 'toko' | 'promo' | 'keuangan' | 'info';
  date: string;
  isRead: boolean;
  image?: string;
  coinsReward?: number;
  targetTab?: TabType;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: 'me' | 'store';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  storeName: string;
  avatar: string;
  badge?: ShopBadge;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface UserAddress {
  id: string;
  label: string; // e.g. "Rumah", "Kantor"
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  membershipLevel: 'Platinum' | 'Gold' | 'Silver' | 'Classic';
  followingCount: number;
  followersCount: number;
  kasapPayBalance: number;
  koinKasap: number;
  vouchersCount: number;
  kasapPinjamLimit: number;
  phone: string;
  email: string;
}
