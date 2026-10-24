import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  MessageCircle,
  QrCode,
  Sparkles,
  Store,
  Truck,
  Zap,
  Star,
  MapPin,
  Plus,
  SlidersHorizontal,
  Edit,
  CheckCircle,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah, filterProducts } from '../../utils/shopCalculations';
import { StatusBar } from '../StatusBar';
import { Product } from '../../types';

export const BerandaView: React.FC = () => {
  const {
    products,
    cart,
    setActiveTab,
    setSelectedProduct,
    setEditingProduct,
    setIsUploadModalOpen,
    addToCart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showToast,
  } = useShop();

  const [activeSort, setActiveSort] = useState<'popular' | 'latest' | 'price_asc' | 'price_desc'>('popular');

  const categories = [
    'Semua',
    'Tanaman & Flora',
    'Perkakas',
    'Rumah Tangga',
    'Kemasan & Packaging',
    'Fashion Pria',
    'Kesehatan & Bayi',
  ];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filtered = filterProducts(products, {
    query: searchQuery,
    category: selectedCategory,
    sortBy: activeSort,
  });

  return (
    <div className="min-h-full pb-20 bg-gray-100 select-none text-gray-800">
      {/* Top Emerald Green Gradient Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white pt-1 pb-4 px-3 sticky top-0 z-20 shadow-sm">
        <StatusBar darkText={false} />

        {/* Brand & Search Row */}
        <div className="flex items-center space-x-2.5 mt-2">
          {/* Logo */}
          <div className="flex items-center space-x-1 shrink-0">
            <span className="font-black text-lg tracking-wider text-white">
              KASAP<span className="text-emerald-300">_ID</span>
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk di KASAP_ID..."
              className="w-full bg-white text-gray-900 placeholder-gray-400 pl-8 pr-7 py-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 text-white shrink-0">
            <button
              onClick={() => setActiveTab('keranjang')}
              aria-label="Keranjang"
              className="relative p-1 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                showToast('Membuka Chat...');
                const elem = document.getElementById('chat-trigger-btn');
                if (elem) elem.click();
              }}
              aria-label="Chat"
              className="p-1 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Hero Green Promotion Carousel */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-4">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:12px_12px]" />
          <div className="relative z-10 max-w-[70%]">
            <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              PROMO SPESIAL
            </span>
            <h2 className="text-base font-extrabold mt-1.5 leading-snug">
              Belanja Murah &amp; Bebas Ongkir
            </h2>
            <p className="text-[11px] text-emerald-100 mt-1">
              Gunakan voucher <span className="font-bold underline text-amber-200">KASAPHIJAU</span> untuk diskon 20%
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-3 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mulai Jual Produk</span>
          </button>
        </div>

        {/* Quick Menu Icons */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-gray-100">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded-lg cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 mt-1.5">Upload Produk</span>
            </button>

            <button
              onClick={() => showToast('Voucher Gratis Ongkir Xtra aktif untuk semua transaksi!')}
              className="flex flex-col items-center justify-center p-1.5 hover:bg-teal-50 rounded-lg cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 mt-1.5">Gratis Ongkir</span>
            </button>

            <button
              onClick={() => showToast('Flash Sale KASAP mulai pukul 12.00 dan 18.00 WIB!')}
              className="flex flex-col items-center justify-center p-1.5 hover:bg-amber-50 rounded-lg cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 mt-1.5">Flash Sale</span>
            </button>

            <button
              onClick={() => showToast('Fitur Bayar Cepat QRIS KasapPay')}
              className="flex flex-col items-center justify-center p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 mt-1.5">KasapPay</span>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Filter Bar */}
        <div className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 font-medium">Urutkan:</span>
            <button
              onClick={() => setActiveSort('popular')}
              className={`font-semibold cursor-pointer ${
                activeSort === 'popular' ? 'text-emerald-700 underline underline-offset-4' : 'text-gray-600'
              }`}
            >
              Terlaris
            </button>
            <button
              onClick={() => setActiveSort('latest')}
              className={`font-semibold cursor-pointer ${
                activeSort === 'latest' ? 'text-emerald-700 underline underline-offset-4' : 'text-gray-600'
              }`}
            >
              Terbaru
            </button>
            <button
              onClick={() => setActiveSort(activeSort === 'price_asc' ? 'price_desc' : 'price_asc')}
              className={`font-semibold cursor-pointer flex items-center space-x-0.5 ${
                activeSort === 'price_asc' || activeSort === 'price_desc'
                  ? 'text-emerald-700 underline underline-offset-4'
                  : 'text-gray-600'
              }`}
            >
              <span>Harga</span>
              <span>{activeSort === 'price_asc' ? '▲' : '▼'}</span>
            </button>
          </div>
          <span className="text-gray-400 text-[11px]">{filtered.length} Produk</span>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-xs border border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Tidak ada produk yang cocok.</p>
            <p className="text-xs text-gray-500 mt-1">Coba kata kunci lain atau upload produk baru!</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-3 bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              + Upload Produk Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-xs border border-gray-100 flex flex-col hover:shadow-md transition-shadow group relative"
              >
                {/* Image */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                    }}
                  />

                  {product.shopBadge && (
                    <span
                      className={`absolute top-1.5 left-1.5 text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs text-white ${
                        product.shopBadge === 'Mall ORI'
                          ? 'bg-rose-600'
                          : product.shopBadge === 'Star+'
                          ? 'bg-red-500'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {product.shopBadge}
                    </span>
                  )}

                  {product.isUserUploaded && (
                    <span className="absolute top-1.5 right-1.5 bg-emerald-700 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
                      Toko Saya
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-1.5">
                      <span className="text-sm font-bold text-rose-600">
                        {formatRupiah(product.price)}
                      </span>
                      {product.originalPrice && (
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatRupiah(product.originalPrice)}
                          </span>
                          <span className="text-[9px] text-rose-500 font-bold bg-rose-50 px-1 rounded">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rating & Sold */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5">
                      <div className="flex items-center space-x-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        <span className="text-gray-700 font-bold">{product.rating.toFixed(1)}</span>
                      </div>
                      <span>{product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}rb` : product.soldCount} terjual</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-[10px] text-gray-400 mt-1">
                      <MapPin className="w-2.5 h-2.5 mr-0.5 shrink-0" />
                      <span className="truncate">{product.location}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center space-x-1.5">
                    {product.isUserUploaded ? (
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 border border-amber-200 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit Produk</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => addToCart(product, 1)}
                      className={`flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 shadow-xs cursor-pointer ${
                        product.isUserUploaded ? '' : 'w-full'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
