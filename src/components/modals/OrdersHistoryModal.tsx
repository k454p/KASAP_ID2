import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  Package,
  Star,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Coins,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah } from '../../utils/shopCalculations';
import { StatusBar } from '../StatusBar';
import { OrderStatus, OrderItem } from '../../types';

export const OrdersHistoryModal: React.FC = () => {
  const {
    orders,
    orderFilterStatus,
    setOrderFilterStatus,
    updateOrderStatus,
    updateProfile,
    profile,
    showToast,
  } = useShop();

  const [ratingModalOrder, setRatingModalOrder] = useState<OrderItem | null>(null);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('Barang sangat bagus, original dan pengiriman super cepat! Mantap KASAP_ID.');

  if (orderFilterStatus === null) return null;

  const tabs: { id: OrderStatus | 'semua'; label: string } = [
    { id: 'semua', label: 'Semua' },
    { id: 'belum_bayar', label: 'Belum Bayar' },
    { id: 'dikemas', label: 'Dikemas' },
    { id: 'dikirim', label: 'Dikirim' },
    { id: 'penilaian', label: 'Beri Penilaian' },
  ];

  const filteredOrders = orders.filter((o) => {
    if (orderFilterStatus === 'semua') return true;
    return o.status === orderFilterStatus;
  });

  const handleConfirmReceived = (orderId: string) => {
    updateOrderStatus(orderId, 'penilaian');
    showToast('Pesanan diterima! Silakan berikan penilaian.');
  };

  const handleSimulateShipping = (orderId: string) => {
    updateOrderStatus(orderId, 'dikirim');
    showToast('Paket telah diserahkan ke kurir dan sedang dalam perjalanan!');
  };

  const handleSubmitReview = () => {
    if (ratingModalOrder) {
      updateOrderStatus(ratingModalOrder.id, 'selesai');
      updateProfile({ koinKasap: profile.koinKasap + 25 });
      showToast('Penilaian berhasil dikirim! Bonus +25 Koin KASAP telah ditambahkan.');
      setRatingModalOrder(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <StatusBar darkText={true} />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setOrderFilterStatus(null)}
              aria-label="Kembali"
              className="p-1 -ml-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-rose-500" />
            </button>
            <h1 className="font-bold text-base text-gray-900">Pesanan Saya</h1>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex space-x-2 px-3 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setOrderFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                orderFilterStatus === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-3 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-gray-500 mt-4 shadow-xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">Belum ada pesanan pada status ini.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const firstItem = order.items[0];
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-xs border border-gray-100 p-3.5 space-y-3">
                {/* Order Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-gray-900">{firstItem?.product.shopName}</span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      order.status === 'belum_bayar'
                        ? 'bg-amber-100 text-amber-900'
                        : order.status === 'dikemas'
                        ? 'bg-blue-100 text-blue-900'
                        : order.status === 'dikirim'
                        ? 'bg-purple-100 text-purple-900'
                        : order.status === 'penilaian'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Items in Order */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                        {item.selectedVariant && (
                          <span className="text-[10px] text-gray-500">{item.selectedVariant}</span>
                        )}
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-gray-500">x{item.quantity}</span>
                          <span className="font-bold text-gray-900">
                            {formatRupiah(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Info */}
                <div className="bg-gray-50 rounded-lg p-2.5 text-[11px] text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Kurir &amp; Resi:</span>
                    <span className="font-semibold text-emerald-800">
                      {order.courier} - {order.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu Pemesanan:</span>
                    <span>{order.date}</span>
                  </div>
                </div>

                {/* Footer Total & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Total Pesanan:</span>
                    <span className="font-bold text-rose-600 text-sm">{formatRupiah(order.totalAmount)}</span>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'dikemas' && (
                      <button
                        onClick={() => handleSimulateShipping(order.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Kirim Paket</span>
                      </button>
                    )}

                    {order.status === 'dikirim' && (
                      <button
                        onClick={() => handleConfirmReceived(order.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pesanan Diterima</span>
                      </button>
                    )}

                    {order.status === 'penilaian' && (
                      <button
                        onClick={() => setRatingModalOrder(order)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Beri Nilai (+25 Koin)</span>
                      </button>
                    )}

                    {order.status === 'selesai' && (
                      <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selesai</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rating & Review Dialog */}
      {ratingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl text-center space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-7 h-7 fill-amber-500 stroke-amber-500" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Beri Nilai Pesanan</h3>
            <p className="text-xs text-gray-500">
              Dapatkan <b className="text-emerald-700">+25 Koin KASAP</b> setelah memberikan ulasan!
            </p>

            {/* Stars */}
            <div className="flex justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStars(star)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      selectedStars >= star
                        ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ceritakan kepuasanmu belanja di toko ini..."
            />

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRatingModalOrder(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
