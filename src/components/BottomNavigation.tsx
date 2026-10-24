import React from 'react';
import { Home, Store, ShoppingCart, Bell, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { TabType } from '../types';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, cart, notifications } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number } = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'kelola',
      label: 'Toko Saya',
      icon: <Store className="w-5 h-5" />,
    },
    {
      id: 'keranjang',
      label: 'Keranjang',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: totalCartCount > 0 ? totalCartCount : undefined,
    },
    {
      id: 'notifikasi',
      label: 'Notifikasi',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotifCount > 0 ? 25 : undefined, // 25 as seen in screenshot badge
    },
    {
      id: 'saya',
      label: 'Saya',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-safe"
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors cursor-pointer ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full border border-white leading-none shadow-xs">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 ${isActive ? 'font-bold text-emerald-700' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
