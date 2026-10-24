import React, { useState } from 'react';
import {
  ShoppingCart,
  MessageCircle,
  ChevronRight,
  ThumbsUp,
  Percent,
  Video,
  CreditCard,
  ShoppingBag,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StatusBar } from '../StatusBar';

export const NotifikasiView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    cart,
    setActiveTab,
    setOrderFilterStatus,
    showToast,
  } = useShop();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'pilihan' | 'promo' | 'live' | 'keuangan' | 'info'>('pilihan');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const statusPesananNotifs = notifications.filter((n) => n.type === 'status_pesanan');
  const promoNotifs = notifications.filter((n) => n.type === 'promo');

  return (
    <div className="min-h-full pb-20 bg-gray-100 select-none text-gray-800">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <StatusBar darkText={true} />
        <div className="flex items-center justify-between px-4 py-2.5">
          <h1 className="font-bold text-base text-gray-900">Notifikasi</h1>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('keranjang')}
              aria-label="Keranjang"
              className="relative p-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 text-rose-500" />
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                {totalCartCount > 99 ? '99+' : totalCartCount > 0 ? totalCartCount : '99+'}
              </span>
            </button>
            <button
              onClick={() => showToast('Membuka Chat...')}
              aria-label="Chat"
              className="p-1 text-rose-500 hover:text-rose-600 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Permission Banner */}
        <div className="bg-amber-50/80 rounded-xl p-3 flex items-start justify-between shadow-xs border border-amber-200/60">
          <div className="flex items-start space-x-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              Izinkan notifikasi untuk dapatkan info status pesanan, promo, dan info menarik lainnya.{' '}
              <button
                onClick={() => showToast('Notifikasi telah diizinkan!')}
                className="text-blue-600 font-semibold underline inline cursor-pointer"
              >
                Izinkan
              </button>
            </p>
          </div>
          <button
            onClick={(e) => {
              const target = e.currentTarget.parentElement;
              if (target) target.style.display = 'none';
            }}
            aria-label="Tutup notifikasi"
            className="text-gray-400 hover:text-gray-600 text-sm ml-2"
          >
            &times;
          </button>
        </div>

        {/* Notifikasi Toko */}
        <div
          onClick={() => showToast('Melihat Notifikasi Toko')}
          className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2.5">
            <h2 className="text-sm font-bold text-gray-900">Notifikasi Toko</h2>
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              16
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Status Pesanan */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Status Pesanan</h2>
            <button
              onClick={() => {
                setActiveTab('saya');
                setOrderFilterStatus('semua');
              }}
              className="flex items-center space-x-0.5 text-xs text-gray-500 hover:text-emerald-700 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {statusPesananNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  setActiveTab('saya');
                  setOrderFilterStatus('penilaian');
                }}
                className={`py-3 flex items-start justify-between cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors ${
                  !item.isRead ? 'bg-emerald-50/40' : ''
                }`}
              >
                <div className="pr-3 flex-1">
                  <h3 className="text-xs font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Nilai pesanan dan dapatkan hingga{' '}
                    <span className="text-teal-700 font-bold">{item.coinsReward || 25} koin</span>.
                  </p>
                  <span className="text-[10px] text-gray-400 mt-2 block">{item.date}</span>
                </div>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Update Terbaru Section */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Update Terbaru</h2>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-gray-500 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Sudah Dibaca</span>
            </button>
          </div>

          {/* Sub Navigation Icons (Matches screenshot) */}
          <div className="grid grid-cols-5 gap-1 pt-3 pb-2 text-center border-b border-gray-100">
            <button
              onClick={() => setActiveCategoryTab('pilihan')}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                activeCategoryTab === 'pilihan' ? 'text-rose-600' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                  9
                </span>
              </div>
              <span className="text-[10px] mt-1 font-semibold leading-tight">Pilihan Teratas</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab('promo')}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                activeCategoryTab === 'promo' ? 'text-rose-600' : 'text-gray-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 font-medium leading-tight">Promo KASAP</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab('live')}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                activeCategoryTab === 'live' ? 'text-rose-600' : 'text-gray-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 font-medium leading-tight">Live & Video</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab('keuangan')}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                activeCategoryTab === 'keuangan' ? 'text-rose-600' : 'text-gray-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 font-medium leading-tight">Keuangan</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab('info')}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer ${
                activeCategoryTab === 'info' ? 'text-rose-600' : 'text-gray-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 font-medium leading-tight">Info KASAP</span>
            </button>
          </div>

          {/* Feed Content */}
          <div className="divide-y divide-gray-100 pt-1">
            {promoNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  showToast('Membuka detail penawaran...');
                }}
                className="py-3 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                  LIVE
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{item.date}</span>
                </div>

                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] font-bold shrink-0 text-center p-1">
                  EXTRA 5%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
