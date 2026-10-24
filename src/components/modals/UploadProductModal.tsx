import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check, Eye } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah } from '../../utils/shopCalculations';

export const UploadProductModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addProduct, showToast, profile } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tanaman & Flora');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [description, setDescription] = useState('');
  const [variantInput, setVariantInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isUploadModalOpen) return null;

  const sampleImages = [
    { label: 'Tanaman', url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80' },
    { label: 'Perkakas', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80' },
    { label: 'Rumah', url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=600&auto=format&fit=crop&q=80' },
    { label: 'Batik Hijau', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Kemasan', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setImagePreview(imageUrlInput.trim());
      setImageUrlInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nama produk wajib diisi';
    if (!price || Number(price) <= 0) newErrors.price = 'Harga wajib diisi dan lebih dari 0';
    if (!stock || Number(stock) < 0) newErrors.stock = 'Stok tidak valid';
    if (!description.trim()) newErrors.description = 'Deskripsi produk wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Mohon lengkapi kolom yang bertanda merah');
      return;
    }

    const finalImage =
      imagePreview ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

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

    addProduct({
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      description: description.trim(),
      images: [finalImage],
      shopName: profile.name || 'nirwanafloras...',
      shopBadge: 'Star+',
      location: 'Kota Bogor',
      variants,
      selectedVariant: variants[0]?.options?.[0] || undefined,
      isUserUploaded: true,
    });

    // Reset & Close
    setName('');
    setPrice('');
    setOriginalPrice('');
    setStock('20');
    setDescription('');
    setVariantInput('');
    setImagePreview('');
    setErrors({});
    setIsUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 className="font-bold text-sm tracking-tight">Upload Produk Baru</h2>
              <p className="text-[11px] text-emerald-200">KASAP_ID Seller Studio</p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            aria-label="Tutup form upload"
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Photo Uploader */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Foto Produk <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              Upload foto dari perangkatmu atau pilih foto sampel berkualitas tinggi.
            </p>

            <div className="flex items-start space-x-3">
              {/* Preview Box */}
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center overflow-hidden shrink-0 relative group">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-xs transition-opacity cursor-pointer"
                    >
                      Hapus
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 text-emerald-700">
                    <ImageIcon className="w-6 h-6 mx-auto opacity-70 mb-1" />
                    <span className="text-[10px] font-bold block leading-tight">Pilih Foto</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-2">
                <label className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer shadow-xs">
                  <span>Pilih dari Galeri / File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex space-x-1">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Atau tempel URL gambar..."
                    className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded-md text-[11px] cursor-pointer"
                  >
                    Gunakan
                  </button>
                </div>

                {/* Quick Samples */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-gray-400 self-center">Sampel:</span>
                  {sampleImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setImagePreview(s.url)}
                      className="text-[10px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Nama Produk <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Pupuk Organik Cair KASAP Premium 500ml"
              className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 ${
                errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.name}</p>}
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
              <label className="font-bold text-gray-800 block mb-1">
                Stok <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 ${
                  errors.stock ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'
                }`}
              />
              {errors.stock && <p className="text-rose-500 text-[10px] mt-0.5">{errors.stock}</p>}
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Harga Jual (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 85000"
                className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 ${
                  errors.price ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'
                }`}
              />
              {price && (
                <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">
                  {formatRupiah(Number(price))}
                </p>
              )}
              {errors.price && <p className="text-rose-500 text-[10px] mt-0.5">{errors.price}</p>}
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Harga Coret / Normal (Rp) <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Contoh: 120000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {originalPrice && (
                <p className="text-gray-400 text-[10px] mt-0.5">
                  {formatRupiah(Number(originalPrice))}
                </p>
              )}
            </div>
          </div>

          {/* Variants */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Pilihan Varian <span className="text-gray-400 font-normal">(pisahkan dengan koma)</span>
            </label>
            <input
              type="text"
              value={variantInput}
              onChange={(e) => setVariantInput(e.target.value)}
              placeholder="Contoh: Merah, Hijau, Biru ATAU 500 Gram, 1 Kg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Deskripsi Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan spesifikasi, keunggulan, bahan, dan cara penggunaan produk..."
              className={`w-full border rounded-lg p-2.5 text-xs outline-none focus:ring-2 ${
                errors.description ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {errors.description && <p className="text-rose-500 text-[10px] mt-0.5">{errors.description}</p>}
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center space-x-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan &amp; Tayangkan Produk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
