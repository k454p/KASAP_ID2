import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah } from '../../utils/shopCalculations';

export const EditProductModal: React.FC = () => {
  const { editingProduct, setEditingProduct, updateProduct, deleteProduct, showToast } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [variantInput, setVariantInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(String(editingProduct.price));
      setOriginalPrice(editingProduct.originalPrice ? String(editingProduct.originalPrice) : '');
      setStock(String(editingProduct.stock));
      setDescription(editingProduct.description);
      setImagePreview(editingProduct.images[0] || '');

      const existingOptions = editingProduct.variants?.[0]?.options || [];
      setVariantInput(existingOptions.join(', '));
    }
  }, [editingProduct]);

  if (!editingProduct) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Nama produk tidak boleh kosong');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast('Harga produk tidak valid');
      return;
    }

    const variants = variantInput.trim()
      ? [
          {
            name: 'Pilihan',
            options: variantInput
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean),
          },
        ]
      : [];

    updateProduct(editingProduct.id, {
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock) || 0,
      description: description.trim(),
      images: [imagePreview],
      variants,
      selectedVariant: variants[0]?.options?.[0] || undefined,
    });

    setEditingProduct(null);
  };

  const handleDelete = () => {
    if (confirm(`Hapus produk "${editingProduct.name}" dari katalog toko?`)) {
      deleteProduct(editingProduct.id);
      setEditingProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-emerald-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-amber-200" />
            <div>
              <h2 className="font-bold text-sm tracking-tight">Edit / Perbaiki Produk</h2>
              <p className="text-[11px] text-amber-100">Koreksi kesalahan harga, stok, atau deskripsi</p>
            </div>
          </div>
          <button
            onClick={() => setEditingProduct(null)}
            aria-label="Tutup edit"
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Photo Preview & Change */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">Foto Produk</label>
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border border-gray-300">
                  <span>Ganti Foto dari File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  placeholder="URL Foto..."
                  className="w-full border border-gray-300 rounded px-2 py-1 text-[11px] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Tanaman & Flora">Tanaman &amp; Flora</option>
                <option value="Perkakas">Perkakas</option>
                <option value="Rumah Tangga">Rumah Tangga</option>
                <option value="Kemasan & Packaging">Kemasan &amp; Packaging</option>
                <option value="Fashion Pria">Fashion Pria</option>
                <option value="Kesehatan & Bayi">Kesehatan &amp; Bayi</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Sisa Stok</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Harga Jual (Rp)</label>
              <input
                type="number"
                min="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {price && (
                <p className="text-emerald-700 font-bold text-[10px] mt-0.5">
                  {formatRupiah(Number(price))}
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Harga Coret (Rp)</label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Varian Produk (pisahkan koma)
            </label>
            <input
              type="text"
              value={variantInput}
              onChange={(e) => setVariantInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">Deskripsi Produk</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-2.5 rounded-xl flex items-center space-x-1 border border-red-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Produk</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
