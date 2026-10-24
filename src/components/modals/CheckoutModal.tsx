import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  Ticket,
  CheckCircle2,
  ChevronRight,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah, calculateCartTotals } from '../../utils/shopCalculations';
import { OrderItem } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    addresses,
    checkoutSelectedItems,
    setActiveTab,
    setOrderFilterStatus,
    showToast,
  } = useShop();

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isPrimary)?.id || addresses[0]?.id || ''
  );
  const [selectedPayment, setSelectedPayment] = useState('KasapPay QRIS');
  const [selectedCourier, setSelectedCourier] = useState('KASAP Express Instant');
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);

  if (!isCheckoutModalOpen) return null;

  const selectedItems = cart.filter((i) => i.selected);
  const primaryAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const voucherDiscountPercent = 20; // Default KASAPHIJAU discount
  const { subtotal, discountAmount, shippingFee, total } = calculateCartTotals(
    selectedItems,
    voucherDiscountPercent,
    0,
    true
  );

  const handlePlaceOrder = () => {
    if (!primaryAddress) {
      showToast('Harap tambahkan alamat pengiriman terlebih dahulu');
      return;
    }

    const order = checkoutSelectedItems(selectedPayment, selectedAddressId, discountAmount);
    if (order) {
      setCreatedOrder(order);
    }
  };

  const handleFinish = () => {
    setCreatedOrder(null);
    setIsCheckoutModalOpen(false);
    setActiveTab('saya');
    setOrderFilterStatus('dikemas');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (createdOrder) handleFinish();
                else setIsCheckoutModalOpen(false);
              }}
              aria-label="Kembali"
              className="p-1 -ml-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-700" />
            </button>
            <h2 className="font-bold text-base text-gray-900">
              {createdOrder ? 'Pesanan Berhasil!' : 'Checkout Pesanan'}
            </h2>
          </div>
          <button
            onClick={() => {
              if (createdOrder) handleFinish();
              else setIsCheckoutModalOpen(false);
            }}
            aria-label="Tutup"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Order Successfully Created */}
        {createdOrder ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Pembayaran Berhasil!</h3>
              <p className="text-xs text-gray-500 mt-1">
                Nomor Pesanan: <b className="text-gray-800">{createdOrder.orderNumber}</b>
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Pembayaran:</span>
                <span className="font-bold text-emerald-800">{formatRupiah(createdOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode:</span>
                <span className="font-semibold text-gray-800">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. Resi:</span>
                <span className="font-mono text-emerald-700 font-bold">{createdOrder.trackingNumber}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Pesananmu sedang dikemas oleh penjual dan akan segera dikirim. Pantau status paket di menu <b>Pesanan Saya</b>.
            </p>

            <button
              onClick={handleFinish}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl shadow-md cursor-pointer"
            >
              Lihat di Pesanan Saya
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {/* Delivery Address */}
            <div className="bg-gradient-to-r from-emerald-50/50 to-white rounded-xl p-3 border border-emerald-200/80">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold mb-1">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Alamat Pengiriman</span>
              </div>

              {primaryAddress ? (
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{primaryAddress.recipientName}</span>
                    <span className="text-gray-500">({primaryAddress.phone})</span>
                  </div>
                  <p className="text-gray-600 mt-1 leading-snug">{primaryAddress.fullAddress}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    {primaryAddress.city}, {primaryAddress.postalCode}
                  </p>
                </div>
              ) : (
                <p className="text-rose-500 font-semibold">Belum ada alamat pengiriman.</p>
              )}
            </div>

            {/* Selected Products List */}
            <div className="bg-white rounded-xl p-3 border border-gray-200 space-y-2.5">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                Rincian Produk ({selectedItems.length} barang)
              </h3>
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 py-1">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{item.product.name}</h4>
                    {item.selectedVariant && (
                      <span className="text-[10px] text-gray-500">{item.selectedVariant}</span>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-rose-600 font-bold">{formatRupiah(item.product.price)}</span>
                      <span className="text-gray-500 font-medium">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Courier Selection */}
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-bold text-gray-900 flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Opsi Pengiriman</span>
                </span>
                <span className="text-emerald-700 font-bold">GRATIS ONGKIR</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {['KASAP Express Instant', 'J&T Reguler', 'SiCepat Halu'].map((c) => (
                  <label
                    key={c}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${
                      selectedCourier === c
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{c}</span>
                    <input
                      type="radio"
                      name="courier"
                      checked={selectedCourier === c}
                      onChange={() => setSelectedCourier(c)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <span className="font-bold text-gray-900 block pb-2 border-b border-gray-100 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Metode Pembayaran</span>
              </span>
              <div className="mt-2 space-y-1.5">
                {[
                  { id: 'KasapPay QRIS', label: 'KasapPay QRIS (Saldo: Rp450.000)' },
                  { id: 'BCA Virtual Account', label: 'BCA Virtual Account (Otomatis)' },
                  { id: 'KasapLater', label: 'KasapLater (Cicilan 0% 3 Bulan)' },
                  { id: 'COD (Bayar di Tempat)', label: 'COD (Bayar di Tempat Saat Barang Tiba)' },
                ].map((pay) => (
                  <label
                    key={pay.id}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${
                      selectedPayment === pay.id
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-semibold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{pay.label}</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === pay.id}
                      onChange={() => setSelectedPayment(pay.id)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-white rounded-xl p-3 border border-gray-200 space-y-1.5">
              <h4 className="font-bold text-gray-900 pb-1 border-b border-gray-100">
                Rincian Pembayaran
              </h4>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal untuk Produk:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Ongkos Kirim:</span>
                <span className="text-emerald-700 font-semibold">Rp0 (Bebas Ongkir)</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Diskon Voucher KASAPHIJAU (20%):</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Tagihan:</span>
                <span className="text-rose-600">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {!createdOrder && (
          <div className="bg-white border-t border-gray-100 p-3 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-gray-500 block">Total Tagihan:</span>
              <span className="text-base font-extrabold text-rose-600">{formatRupiah(total)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Bayar Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
