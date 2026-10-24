import React, { useState, useRef } from 'react';
import {
  Settings,
  ShoppingCart,
  MessageCircle,
  CreditCard,
  Package,
  Truck,
  Star,
  Smartphone,
  UtensilsCrossed,
  Wallet,
  Coins,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Store,
  PlusCircle,
  CheckCircle2,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Check,
  RefreshCw,
  Share2,
  Download,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StatusBar } from '../StatusBar';
import { calculateScaledDimensions } from '../../utils/shopCalculations';

const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Wanita Profesional',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    label: 'Pria Bisnis',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    label: 'Kasual Ceria',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    label: 'Pria Kreatif',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-5',
    label: 'Owner Florist',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-6',
    label: 'Modern Tech',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  },
];

export const SayaView: React.FC = () => {
  const {
    profile,
    updateProfile,
    orders,
    cart,
    setActiveTab,
    setIsSettingsModalOpen,
    setIsUploadModalOpen,
    setIsShareModalOpen,
    setOrderFilterStatus,
    showToast,
  } = useShop();

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const dikemasCount = orders.filter((o) => o.status === 'dikemas').length;
  const dikirimCount = orders.filter((o) => o.status === 'dikirim').length;
  const penilaianCount = orders.filter((o) => o.status === 'penilaian').length;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        setIsUploading(false);
        showToast('Gagal membaca file gambar.');
        return;
      }

      // Resize/compress offscreen using canvas to keep localStorage safe and fast
      const img = new Image();
      img.onload = () => {
        try {
          const dims = calculateScaledDimensions(img.width, img.height, 400);
          const canvas = document.createElement('canvas');
          canvas.width = dims.width;
          canvas.height = dims.height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(img, 0, 0, dims.width, dims.height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            updateProfile({ avatar: compressed });
            showToast('Foto profil dari HP berhasil dipasang!');
          } else {
            updateProfile({ avatar: rawDataUrl });
            showToast('Foto profil dari HP berhasil dipasang!');
          }
        } catch {
          updateProfile({ avatar: rawDataUrl });
          showToast('Foto profil berhasil diubah!');
        } finally {
          setIsUploading(false);
          setIsAvatarModalOpen(false);
        }
      };

      img.onerror = () => {
        setIsUploading(false);
        showToast('Gagal memuat format gambar tersebut.');
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      setIsUploading(false);
      showToast('Gagal mengupload gambar.');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPresetAvatar = (url: string) => {
    updateProfile({ avatar: url });
    showToast('Foto profil berhasil diubah!');
    setIsAvatarModalOpen(false);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customAvatarUrl.trim();
    if (!trimmed) {
      showToast('Masukkan link URL gambar terlebih dahulu.');
      return;
    }
    updateProfile({ avatar: trimmed });
    showToast('Foto profil berhasil diperbarui dari URL!');
    setCustomAvatarUrl('');
    setIsAvatarModalOpen(false);
  };

  return (
    <div className="min-h-full pb-20 bg-gray-100 select-none text-gray-800">
      {/* Top Header with Green Gradient & Indonesian Motif */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 text-white pt-1 pb-6 px-4 rounded-b-2xl shadow-sm">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Status Bar */}
        <StatusBar darkText={false} />

        {/* Profile Card & Action Icons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            {/* Hidden file input for phone gallery/camera */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFileUpload}
              className="hidden"
              aria-label="Upload foto dari HP"
            />

            <div
              className="relative group cursor-pointer focus:outline-none"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Ketuk untuk ganti foto profil dari HP"
              role="button"
              tabIndex={0}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-white/90 shadow-md group-hover:brightness-95 active:scale-95 transition-all"
              />
              {/* PRO Badge on bottom right matching user screenshot */}
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 text-[9px] font-black px-1 rounded-sm shadow-xs border border-white/40">
                PRO
              </span>
              {/* Camera Badge to indicate editable from phone */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Ganti foto dari HP"
                className="absolute -bottom-1 -left-1 bg-emerald-800 text-white p-1 rounded-full shadow-md border border-white/80 hover:bg-emerald-700 active:scale-90 transition-transform flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-base tracking-tight leading-snug">{profile.name}</h1>
                <button
                  onClick={() => showToast(`Status Member: ${profile.membershipLevel} VIP`)}
                  className="bg-emerald-900/60 hover:bg-emerald-900/80 text-[11px] px-2 py-0.5 rounded-full flex items-center space-x-0.5 border border-emerald-400/30"
                >
                  <span className="text-amber-300 font-semibold">{profile.membershipLevel}</span>
                  <ChevronRight className="w-3 h-3 text-emerald-300" />
                </button>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {profile.followingCount} Mengikuti &nbsp;&bull;&nbsp; {profile.followersCount} Pengikut
              </p>
            </div>
          </div>

          {/* Top Right Icons */}
          <div className="flex items-center space-x-3 text-white">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              aria-label="Pengaturan Akun"
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('keranjang')}
              aria-label="Keranjang"
              className="relative p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                {totalCartCount > 99 ? '99+' : totalCartCount > 0 ? totalCartCount : '99+'}
              </span>
            </button>
            <button
              onClick={() => {
                // Switch to chat or open chat
                showToast('Membuka Chat KASAP_ID...');
                const elem = document.getElementById('chat-trigger-btn');
                if (elem) elem.click();
              }}
              aria-label="Pesan Chat"
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIP+ Banner */}
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-2.5 flex items-center justify-between text-amber-950 shadow-xs border border-amber-200/60">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
              VIP+
            </span>
            <span className="text-xs font-semibold">Dapatkan Extra Diskon 20% Setiap Hari</span>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-800" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-3 -mt-2 space-y-3">
        {/* Notification Permission Notice */}
        <div className="bg-white rounded-xl p-3 flex items-start justify-between shadow-xs border border-gray-100">
          <div className="flex items-start space-x-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Izinkan notifikasi untuk dapatkan info status pesanan, promo, dan info menarik lainnya.{' '}
              <button
                onClick={() => showToast('Notifikasi KASAP_ID aktif!')}
                className="text-emerald-700 font-semibold underline inline cursor-pointer"
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

        {/* Toko Saya / Kelola & Upload Produk Feature Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-xl p-3.5 shadow-xs border border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-sm font-bold text-emerald-950">Toko Saya</h2>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                  Aktif
                </span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5">Upload produk baru & edit produk kapan saja</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('kelola')}
              className="bg-white hover:bg-gray-50 text-emerald-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-300 shadow-xs cursor-pointer"
            >
              Kelola
            </button>
          </div>
        </div>

        {/* Pesanan Saya */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <h2 className="font-bold text-sm text-gray-900">Pesanan Saya</h2>
            <button
              onClick={() => setOrderFilterStatus('semua')}
              className="text-xs text-gray-500 hover:text-emerald-700 flex items-center cursor-pointer"
            >
              <span>Lihat Riwayat Pesanan</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 text-center">
            <button
              onClick={() => setOrderFilterStatus('belum_bayar')}
              className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <CreditCard className="w-6 h-6 text-gray-700" />
              <span className="text-[11px] text-gray-700 mt-1.5 font-medium">Belum Bayar</span>
            </button>

            <button
              onClick={() => setOrderFilterStatus('dikemas')}
              className="relative flex flex-col items-center justify-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Package className="w-6 h-6 text-gray-700" />
              {dikemasCount > 0 && (
                <span className="absolute top-1 right-4 min-w-[16px] h-4 px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {dikemasCount}
                </span>
              )}
              <span className="text-[11px] text-gray-700 mt-1.5 font-medium">Dikemas</span>
            </button>

            <button
              onClick={() => setOrderFilterStatus('dikirim')}
              className="relative flex flex-col items-center justify-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Truck className="w-6 h-6 text-gray-700" />
              {dikirimCount > 0 && (
                <span className="absolute top-1 right-4 min-w-[16px] h-4 px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {dikirimCount}
                </span>
              )}
              <span className="text-[11px] text-gray-700 mt-1.5 font-medium">Dikirim</span>
            </button>

            <button
              onClick={() => setOrderFilterStatus('penilaian')}
              className="relative flex flex-col items-center justify-center p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <Star className="w-6 h-6 text-gray-700" />
              {penilaianCount > 0 && (
                <span className="absolute top-1 right-4 min-w-[16px] h-4 px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {penilaianCount}
                </span>
              )}
              <span className="text-[11px] text-gray-700 mt-1.5 font-medium">Beri Penilaian</span>
            </button>
          </div>

          {/* Quick Rows */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2.5">
            <div
              onClick={() => showToast('Layanan Pulsa & Tagihan KASAP')}
              className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80"
            >
              <div className="flex items-center space-x-2.5">
                <Smartphone className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-medium text-gray-800">Pulsa, Tagihan & Tiket</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-rose-600 font-medium">
                <span>Diskon Rp125RB</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            <div
              onClick={() => showToast('Layanan KASAP Food - Pengantaran Cepat')}
              className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80"
            >
              <div className="flex items-center space-x-2.5">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium text-gray-800">KasapFood</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-emerald-700 font-semibold">
                <span>Gratis Ongkir</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Dompet Saya */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <h2 className="font-bold text-sm text-gray-900 pb-2">Dompet Saya</h2>
          <div className="grid grid-cols-4 gap-2 pt-2 text-center">
            <button
              onClick={() => showToast(`Saldo KasapPay: Rp${profile.kasapPayBalance.toLocaleString('id-ID')}`)}
              className="flex flex-col items-center justify-center p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                S
              </div>
              <span className="text-[11px] font-medium text-gray-800 mt-1.5">KasapPay</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Bayar QRIS</span>
            </button>

            <button
              onClick={() => showToast(`Koin KASAP: ${profile.koinKasap.toLocaleString('id-ID')} koin`)}
              className="relative flex flex-col items-center justify-center p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-red-500" />
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-gray-800 mt-1.5">Koin Kasap</span>
              <span className="text-[10px] text-rose-600 font-semibold">Klaim Bonus</span>
            </button>

            <button
              onClick={() => showToast(`Tersedia ${profile.vouchersCount} Voucher Diskon & Bebas Ongkir`)}
              className="relative flex flex-col items-center justify-center p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-red-500" />
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-gray-800 mt-1.5">Voucher Saya</span>
              <span className="text-[10px] text-rose-600 font-semibold">{profile.vouchersCount}+ Voucher</span>
            </button>

            <button
              onClick={() => showToast('Koin KASAP s.d 50RB')}
              className="flex flex-col items-center justify-center p-1 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-gray-800 mt-1.5">Koin s.d 50RB</span>
              <span className="text-[10px] text-emerald-700 font-semibold">App KasapPay</span>
            </button>
          </div>

          {/* KasapPinjam Promo Card */}
          <div className="mt-3 bg-red-50/70 border border-red-100 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="bg-red-600 text-white text-[10px] font-bold px-1 rounded-sm">Rp</span>
                <span className="text-xs font-bold text-red-900">KasapPinjam</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Dana Tunai s.d. 100JT dan Gratis 25RB Koin KASAP
              </p>
            </div>
            <button
              onClick={() => showToast('Fitur Pinjaman KASAP terverifikasi OJK')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer shrink-0"
            >
              Cek Limit
            </button>
          </div>
        </div>

        {/* Keuangan */}
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-2.5">
            <h2 className="font-bold text-sm text-gray-900">Keuangan</h2>
            <button
              onClick={() => showToast('Semua Produk Keuangan KASAP')}
              className="text-xs text-gray-500 hover:text-emerald-700 flex items-center cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div
              onClick={() => showToast('KasapLater: Beli sekarang bayar nanti')}
              className="border border-gray-100 rounded-xl p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-gray-800">KasapLater</span>
              </div>
              <p className="text-[11px] text-rose-500 font-medium mt-1">Limit Kedaluwarsa &gt;</p>
            </div>

            <div
              onClick={() => showToast('KasapPinjam: Tanpa biaya admin')}
              className="border border-gray-100 rounded-xl p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800">KasapPinjam</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1 line-clamp-1">Gratis Biaya Admin dan 25RB Koin &gt;</p>
            </div>

            <div
              onClick={() => showToast('SeaBank Mitra KASAP: Bunga tinggi & gratis transfer')}
              className="border border-gray-100 rounded-xl p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-gray-800">SeaBank</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1 line-clamp-1">Gratis Transfer Antar Bank &gt;</p>
            </div>

            <div
              onClick={() => showToast('Asuransi Perlindungan KASAP')}
              className="border border-gray-100 rounded-xl p-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800">Asuransi</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1 line-clamp-1">Dapatkan pertanggungan Rp1J... &gt;</p>
            </div>
          </div>
        </div>

        {/* Share & Download PWA Action Card */}
        <div className="pt-2">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-xs">Download &amp; Pasang di HP</h4>
                <p className="text-[11px] text-emerald-100/90">Bagikan link ke teman &amp; pasang ke layar HP</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="bg-white hover:bg-emerald-50 active:scale-95 text-emerald-900 font-extrabold text-xs px-3 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 flex items-center space-x-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>

        {/* Pengaturan Akun Entry Link */}
        <div className="pt-1">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Buka Pengaturan Akun</span>
          </button>
        </div>
      </div>

      {/* Ubah Foto Profil Modal / Bottom Sheet */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div
            className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-gray-900">Ganti Foto Profil</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
                />
                <span className="absolute -bottom-1 right-1 bg-amber-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
                  PRO
                </span>
              </div>
              <p className="font-bold text-sm text-gray-900 mt-2.5">{profile.name}</p>
              <p className="text-xs text-gray-500">Status Member: {profile.membershipLevel} VIP</p>
            </div>

            {/* Main Action: Upload from Phone */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses Foto HP...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Pilih Foto dari Galeri / Kamera HP</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                Pilih foto langsung dari galeri atau kamera handphone Anda (JPG, PNG, WEBP). Foto otomatis dioptimalkan agar jernih dan ringan.
              </p>
            </div>

            {/* Preset Avatars Selection */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-700 mb-2.5 flex items-center space-x-1">
                <span>Atau Pilih Avatar Favorit</span>
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_AVATARS.map((av) => {
                  const isCurrent = profile.avatar === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(av.url)}
                      className={`relative rounded-xl p-1.5 border transition-all flex flex-col items-center space-y-1 cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-12 h-12 rounded-full object-cover shadow-xs"
                      />
                      <span className="text-[10px] text-gray-700 font-medium text-center line-clamp-1">
                        {av.label}
                      </span>
                      {isCurrent && (
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-700 mb-2">Gunakan Link Foto (URL)</h4>
              <form onSubmit={handleApplyCustomUrl} className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://example.com/foto.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Terapkan
                </button>
              </form>
            </div>

            {/* Close Button */}
            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
