import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatRupiah, SHOP_INFO } from '../../utils/shopCalculations';

export const UploadProductModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addProduct, showToast, profile } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Bunga');
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
    { label: 'Buket Mawar', url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80' },
    { label: 'Bunga Segar', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80' },
    { label: 'Papan Bunga', url: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&auto=format&fit=crop&q=80' },
    { label: 'Tanaman Hias', url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80' },
    { label: 'Buket Wisuda', url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=600&auto=format&fit=crop&q=80' },
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
        if (typeof reader.result === 'string') setImagePreview(reader.result);
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
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80';

    const variants = variantInput.trim()
      ? [{ name: 'Pilihan', options: variantInput.split(',').map((v) => v.trim()).filter(Boolean) }]
      : [];

    addProduct({
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      description: description.trim(),
      images: [finalImage],
      // FIX: alamat & nama toko sudah benar, tidak lagi Kota Bogor / nirwanafloras...
      shopName: SHOP_INFO.name,
      shopBadge: 'Star+',
      location: SHOP_INFO.location,
      variants,
      selectedVariant: variants[0]?.options?.[0] || undefined,
      isUserUploaded: true,
    });

    setName('');
    setPrice('');
    setOriginalPrice('');
    setStock('20');
    setDescription('');
    setVariantInput('');
    setImagePreview('');
    setErrors({});
    setIsUploadModalOpen(false);
    showToast('Produk berhasil ditambahkan!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 className="font-bold text-sm tracking-tight">Upload Produk Baru</h2>
              <p className="text-[11px] text-emerald-200">{SHOP_INFO.name} • {SHOP_INFO.location}</p>
            </div>
          </div>
          <button onClick={() => setIsUploadModalOpen(false)} aria-label="Tutup form upload" className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Foto Produk <span className="text-rose-500">*</span></label>
            <p className="text-[11px] text-gray-500 mb-2">Upload foto dari perangkatmu atau pilih foto sampel bunga.</p>
            <div className="flex items-start space-x-3">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center overflow-hidden shrink-0 relative group">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImagePreview('')} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-xs transition-opacity cursor-pointer">Hapus</button>
                  </>
                ) : (
                  <div className="text-center p-2 text-emerald-700">
                    <ImageIcon className="w-6 h-6 mx-auto opacity-70 mb-1" />
                    <span className="text-[10px] font-bold block leading-tight">Pilih Foto</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer shadow-xs">
                  <span>Pilih dari Galeri / File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <div className="flex space-x-1">
                  <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Atau tempel URL gambar..." className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-emerald-500" />
                  <button type="button" onClick={handleApplyUrl} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded-md text-[11px] cursor-pointer">Gunakan</button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-gray-400 self-center">Sampel:</span>
                  {sampleImages.map((s) => (
                    <button key={s.label} type="button" onClick={() => setImagePreview(s.url)} className="text-[10px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded cursor-pointer">{s.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Nama Produk <span className="text-rose-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Buket Mawar Merah 10 Tangkai" className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 ${errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'}`} />
            {errors.name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="Bunga">Bunga</option>
                <option value="Buket Bunga">Buket Bunga</option>
                <option value="Papan Bunga">Papan Bunga</option>
                <option value="Tanaman Hias">Tanaman Hias</option>
                <option value="Tanaman & Flora">Tanaman &amp; Flora</option>
                <option value="Hadiah & Hampers">Hadiah &amp; Hampers</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-800 block mb-1">Stok <span className="text-rose-500">*</span></label>
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="20" className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 ${errors.stock ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'}`} />
              {errors.stock && <p className="text-rose-500 text-[10px] mt-0.5">{errors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Harga Jual (Rp) <span className="text-rose-500">*</span></label>
              <input type="number" min="1000" step="500" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Contoh: 75000" className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 ${errors.price ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'}`} />
              {price && <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">{formatRupiah(Number(price))}</p>}
              {errors.price && <p className="text-rose-500 text-[10px] mt-0.5">{errors.price}</p>}
            </div>
            <div>
              <label className="font-bold text-gray-800 block mb-1">Harga Coret / Normal (Rp) <span className="text-gray-400 font-normal">(opsional)</span></label>
              <input type="number" min="0" step="500" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Contoh: 120000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
              {originalPrice && <p className="text-gray-400 text-[10px] mt-0.5">{formatRupiah(Number(originalPrice))}</p>}
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Pilihan Varian <span className="text-gray-400 font-normal">(pisahkan dengan koma)</span></label>
            <input type="text" value={variantInput} onChange={(e) => setVariantInput(e.target.value)} placeholder="Contoh: Merah, Putih, Pink ATAU 10 Tangkai, 20 Tangkai" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Deskripsi Lengkap <span className="text-rose-500">*</span></label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Jelaskan jenis bunga, jumlah tangkai, ukuran buket, dan pengiriman dari Gapura..." className={`w-full border rounded-lg p-2.5 text-xs outline-none focus:ring-2 ${errors.description ? 'border-rose-400 focus:ring-rose-400' : 'border-gray-300 focus:ring-emerald-500'}`} />
            {errors.description && <p className="text-rose-500 text-[10px] mt-0.5">{errors.description}</p>}
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 text-[11px] text-emerald-800">
            Toko: <b>{SHOP_INFO.name}</b> • Lokasi: {SHOP_INFO.location} • Harga akan tampil sebagai {price ? formatRupiah(Number(price)) : 'Rp0'}
          </div>

          <div className="pt-2 flex items-center space-x-2 border-t border-gray-100">
            <button type="button" onClick={() => setIsUploadModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl cursor-pointer">Batal</button>
            <button type="submit" className="flex-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-1.5">
              <Check className="w-4 h-4" />
              <span>Simpan &amp; Tayangkan Produk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};