import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  OrderItem,
  NotificationItem,
  ChatConversation,
  UserProfile,
  UserAddress,
  TabType,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CART,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHATS,
  INITIAL_ADDRESSES,
  INITIAL_USER_PROFILE,
} from '../data/initialData';
import { deductProductStock } from '../utils/shopCalculations';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: OrderItem[];
  notifications: NotificationItem[];
  chats: ChatConversation[];
  profile: UserProfile;
  addresses: UserAddress[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;

  // Modals & Navigation
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  activeChat: ChatConversation | null;
  setActiveChat: (chat: ChatConversation | null) => void;
  orderFilterStatus: OrderStatus | 'semua' | null;
  setOrderFilterStatus: (s: OrderStatus | 'semua' | null) => void;

  // Product Operations
  addProduct: (productData: Partial<Product>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart Operations
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  toggleCartItem: (cartItemId: string) => void;
  toggleAllCartItems: (select: boolean) => void;

  // Order & Checkout
  checkoutSelectedItems: (paymentMethod: string, addressId: string, voucherDiscount?: number) => OrderItem | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Chat
  sendChatMessage: (chatId: string, text: string) => void;

  // Profile & Address
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  editAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setPrimaryAddress: (id: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'kasap_products_v1',
  CART: 'kasap_cart_v1',
  ORDERS: 'kasap_orders_v1',
  NOTIFICATIONS: 'kasap_notif_v1',
  CHATS: 'kasap_chats_v1',
  PROFILE: 'kasap_profile_v1',
  ADDRESSES: 'kasap_addr_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [chats, setChats] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      return saved ? JSON.parse(saved) : INITIAL_CHATS;
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('saya'); // default to 'saya' as in user's main screenshot, or user can toggle freely!
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<OrderStatus | 'semua' | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  // Product Operations
  const addProduct = (productData: Partial<Product>): Product => {
    const newProduct: Product = {
      id: `prod-user-${Date.now()}`,
      name: productData.name || 'Produk Baru',
      price: Number(productData.price) || 10000,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      rating: 5.0,
      soldCount: 0,
      stock: Number(productData.stock) || 10,
      images: productData.images && productData.images.length > 0 ? productData.images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      ],
      category: productData.category || 'Umum',
      shopName: profile.name || 'Toko Saya (KASAP_ID)',
      shopBadge: 'Star+',
      location: 'Kota Bogor',
      description: productData.description || 'Deskripsi produk KASAP_ID lengkap dan berkualitas.',
      variants: productData.variants || [],
      selectedVariant: productData.selectedVariant || (productData.variants?.[0]?.options?.[0] ?? ''),
      tags: ['Toko Saya', 'Produk Baru', 'Gratis Ongkir Xtra'],
      isUserUploaded: true,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produk "${newProduct.name}" berhasil diunggah!`);
    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock,
        };
      })
    );

    // Also update any matching product inside cart items
    setCart((prev) =>
      prev.map((c) => {
        if (c.productId === id) {
          return {
            ...c,
            product: {
              ...c.product,
              ...updatedFields,
              price: updatedFields.price !== undefined ? Number(updatedFields.price) : c.product.price,
            },
          };
        }
        return c;
      })
    );

    showToast('Produk berhasil diperbarui!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
    showToast('Produk telah dihapus.');
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    const existingVariant = variant || product.selectedVariant || product.variants?.[0]?.options?.[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedVariant === existingVariant
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        selectedVariant: existingVariant,
        quantity,
        selected: true,
        product,
      };
      return [newItem, ...prev];
    });

    showToast(`"${product.name.slice(0, 24)}..." masuk ke keranjang`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item dihapus dari keranjang.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const toggleCartItem = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleAllCartItems = (select: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  // Checkout Selected Items
  const checkoutSelectedItems = (
    paymentMethod: string,
    addressId: string,
    voucherDiscount = 0
  ): OrderItem | null => {
    const selected = cart.filter((i) => i.selected);
    if (selected.length === 0) {
      showToast('Pilih setidaknya 1 produk untuk checkout.');
      return null;
    }

    const selectedAddr = addresses.find((a) => a.id === addressId) || addresses[0];
    const subtotal = selected.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingFee = 0; // free shipping promotion
    const finalAmount = Math.max(0, subtotal - voucherDiscount + shippingFee);

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: `KASAP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      items: selected,
      totalAmount: finalAmount,
      shippingFee,
      discount: voucherDiscount,
      status: 'dikemas',
      date: dateFormatted,
      trackingNumber: `KASAPX${Math.floor(100000000 + Math.random() * 900000000)}`,
      courier: 'KASAP Express Instant',
      recipientName: selectedAddr.recipientName,
      phone: selectedAddr.phone,
      address: `${selectedAddr.fullAddress}, ${selectedAddr.city} ${selectedAddr.postalCode}`,
      paymentMethod,
    };

    // Deduct stock in products
    setProducts((prev) =>
      deductProductStock(
        prev,
        selected.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      )
    );

    // Remove bought items from cart
    setCart((prev) => prev.filter((i) => !i.selected));

    // Append to orders
    setOrders((prev) => [newOrder, ...prev]);

    // Add a notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Pesanan Berhasil Dibuat',
      description: `Pesanan ${newOrder.orderNumber} sedang dikemas oleh penjual.`,
      type: 'status_pesanan',
      date: 'Baru saja',
      isRead: false,
      image: selected[0]?.product.images[0],
      targetTab: 'saya',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Pesanan berhasil dibuat! Sedang diproses.');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Status pesanan diperbarui menjadi: ${status}`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Semua notifikasi ditandai sudah dibaca.');
  };

  // Chat
  const sendChatMessage = (chatId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      chatId,
      sender: 'me' as const,
      text: trimmed,
      timestamp: timeStr,
      isRead: true,
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          lastMessage: trimmed,
          lastMessageTime: timeStr,
          messages: [...c.messages, newMsg],
        };
      })
    );

    if (activeChat && activeChat.id === chatId) {
      setActiveChat((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: trimmed,
              lastMessageTime: timeStr,
              messages: [...prev.messages, newMsg],
            }
          : null
      );
    }

    // Auto simulated response after 1.5 seconds from store
    setTimeout(() => {
      const replyMsg = {
        id: `msg-reply-${Date.now()}`,
        chatId,
        sender: 'store' as const,
        text: 'Terima kasih telah menghubungi kami kak! Pesanan dan pesan kakak sudah kami catat, mohon ditunggu ya kak 🙏',
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(
          new Date().getMinutes()
        ).padStart(2, '0')}`,
        isRead: true,
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            lastMessage: replyMsg.text,
            lastMessageTime: replyMsg.timestamp,
            messages: [...c.messages, replyMsg],
          };
        })
      );

      if (activeChat && activeChat.id === chatId) {
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                lastMessage: replyMsg.text,
                lastMessageTime: replyMsg.timestamp,
                messages: [...prev.messages, replyMsg],
              }
            : null
        );
      }
    }, 1200);
  };

  // Profile & Address
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    showToast('Profil akun berhasil diperbarui!');
  };

  const addAddress = (addrData: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      ...addrData,
    };
    if (newAddr.isPrimary) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isPrimary: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
    showToast('Alamat baru berhasil ditambahkan!');
  };

  const editAddress = (id: string, updated: Partial<UserAddress>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updated };
        }
        if (updated.isPrimary) {
          return { ...a, isPrimary: false };
        }
        return a;
      })
    );
    showToast('Alamat berhasil diubah!');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Alamat telah dihapus.');
  };

  const setPrimaryAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }))
    );
    showToast('Alamat utama diatur.');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        notifications,
        chats,
        profile,
        addresses,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        isUploadModalOpen,
        setIsUploadModalOpen,
        editingProduct,
        setEditingProduct,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        activeChat,
        setActiveChat,
        orderFilterStatus,
        setOrderFilterStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleCartItem,
        toggleAllCartItems,
        checkoutSelectedItems,
        updateOrderStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendChatMessage,
        updateProfile,
        addAddress,
        editAddress,
        deleteAddress,
        setPrimaryAddress,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
