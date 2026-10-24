import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Package,
  DollarSign,
  TrendingUp,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah } from '../../utils/shopCalculations';
import { StatusBar } from '../StatusBar';
import { Product } from '../../types';

export const TokoSayaView: React.FC = () => {
  const {
    products,
    profile,
    setIsUploadModalOpen,
    setEditingProduct,
    setSelectedProduct,
    deleteProduct,
    updateProduct,
    showToast,
  } = useShop();

  const [activeFilter, setActiveFilter] = useState<'semua' | 'saya' | 'stok_sedikit'>('semua');
  const [searchFilter, setSearchFilter] = useState('');

  // Seller products (user uploaded or store affiliated)
  const storeProducts = products.filter((p) => {
    if (activeFilter === 'saya' && !p.isUserUploaded) return false;
    if (activeFilter === 'stok_sedikit' && p.stock > 10) return false;
    if (searchFilter.trim()) {
      return (
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.category.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    return true;
  });

  const totalSold = products.reduce((acc, p) => acc + p.soldCount, 0);
  const totalRevenue = products.reduce((acc, p) => acc + p.price * p.soldCount, 0);

  const handleQuickStockUpdate = (p: Product, newStock: number) => {
    if (newStock < 0) return;
    updateProduct(p.id, { stock: newStock });
  };

  return (
    <div className="min-h-full pb-24 bg-gray-100 select-none text-gray-800">
      {/* Top Emerald Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white pt-1 pb-6 px-4 rounded-b-2xl shadow-sm">
        <StatusBar darkText={false} />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-base tracking-tight">{profile.name} (Toko Saya)</h1>
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded">
                  STAR+
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">Kelola produk &amp; pantau jualan di KASAP_ID</p>
            </div>
          </div>
        </div>

        {/* Action Button: Upload Product */}
        <div className="mt-4">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-transform active:scale-[0.99]"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <span>+ Upload Produk Baru Sekarang</span>
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3 -mt-2">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <h2 className="text-xs font-bold text-gray-700 mb-2.5">Ringkasan Penjualan</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-gray-500 font-medium block">Total Produk</span>
              <span className="text-base font-bold text-emerald-800 mt-0.5 block">{products.length}</span>
            </div>
            <div className="p-2 bg-teal-50/60 rounded-xl border border-teal-100">
              <span className="text-[10px] text-gray-500 font-medium block">Total Terjual</span>
              <span className="text-base font-bold text-teal-800 mt-0.5 block">{totalSold}</span>
            </div>
            <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-medium block">Rating Toko</span>
              <span className="text-base font-bold text-blue-800 mt-0.5 block">4.9 ★</span>
            </div>
          </div>
        </div>

        {/* Product Management Section */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Katalog Produk Toko</h2>
              <p className="text-[11px] text-gray-500">Edit jika ada kekurangan atau kesalahan data</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="mt-3 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari nama produk di toko..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 rounded-lg text-xs border border-gray-200 outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex space-x-1.5 text-xs">
              <button
                onClick={() => setActiveFilter('semua')}
                className={`px-3 py-1 rounded-full font-semibold cursor-pointer ${
                  activeFilter === 'semua'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semua Produk ({products.length})
              </button>
              <button
                onClick={() => setActiveFilter('saya')}
                className={`px-3 py-1 rounded-full font-semibold cursor-pointer ${
                  activeFilter === 'saya'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Diunggah Saya ({products.filter((p) => p.isUserUploaded).length})
              </button>
              <button
                onClick={() => setActiveFilter('stok_sedikit')}
                className={`px-3 py-1 rounded-full font-semibold cursor-pointer ${
                  activeFilter === 'stok_sedikit'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Stok Menipis
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className="mt-3 divide-y divide-gray-100">
            {storeProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs">
                Tidak ada produk ditemukan. Klik "+ Upload Produk Baru" untuk menambahkan produk jualanmu!
              </div>
            ) : (
              storeProducts.map((p: Product) => (
                <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    <img
                      src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt={p.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {p.category}
                        </span>
                        {p.isUserUploaded && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Produk Saya
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">
                        {p.name}
                      </h3>

                      <div className="flex items-center space-x-3 mt-1 text-xs">
                        <span className="font-bold text-rose-600">{formatRupiah(p.price)}</span>
                        <span className="text-gray-500 text-[11px]">
                          Stok: <b className={p.stock < 10 ? 'text-rose-600' : 'text-gray-800'}>{p.stock}</b>
                        </span>
                        <span className="text-gray-400 text-[11px]">{p.soldCount} Terjual</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete buttons */}
                  <div className="flex items-center space-x-1.5 self-end sm:self-center">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus "${p.name}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold p-1.5 rounded-lg border border-red-200 cursor-pointer"
                      aria-label={`Hapus ${p.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Seller Info Tips */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3.5 border border-emerald-200 text-emerald-950">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <h4 className="text-xs font-bold">Kiat Sukses Jualan di KASAP_ID</h4>
          </div>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
            Upload foto asli produk dengan pencahayaan terang, lengkapi deskripsi dan varian warna/ukuran, serta aktifkan voucher toko untuk menarik pembeli pertama!
          </p>
        </div>
      </div>
    </div>
  );
};
