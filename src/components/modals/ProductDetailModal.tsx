import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Share2,
  ChevronRight,
  Store,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah } from '../../utils/shopCalculations';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCheckoutModalOpen,
    setActiveTab,
    showToast,
  } = useShop();

  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const currentVariant =
    selectedVariant ||
    selectedProduct.selectedVariant ||
    selectedProduct.variants?.[0]?.options?.[0] ||
    '';

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, currentVariant);
    setSelectedProduct(null);
    setActiveTab('keranjang');
    setIsCheckoutModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentVariant);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Sticky Header with Back / Close */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xs px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-gray-900 line-clamp-1">
              Detail Produk KASAP_ID
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => showToast('Tautan produk disalin!')}
              className="p-1.5 text-gray-600 hover:text-emerald-700 rounded-full cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Tutup detail produk"
              className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Main Photo Gallery */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xs border border-gray-100">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {selectedProduct.shopBadge && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                {selectedProduct.shopBadge}
              </span>
            )}
          </div>

          {/* Thumbnail list if multiple */}
          {selectedProduct.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer ${
                    activeImageIndex === idx ? 'border-emerald-600' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Badges */}
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-rose-600">
                {formatRupiah(selectedProduct.price)}
              </span>
              {selectedProduct.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatRupiah(selectedProduct.originalPrice)}
                </span>
              )}
            </div>

            <h1 className="text-sm font-bold text-gray-900 mt-1.5 leading-snug">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center space-x-4 mt-2 text-[11px] text-gray-500">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span className="font-bold text-gray-800">{selectedProduct.rating.toFixed(1)}</span>
              </div>
              <span>&bull;</span>
              <span>{selectedProduct.soldCount} Terjual</span>
              <span>&bull;</span>
              <span className="flex items-center text-gray-500">
                <MapPin className="w-3 h-3 mr-0.5" />
                {selectedProduct.location}
              </span>
            </div>
          </div>

          {/* Free Shipping & Assurance */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-semibold text-xs">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Gratis Ongkir Xtra Se-Indonesia</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Original &amp; Garansi Uang Kembali</span>
            </div>
          </div>

          {/* Variants Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="border-t border-gray-100 pt-3">
              <label className="font-bold text-gray-900 block mb-2">Pilih Varian:</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                      currentVariant === opt
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900 block">Jumlah Pembelian:</span>
              <span className="text-[10px] text-gray-500">Tersedia {selectedProduct.stock} stok</span>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Kurangi jumlah"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-gray-900 text-xs">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                aria-label="Tambah jumlah"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">{selectedProduct.shopName}</h4>
                <p className="text-[10px] text-gray-500">Aktif beberapa menit lalu &bull; {selectedProduct.location}</p>
              </div>
            </div>
            <button
              onClick={() => showToast(`Mengunjungi ${selectedProduct.shopName}`)}
              className="border border-emerald-600 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-lg hover:bg-emerald-50 cursor-pointer"
            >
              Kunjungi
            </button>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-3">
            <h4 className="font-bold text-gray-900 mb-1.5">Deskripsi Produk:</h4>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-xs">
              {selectedProduct.description}
            </p>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3 flex items-center space-x-2 shrink-0">
          <button
            onClick={() => showToast('Membuka chat dengan penjual...')}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer"
            aria-label="Chat penjual"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 border border-emerald-300 cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>+ Keranjang</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
