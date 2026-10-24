import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Ticket,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah, calculateCartTotals, validateVoucherCode } from '../../utils/shopCalculations';
import { StatusBar } from '../StatusBar';

export const KeranjangView: React.FC = () => {
  const {
    cart,
    setActiveTab,
    updateCartQuantity,
    removeFromCart,
    toggleCartItem,
    toggleAllCartItems,
    setIsCheckoutModalOpen,
    showToast,
  } = useShop();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; percent: number } | null>({
    code: 'KASAPHIJAU',
    percent: 20,
  });
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [useCoins, setUseCoins] = useState(false);

  // Group cart items by store name
  const stores = Array.from(new Set(cart.map((item) => item.product.shopName)));

  const allSelected = cart.length > 0 && cart.every((item) => item.selected);
  const someSelected = cart.some((item) => item.selected);

  const { selectedCount, subtotal, discountAmount, total } = calculateCartTotals(
    cart,
    appliedVoucher ? appliedVoucher.percent : 0,
    0,
    true
  );

  const finalTotal = useCoins ? Math.max(0, total - 12500) : total;

  const handleApplyVoucher = () => {
    const res = validateVoucherCode(voucherCodeInput);
    if (res.valid) {
      setAppliedVoucher({ code: voucherCodeInput.toUpperCase(), percent: res.discountPercentage });
      showToast(res.message);
      setShowVoucherModal(false);
      setVoucherCodeInput('');
    } else {
      showToast(res.message);
    }
  };

  const handleToggleStore = (shopName: string, currentlyAllSelected: boolean) => {
    const storeItems = cart.filter((item) => item.product.shopName === shopName);
    const targetState = !currentlyAllSelected;
    storeItems.forEach((item) => {
      if (item.selected !== targetState) {
        toggleCartItem(item.id);
      }
    });
  };

  const handleDeleteSelected = () => {
    const selectedIds = cart.filter((item) => item.selected).map((item) => item.id);
    if (selectedIds.length === 0) {
      showToast('Pilih item yang ingin dihapus');
      return;
    }
    selectedIds.forEach((id) => removeFromCart(id));
    showToast(`${selectedIds.length} item dihapus dari keranjang`);
  };

  return (
    <div className="min-h-full pb-32 bg-gray-100 select-none text-gray-800">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <StatusBar darkText={true} />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('saya')}
              aria-label="Kembali"
              className="p-1 -ml-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-rose-500" />
            </button>
            <h1 className="font-bold text-base text-gray-900">
              Keranjang Saya ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditingMode(!isEditingMode)}
              className="text-sm font-medium text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              {isEditingMode ? 'Selesai' : 'Ubah'}
            </button>
            <button
              onClick={() => showToast('Membuka Chat...')}
              aria-label="Chat"
              className="relative p-1 text-rose-500 hover:text-rose-600 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="p-3 space-y-3">
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-xs border border-gray-100 mt-4">
            <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Keranjang Belanja Kosong</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Yuk jelajahi produk menarik di KASAP_ID dan masukkan ke keranjang belanjaanmu!
            </p>
            <button
              onClick={() => setActiveTab('beranda')}
              className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          stores.map((shopName) => {
            const storeItems = cart.filter((item) => item.product.shopName === shopName);
            const isStoreAllSelected = storeItems.length > 0 && storeItems.every((item) => item.selected);
            const firstProduct = storeItems[0]?.product;

            return (
              <div key={shopName} className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                {/* Store Header */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-50">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStore(shopName, isStoreAllSelected)}
                      aria-label={`Pilih semua item dari toko ${shopName}`}
                      className={`w-4.5 h-4.5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                        isStoreAllSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isStoreAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    {firstProduct?.shopBadge && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          firstProduct.shopBadge === 'Mall ORI'
                            ? 'bg-rose-600 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {firstProduct.shopBadge}
                      </span>
                    )}

                    <div className="flex items-center space-x-1 cursor-pointer hover:text-emerald-700">
                      <span className="text-xs font-bold text-gray-900">{shopName}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditingMode(!isEditingMode)}
                    className="text-xs text-gray-500 hover:text-emerald-700 cursor-pointer"
                  >
                    Ubah
                  </button>
                </div>

                {/* Items in this Store */}
                <div className="divide-y divide-gray-50">
                  {storeItems.map((item) => (
                    <div key={item.id} className="p-3">
                      <div className="flex items-start space-x-2.5">
                        <button
                          onClick={() => toggleCartItem(item.id)}
                          aria-label={`Pilih produk ${item.product.name}`}
                          className={`w-4.5 h-4.5 mt-6 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                            item.selected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {item.selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <img
                          src={item.product.images[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200'}
                          alt={item.product.name}
                          className="w-18 h-18 rounded-lg object-cover border border-gray-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h3>

                          {/* Variant Selector Pill */}
                          {item.selectedVariant && (
                            <div className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded mt-1 cursor-pointer">
                              <span className="font-medium mr-1">{item.selectedVariant}</span>
                              <ChevronRight className="w-2.5 h-2.5 rotate-90 text-gray-500" />
                            </div>
                          )}

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="text-[9px] font-bold bg-teal-50 text-teal-800 px-1 py-0.2 rounded border border-teal-200">
                              GRATIS ONGKIR XTRA
                            </span>
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-800 px-1 py-0.2 rounded border border-amber-200">
                              PROMO CICILAN 0%
                            </span>
                          </div>

                          {/* Price & Quantity Stepper */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-bold text-rose-600">
                              {formatRupiah(item.product.price)}
                            </span>

                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                aria-label="Kurangi kuantitas"
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                aria-label="Tambah kuantitas"
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Store specific offer rows */}
                      <div className="mt-2.5 pt-2 border-t border-gray-50 space-y-1.5 text-[11px]">
                        <div
                          onClick={() => showToast('Kombo Hemat otomatis aktif saat checkout')}
                          className="flex items-center justify-between text-gray-700 cursor-pointer hover:text-emerald-700"
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 bg-rose-500 rounded-xs flex items-center justify-center text-[8px] text-white font-bold">
                              ★
                            </span>
                            <span>Kombo Hemat dengan harga lebih murah</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </div>

                        <div
                          onClick={() => setShowVoucherModal(true)}
                          className="flex items-center justify-between text-rose-600 cursor-pointer"
                        >
                          <div className="flex items-center space-x-1.5">
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Tersedia Voucher Diskon s/d 20%</span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Checkout Bar (Exact replica of screenshot 6) */}
      <div className="fixed bottom-14 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-20 shadow-md">
        {/* Voucher & Coins quick rows */}
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-xs">
          <div
            onClick={() => setShowVoucherModal(true)}
            className="flex items-center space-x-1.5 text-gray-800 cursor-pointer hover:text-emerald-700"
          >
            <Ticket className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Voucher KASAP</span>
          </div>

          <div
            onClick={() => setShowVoucherModal(true)}
            className="flex items-center space-x-1 text-emerald-700 font-semibold cursor-pointer"
          >
            <span>{appliedVoucher ? `${appliedVoucher.code} (-${appliedVoucher.percent}%)` : 'Gunakan/ masukkan kode'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Koin Kasap Toggle */}
        <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-gray-700">
            <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-[10px]">
              S
            </span>
            <span>Tukarkan 12.500 Koin KASAP [-Rp12.500]</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useCoins}
              onChange={(e) => setUseCoins(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Total & Checkout button */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleAllCartItems(!allSelected)}
              aria-label="Pilih semua item di keranjang"
              className={`w-4.5 h-4.5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                allSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
              }`}
            >
              {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
            <span className="text-xs text-gray-700 font-medium">Semua</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-baseline space-x-1 justify-end">
                <span className="text-[11px] text-gray-500">Total:</span>
                <span className="text-sm font-bold text-rose-600">{formatRupiah(finalTotal)}</span>
              </div>
              {appliedVoucher && selectedCount > 0 && (
                <p className="text-[10px] text-emerald-700 font-medium">
                  Hemat {formatRupiah(discountAmount + (useCoins ? 12500 : 0))}
                </p>
              )}
            </div>

            {isEditingMode ? (
              <button
                onClick={handleDeleteSelected}
                disabled={!someSelected}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus ({selectedCount})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (selectedCount === 0) {
                    showToast('Pilih produk terlebih dahulu.');
                    return;
                  }
                  setIsCheckoutModalOpen(true);
                }}
                disabled={selectedCount === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                Checkout ({selectedCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Voucher Input Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">Voucher KASAP_ID</h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Ketik Kode Voucher Promo:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder="Contoh: KASAPHIJAU, EXTRA20, ONGKIRNOL"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-800 cursor-pointer"
                >
                  Pakai
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-gray-600">Voucher Rekomendasi:</p>
              <div
                onClick={() => {
                  setAppliedVoucher({ code: 'KASAPHIJAU', percent: 20 });
                  showToast('Voucher KASAPHIJAU Diskon 20% aktif!');
                  setShowVoucherModal(false);
                }}
                className="p-2.5 border border-emerald-300 bg-emerald-50/60 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/70"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-900">KASAPHIJAU</span>
                  <p className="text-[11px] text-gray-600">Diskon 20% tanpa batas minimal belanja</p>
                </div>
                <span className="text-xs text-emerald-700 font-bold">Gunakan</span>
              </div>

              <div
                onClick={() => {
                  setAppliedVoucher({ code: 'EXTRA20', percent: 20 });
                  showToast('Voucher EXTRA20 aktif!');
                  setShowVoucherModal(false);
                }}
                className="p-2.5 border border-amber-300 bg-amber-50/60 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100/70"
              >
                <div>
                  <span className="text-xs font-bold text-amber-900">EXTRA20</span>
                  <p className="text-[11px] text-gray-600">Dapatkan Extra Diskon 20% VIP+</p>
                </div>
                <span className="text-xs text-amber-700 font-bold">Gunakan</span>
              </div>
            </div>

            <button
              onClick={() => setShowVoucherModal(false)}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
