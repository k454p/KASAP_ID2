import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  ChevronRight,
  Shield,
  MapPin,
  CreditCard,
  Bell,
  Lock,
  Globe,
  HelpCircle,
  FileText,
  Star,
  Info,
  UserX,
  LogOut,
  Plus,
  Trash2,
  Check,
  Building,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Search,
  ExternalLink,
  Camera,
  Upload,
  Share2,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StatusBar } from '../StatusBar';
import { UserAddress } from '../../types';
import { calculateScaledDimensions } from '../../utils/shopCalculations';

type SettingsSubView =
  | 'main'
  | 'keamanan'
  | 'alamat'
  | 'tambah_alamat'
  | 'rekening'
  | 'pengaturan_chat'
  | 'pengaturan_pesanan'
  | 'pengaturan_notifikasi'
  | 'pengaturan_privasi'
  | 'pengguna_diblokir'
  | 'bahasa'
  | 'pusat_bantuan'
  | 'peraturan_komunitas'
  | 'kebijakan'
  | 'nilai_kami'
  | 'informasi'
  | 'hapus_akun'
  | 'ganti_akun';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  holderName: string;
  isPrimary: boolean;
}

export const PengaturanAkunModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    setIsShareModalOpen,
    addresses,
    addAddress,
    deleteAddress,
    setPrimaryAddress,
    profile,
    updateProfile,
    setActiveChat,
    chats,
    showToast,
  } = useShop();

  const [activeSubView, setActiveSubView] = useState<SettingsSubView>('main');

  // Address form
  const [newLabel, setNewLabel] = useState('Rumah');
  const [newRecipient, setNewRecipient] = useState(profile.name);
  const [newPhone, setNewPhone] = useState(profile.phone);
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newCity, setNewCity] = useState('Kota Bogor');
  const [newPostalCode, setNewPostalCode] = useState('16128');

  // Bank accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'bank-1',
      bankName: 'BCA (Bank Central Asia)',
      accountNumber: '8820****1920',
      holderName: profile.name.toUpperCase(),
      isPrimary: true,
    },
    {
      id: 'bank-2',
      bankName: 'Bank Mandiri',
      accountNumber: '1330****4412',
      holderName: profile.name.toUpperCase(),
      isPrimary: false,
    },
  ]);
  const [newBankName, setNewBankName] = useState('BCA (Bank Central Asia)');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newHolderName, setNewHolderName] = useState(profile.name);

  // Settings Toggles
  const [chatSettings, setChatSettings] = useState({
    autoReply: true,
    promoChat: true,
    sound: true,
  });

  const [orderSettings, setOrderSettings] = useState({
    autoConfirm: true,
    paymentReminder: true,
    courierUpdates: true,
  });

  const [notifSettings, setNotifSettings] = useState({
    push: true,
    email: true,
    sms: false,
    flashSale: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    hidePurchaseActivity: false,
    publicProfile: true,
    allowContactSync: false,
  });

  // Language
  const [selectedLanguage, setSelectedLanguage] = useState<'id' | 'en'>('id');

  // Rating
  const [userRating, setUserRating] = useState(5);
  const [userFeedback, setUserFeedback] = useState('Aplikasi KASAP_ID sangat mudah digunakan dan pengiriman cepat!');

  if (!isSettingsModalOpen) return null;

  const handleSettingsAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

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
            showToast('Foto profil dari HP berhasil disimpan!');
          } else {
            updateProfile({ avatar: rawDataUrl });
            showToast('Foto profil berhasil diubah!');
          }
        } catch {
          updateProfile({ avatar: rawDataUrl });
          showToast('Foto profil berhasil diubah!');
        }
      };
      img.onerror = () => {
        showToast('Gagal memproses gambar');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newPhone.trim() || !newFullAddress.trim()) {
      showToast('Lengkapi data penerima dan alamat lengkap');
      return;
    }

    addAddress({
      label: newLabel,
      recipientName: newRecipient.trim(),
      phone: newPhone.trim(),
      fullAddress: newFullAddress.trim(),
      city: newCity.trim(),
      postalCode: newPostalCode.trim(),
      isPrimary: addresses.length === 0,
    });

    setActiveSubView('alamat');
    setNewFullAddress('');
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountNumber.trim()) {
      showToast('Masukkan nomor rekening bank');
      return;
    }
    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName,
      accountNumber: `${newAccountNumber.slice(0, 4)}****${newAccountNumber.slice(-4) || '9999'}`,
      holderName: (newHolderName || profile.name).toUpperCase(),
      isPrimary: false,
    };
    setBankAccounts([...bankAccounts, newBank]);
    setNewAccountNumber('');
    showToast('Rekening bank berhasil ditambahkan!');
  };

  const handleHeaderChat = () => {
    setIsSettingsModalOpen(false);
    if (chats.length > 0) {
      setActiveChat(chats[0]);
    }
    showToast('Membuka Chat Layanan KASAP_ID...');
  };

  const getSubViewTitle = (): string => {
    switch (activeSubView) {
      case 'alamat':
        return 'Alamat Saya';
      case 'tambah_alamat':
        return 'Tambah Alamat Baru';
      case 'keamanan':
        return 'Keamanan & Akun';
      case 'rekening':
        return 'Kartu / Rekening Bank';
      case 'pengaturan_chat':
        return 'Pengaturan Chat';
      case 'pengaturan_pesanan':
        return 'Pengaturan Pesanan';
      case 'pengaturan_notifikasi':
        return 'Pengaturan Notifikasi';
      case 'pengaturan_privasi':
        return 'Pengaturan Privasi';
      case 'pengguna_diblokir':
        return 'Pengguna Diblokir';
      case 'bahasa':
        return 'Bahasa / Language';
      case 'pusat_bantuan':
        return 'Pusat Bantuan';
      case 'peraturan_komunitas':
        return 'Peraturan Komunitas';
      case 'kebijakan':
        return 'Kebijakan KASAP_ID';
      case 'nilai_kami':
        return 'Nilai KASAP_ID';
      case 'informasi':
        return 'Informasi Aplikasi';
      case 'hapus_akun':
        return 'Penghapusan Akun';
      case 'ganti_akun':
        return 'Ganti Akun / Keluar';
      default:
        return 'Pengaturan Akun';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col max-w-md mx-auto shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
      {/* Top Header matching Screenshots */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <StatusBar darkText={true} />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (activeSubView === 'tambah_alamat') {
                  setActiveSubView('alamat');
                } else if (activeSubView !== 'main') {
                  setActiveSubView('main');
                } else {
                  setIsSettingsModalOpen(false);
                }
              }}
              aria-label="Kembali"
              className="p-1 -ml-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-rose-500" />
            </button>
            <h1 className="font-bold text-base text-gray-900">{getSubViewTitle()}</h1>
          </div>

          <button
            onClick={handleHeaderChat}
            aria-label="Bantuan Chat"
            className="p-1 text-rose-500 hover:text-rose-600 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Settings Menu (Screenshot replica with ALL items working) */}
      {activeSubView === 'main' && (
        <div className="flex-1 bg-gray-50 pb-12 select-none">
          {/* Akun Saya */}
          <div className="mt-2">
            <div className="px-4 py-2 text-xs font-medium text-gray-400">Akun Saya</div>
            <div className="bg-white divide-y divide-gray-100 border-y border-gray-100">
              <div
                onClick={() => setActiveSubView('keamanan')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Keamanan &amp; Akun</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('alamat')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-800 font-medium">Alamat Saya</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    {addresses.length} Alamat
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('rekening')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-800 font-medium">Kartu / Rekening Bank</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    {bankAccounts.length} Rekening
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Pengaturan */}
          <div className="mt-4">
            <div className="px-4 py-2 text-xs font-medium text-gray-400">Pengaturan</div>
            <div className="bg-white divide-y divide-gray-100 border-y border-gray-100">
              <div
                onClick={() => setActiveSubView('pengaturan_chat')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Pengaturan Chat</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('pengaturan_pesanan')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Pengaturan Pesanan</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('pengaturan_notifikasi')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Pengaturan Notifikasi</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('pengaturan_privasi')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Pengaturan Privasi</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('pengguna_diblokir')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Pengguna Diblokir</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('bahasa')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <div>
                  <span className="text-xs text-gray-800 font-medium block">Bahasa / Language</span>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">
                    {selectedLanguage === 'id' ? 'Bahasa Indonesia' : 'English (US)'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bantuan */}
          <div className="mt-4">
            <div className="px-4 py-2 text-xs font-medium text-gray-400">Bantuan</div>
            <div className="bg-white divide-y divide-gray-100 border-y border-gray-100">
              <div
                onClick={() => setActiveSubView('pusat_bantuan')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Pusat Bantuan</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('peraturan_komunitas')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Peraturan Komunitas</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('kebijakan')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Kebijakan</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('nilai_kami')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Suka KASAP_ID? Nilai kami!</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => setActiveSubView('informasi')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Informasi</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsShareModalOpen(true);
                }}
                className="flex items-center justify-between px-4 py-3 cursor-pointer bg-emerald-50/70 hover:bg-emerald-100/70 active:bg-emerald-200/50"
              >
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs text-emerald-950 font-bold">Bagikan &amp; Download ke HP</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </div>

              <div
                onClick={() => setActiveSubView('hapus_akun')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-xs text-gray-800 font-medium">Ajukan Penghapusan Akun</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Logout Button (Screenshot 1 & 5) */}
          <div className="p-4 mt-2">
            <button
              onClick={() => setActiveSubView('ganti_akun')}
              className="w-full bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-300 text-gray-800 font-semibold text-xs py-3 rounded-lg shadow-xs cursor-pointer text-center"
            >
              Ganti Akun / Keluar
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-4">KASAP_ID v3.83.36</p>
          </div>
        </div>
      )}

      {/* 1. Alamat Saya Sub-View */}
      {activeSubView === 'alamat' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3">
          <button
            onClick={() => setActiveSubView('tambah_alamat')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Alamat Baru</span>
          </button>

          <div className="space-y-3 mt-3">
            {addresses.map((addr: UserAddress) => (
              <div
                key={addr.id}
                className={`bg-white rounded-xl p-3.5 shadow-xs border ${
                  addr.isPrimary ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-900">{addr.recipientName}</span>
                    <span className="text-xs text-gray-500">| {addr.phone}</span>
                  </div>
                  {addr.isPrimary && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Utama
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">{addr.fullAddress}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {addr.city}, {addr.postalCode} ({addr.label})
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-xs">
                  {!addr.isPrimary ? (
                    <button
                      onClick={() => setPrimaryAddress(addr.id)}
                      className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Jadikan Alamat Utama
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Alamat Pengiriman Utama</span>
                    </span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-red-600 hover:text-red-700 cursor-pointer flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Tambah Alamat Baru Sub-View */}
      {activeSubView === 'tambah_alamat' && (
        <form onSubmit={handleAddNewAddress} className="flex-1 bg-white p-4 space-y-3 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Label Alamat</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Contoh: Rumah, Kantor, Toko"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Nama Penerima</label>
            <input
              type="text"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              placeholder="Nama lengkap penerima"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Nomor Telepon</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Alamat Lengkap</label>
            <textarea
              rows={3}
              value={newFullAddress}
              onChange={(e) => setNewFullAddress(e.target.value)}
              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Kota Bogor"
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Kode Pos</label>
              <input
                type="text"
                value={newPostalCode}
                onChange={(e) => setNewPostalCode(e.target.value)}
                placeholder="16128"
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md cursor-pointer"
            >
              Simpan Alamat Baru
            </button>
          </div>
        </form>
      )}

      {/* 3. Keamanan & Akun Sub-View */}
      {activeSubView === 'keamanan' && (
        <div className="flex-1 bg-white p-4 space-y-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-950 flex items-start space-x-2.5">
            <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs">Akun Terlindungi</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Autentikasi dua faktor aktif. Data dilindungi enkripsi standar keamanan marketplace.
              </p>
            </div>
          </div>

          {/* Foto Profil Pengguna */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 text-[9px] font-black px-1 rounded shadow-xs">
                  PRO
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-800">Foto Profil Akun</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Dapat diganti foto lain dari galeri/kamera HP</p>
              </div>
            </div>

            <label className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center space-x-1.5 shadow-xs transition-all">
              <Camera className="w-3.5 h-3.5" />
              <span>Ganti Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSettingsAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Nama Toko / Profil</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Username KASAP_ID</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => updateProfile({ username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => updateProfile({ email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Nomor Handphone Terdaftar</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => updateProfile({ phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => {
              showToast('Perubahan data akun tersimpan.');
              setActiveSubView('main');
            }}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md cursor-pointer"
          >
            Simpan Perubahan Akun
          </button>
        </div>
      )}

      {/* 4. Kartu / Rekening Bank Sub-View */}
      {activeSubView === 'rekening' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-4 text-xs">
          <div className="space-y-2.5">
            <h3 className="font-bold text-gray-800">Rekening Bank Terdaftar</h3>
            {bankAccounts.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl p-3.5 shadow-xs border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{b.bankName}</h4>
                    <p className="text-gray-500 text-[11px] font-mono mt-0.5">{b.accountNumber}</p>
                    <p className="text-[10px] text-gray-400">a.n. {b.holderName}</p>
                  </div>
                </div>
                {b.isPrimary ? (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Utama
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setBankAccounts(
                        bankAccounts.map((item) => ({ ...item, isPrimary: item.id === b.id }))
                      );
                      showToast(`Rekening ${b.bankName} diatur sebagai utama.`);
                    }}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    Atur Utama
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Bank Form */}
          <form onSubmit={handleAddBank} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
            <h4 className="font-bold text-gray-900 text-xs">Tambah Rekening Bank Penarikan</h4>
            <div>
              <label className="text-gray-600 block mb-1">Nama Bank</label>
              <select
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white"
              >
                <option value="BCA (Bank Central Asia)">BCA (Bank Central Asia)</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="BRI (Bank Rakyat Indonesia)">BRI (Bank Rakyat Indonesia)</option>
                <option value="BNI (Bank Negara Indonesia)">BNI (Bank Negara Indonesia)</option>
                <option value="SeaBank">SeaBank Indonesia</option>
                <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Nomor Rekening</label>
              <input
                type="text"
                value={newAccountNumber}
                onChange={(e) => setNewAccountNumber(e.target.value)}
                placeholder="Contoh: 1234567890"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Nama Pemilik Rekening</label>
              <input
                type="text"
                value={newHolderName}
                onChange={(e) => setNewHolderName(e.target.value)}
                placeholder="Nama sesuai buku tabungan"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg shadow-xs cursor-pointer"
            >
              + Simpan Rekening Bank
            </button>
          </form>
        </div>
      )}

      {/* 5. Pengaturan Chat Sub-View */}
      {activeSubView === 'pengaturan_chat' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs select-none">
          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Balasan Cepat Otomatis (Auto-Reply)</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Kirim respons otomatis saat toko sedang offline</p>
              </div>
              <input
                type="checkbox"
                checked={chatSettings.autoReply}
                onChange={(e) => {
                  setChatSettings({ ...chatSettings, autoReply: e.target.checked });
                  showToast('Pengaturan Auto-Reply diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Terima Chat Promosi Penjual</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Izinkan penjual mengirim info diskon dan voucher baru</p>
              </div>
              <input
                type="checkbox"
                checked={chatSettings.promoChat}
                onChange={(e) => {
                  setChatSettings({ ...chatSettings, promoChat: e.target.checked });
                  showToast('Pengaturan Chat Promosi diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Suara Notifikasi Pesan Masuk</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Bunyikan nada dering notifikasi pesan KASAP_ID</p>
              </div>
              <input
                type="checkbox"
                checked={chatSettings.sound}
                onChange={(e) => {
                  setChatSettings({ ...chatSettings, sound: e.target.checked });
                  showToast('Pengaturan Suara Chat diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Pengaturan Pesanan Sub-View */}
      {activeSubView === 'pengaturan_pesanan' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs select-none">
          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Otomatis Konfirmasi Penerimaan Paket</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Konfirmasi selesai otomatis 2 hari setelah kurir tiba</p>
              </div>
              <input
                type="checkbox"
                checked={orderSettings.autoConfirm}
                onChange={(e) => {
                  setOrderSettings({ ...orderSettings, autoConfirm: e.target.checked });
                  showToast('Pengaturan Konfirmasi Otomatis diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Pengingat Batas Pembayaran</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Kirim pengingat 2 jam sebelum tagihan kedaluwarsa</p>
              </div>
              <input
                type="checkbox"
                checked={orderSettings.paymentReminder}
                onChange={(e) => {
                  setOrderSettings({ ...orderSettings, paymentReminder: e.target.checked });
                  showToast('Pengingat Pembayaran diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Pembaruan Kurir Real-Time</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Notifikasi tiap kali kurir sedang menuju alamat tujuan</p>
              </div>
              <input
                type="checkbox"
                checked={orderSettings.courierUpdates}
                onChange={(e) => {
                  setOrderSettings({ ...orderSettings, courierUpdates: e.target.checked });
                  showToast('Pengaturan Kurir diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Pengaturan Notifikasi Sub-View */}
      {activeSubView === 'pengaturan_notifikasi' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs select-none">
          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Notifikasi Push Aplikasi</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Status pesanan, chat, dan kiriman penting</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.push}
                onChange={(e) => {
                  setNotifSettings({ ...notifSettings, push: e.target.checked });
                  showToast('Notifikasi Push disimpan');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Notifikasi Melalui Email</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Invoice struk belanja dan ringkasan bulanan</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.email}
                onChange={(e) => {
                  setNotifSettings({ ...notifSettings, email: e.target.checked });
                  showToast('Notifikasi Email disimpan');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Pengingat Flash Sale &amp; Diskon Gajian</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Info voucher gratis ongkir dan diskon 50%</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.flashSale}
                onChange={(e) => {
                  setNotifSettings({ ...notifSettings, flashSale: e.target.checked });
                  showToast('Notifikasi Flash Sale disimpan');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. Pengaturan Privasi Sub-View */}
      {activeSubView === 'pengaturan_privasi' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs select-none">
          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Sembunyikan Riwayat Belanja</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Pesanan tidak terlihat di feed publik teman</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.hidePurchaseActivity}
                onChange={(e) => {
                  setPrivacySettings({ ...privacySettings, hidePurchaseActivity: e.target.checked });
                  showToast('Pengaturan Privasi Riwayat disimpan');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Tampilkan Profil Toko ke Publik</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Memudahkan calon pembeli menemukan tokomu di KASAP_ID</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.publicProfile}
                onChange={(e) => {
                  setPrivacySettings({ ...privacySettings, publicProfile: e.target.checked });
                  showToast('Profil Publik disimpan');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div>
                <h4 className="font-bold text-gray-900">Sinkronisasi Kontak Buku Telepon</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Temukan teman dan kenalan yang berjualan di KASAP_ID</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.allowContactSync}
                onChange={(e) => {
                  setPrivacySettings({ ...privacySettings, allowContactSync: e.target.checked });
                  showToast('Pengaturan Kontak diperbarui');
                }}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. Pengguna Diblokir Sub-View */}
      {activeSubView === 'pengguna_diblokir' && (
        <div className="flex-1 bg-gray-50 p-6 text-center text-xs space-y-3">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <UserX className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Tidak Ada Pengguna Diblokir</h3>
          <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
            Pengguna atau toko yang kamu blokir tidak akan dapat mengirim pesan atau melihat profil tokomu.
          </p>
          <button
            onClick={() => setActiveSubView('main')}
            className="mt-3 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
          >
            Kembali ke Pengaturan
          </button>
        </div>
      )}

      {/* 10. Bahasa / Language Sub-View */}
      {activeSubView === 'bahasa' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs">
          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-200 shadow-xs">
            <div
              onClick={() => {
                setSelectedLanguage('id');
                showToast('Bahasa diubah ke Bahasa Indonesia');
              }}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-emerald-50/50"
            >
              <div>
                <h4 className="font-bold text-gray-900">Bahasa Indonesia</h4>
                <p className="text-[11px] text-gray-500">Bahasa resmi KASAP_ID Indonesia</p>
              </div>
              {selectedLanguage === 'id' && <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />}
            </div>

            <div
              onClick={() => {
                setSelectedLanguage('en');
                showToast('Language set to English (US)');
              }}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-emerald-50/50"
            >
              <div>
                <h4 className="font-bold text-gray-900">English (United States)</h4>
                <p className="text-[11px] text-gray-500">Global language interface</p>
              </div>
              {selectedLanguage === 'en' && <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />}
            </div>
          </div>
        </div>
      )}

      {/* 11. Pusat Bantuan Sub-View */}
      {activeSubView === 'pusat_bantuan' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-xl p-3.5 shadow-xs">
            <h3 className="font-bold text-sm">Pusat Bantuan KASAP_ID 24/7</h3>
            <p className="text-[11px] text-emerald-100 mt-1">
              Temukan jawaban cepat atau hubungi agen dukungan kami setiap saat.
            </p>
          </div>

          <div className="space-y-2">
            {[
              {
                q: 'Bagaimana cara upload produk baru di KASAP_ID?',
                a: 'Buka tab "Toko Saya" lalu klik tombol "+ Upload Produk Baru". Masukkan foto, nama produk, kategori, harga, dan stok lalu simpan.',
              },
              {
                q: 'Bagaimana cara edit produk jika ada kesalahan harga atau data?',
                a: 'Di tab "Toko Saya", cari produkmu lalu klik tombol "Edit". Ubah data yang ingin diperbaiki dan klik "Simpan Perubahan".',
              },
              {
                q: 'Bagaimana cara menggunakan voucher diskon?',
                a: 'Di halaman Keranjang atau Checkout, masukkan kode voucher promo (contoh: KASAPHIJAU) untuk menikmati diskon 20%.',
              },
              {
                q: 'Apakah pembayaran dengan KasapPay QRIS aman?',
                a: 'Sangat aman! Seluruh transaksi dilindungi enkripsi bank dan diawasi oleh regulator resmi Indonesia.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-xl p-3 border border-gray-200 shadow-xs cursor-pointer group"
              >
                <summary className="font-bold text-gray-800 flex justify-between items-center list-none">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-gray-600 text-[11px] leading-relaxed pt-2 border-t border-gray-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <button
            onClick={handleHeaderChat}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat dengan Tim Dukungan KASAP_ID</span>
          </button>
        </div>
      )}

      {/* 12. Peraturan Komunitas Sub-View */}
      {activeSubView === 'peraturan_komunitas' && (
        <div className="flex-1 bg-white p-4 space-y-3 text-xs leading-relaxed text-gray-700">
          <h3 className="font-bold text-sm text-gray-900 pb-1 border-b border-gray-100">
            Panduan &amp; Peraturan Komunitas KASAP_ID
          </h3>
          <p>
            KASAP_ID berkomitmen menciptakan ekosistem marketplace yang aman, transparan, dan saling menguntungkan bagi pembeli serta pelaku usaha mikro dan UMKM di seluruh Indonesia.
          </p>

          <div className="space-y-2 mt-2">
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900">1. Kejujuran Informasi Produk</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Penjual wajib mengunggah foto asli dan mencantumkan deskripsi barang yang akurat tanpa melebih-lebihkan kualitas.
              </p>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900">2. Larangan Produk Ilegal</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Dilarang memperjualbelikan zat berbahaya, senjata tajam tanpa izin, obat terlarang, atau barang tiruan yang melanggar hak cipta.
              </p>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900">3. Transaksi di Dalam Sistem</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Seluruh transaksi wajib diselesaikan melalui KASAP_ID agar terlindungi oleh garansi uang kembali dan proteksi kurir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 13. Kebijakan Sub-View */}
      {activeSubView === 'kebijakan' && (
        <div className="flex-1 bg-white p-4 space-y-3 text-xs leading-relaxed text-gray-700">
          <h3 className="font-bold text-sm text-gray-900 pb-1 border-b border-gray-100">
            Kebijakan Privasi &amp; Syarat Ketentuan
          </h3>
          <p>
            Dokumen ini mengatur bagaimana KASAP_ID mengumpulkan, menyimpan, dan melindungi informasi pribadi pengguna dalam penggunaan platform aplikasi.
          </p>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-[11px] text-emerald-950">
            <p>
              <b>Perlindungan Data:</b> KASAP_ID tidak akan pernah membagikan kata sandi, nomor rekening, atau rincian transaksi Anda kepada pihak ketiga tanpa izin.
            </p>
            <p>
              <b>Garansi Pengembalian:</b> Pembeli berhak mengajukan komplain atau retur barang dalam kurun waktu 48 jam setelah paket dinyatakan tiba di tujuan.
            </p>
          </div>
        </div>
      )}

      {/* 14. Suka KASAP_ID? Nilai kami! Sub-View */}
      {activeSubView === 'nilai_kami' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-4 text-xs">
          <div className="bg-white rounded-2xl p-6 text-center space-y-3 shadow-xs border border-gray-200">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 fill-amber-400 stroke-amber-400 text-amber-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">Nilai Pengalaman Belanjamu</h3>
              <p className="text-gray-500 text-[11px] mt-1">
                Ulasanmu sangat berharga untuk terus memajukan aplikasi KASAP_ID.
              </p>
            </div>

            {/* Star selector */}
            <div className="flex justify-center space-x-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      userRating >= star
                        ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="Tulis kritik atau saran untuk aplikasi KASAP_ID..."
              className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => {
                showToast(`Terima kasih atas penilaian ${userRating} Bintang untuk KASAP_ID! ⭐`);
                setActiveSubView('main');
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md cursor-pointer"
            >
              Kirim Penilaian
            </button>
          </div>
        </div>
      )}

      {/* 15. Informasi Sub-View */}
      {activeSubView === 'informasi' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <Info className="w-5 h-5 text-emerald-700" />
              <span>Tentang Aplikasi KASAP_ID</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              KASAP_ID adalah platform pasar elektronik (*e-commerce*) Indonesia yang dirancang ramah bagi pelaku usaha, petani tanaman hias, pedagang perkakas, dan masyarakat luas untuk berjualan serta berbelanja online secara praktis.
            </p>
          </div>

          <div className="bg-white rounded-xl divide-y divide-gray-100 border border-gray-200 shadow-xs">
            <div className="flex justify-between p-3">
              <span className="text-gray-500">Versi Aplikasi:</span>
              <span className="font-bold text-gray-800">3.83.36 (Build 2026.10)</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-gray-500">Tema Warna:</span>
              <span className="font-semibold text-emerald-700">Hijau Gradasi Putih</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-gray-500">Penyimpanan Lokal:</span>
              <span className="font-semibold text-gray-800">Aktif &amp; Terhubung</span>
            </div>
            <div className="flex justify-between p-3">
              <span className="text-gray-500">Lisensi Platform:</span>
              <span className="font-semibold text-gray-800">KASAP Indonesia</span>
            </div>
          </div>
        </div>
      )}

      {/* 16. Ajukan Penghapusan Akun Sub-View */}
      {activeSubView === 'hapus_akun' && (
        <div className="flex-1 bg-white p-4 space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs">Peringatan Penting</h4>
              <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                Penghapusan akun bersifat permanen. Riwayat pesanan, saldo KasapPay, dan toko produk Anda tidak akan dapat dipulihkan kembali.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-bold block">Pilih Alasan Penghapusan:</label>
            <select className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-xs">
              <option>Sudah jarang berbelanja online</option>
              <option>Ingin membuat akun KASAP_ID yang baru</option>
              <option>Masalah teknis atau privasi</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={() => setActiveSubView('main')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Batalkan
            </button>
            <button
              onClick={() => {
                showToast('Permintaan dibatalkan. Akun KASAP_ID Anda tetap aman.');
                setActiveSubView('main');
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* 17. Ganti Akun / Keluar Sub-View */}
      {activeSubView === 'ganti_akun' && (
        <div className="flex-1 bg-gray-50 p-4 space-y-3 text-xs select-none">
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Pilih Akun Masuk</h3>

            {/* Current Account */}
            <div className="p-3 border-2 border-emerald-500 bg-emerald-50/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{profile.name}</h4>
                  <p className="text-[11px] text-gray-500">{profile.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                Aktif
              </span>
            </div>

            {/* Alternate Demo Account */}
            <div
              onClick={() => {
                updateProfile({
                  name: 'KASAP Buyer (Ahmad)',
                  email: 'ahmad.buyer@gmail.com',
                  username: 'ahmad_kasap',
                });
                showToast('Beralih ke akun Ahmad!');
                setActiveSubView('main');
              }}
              className="p-3 border border-gray-200 hover:border-emerald-300 bg-gray-50 rounded-xl flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  AB
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">KASAP Buyer (Ahmad)</h4>
                  <p className="text-[11px] text-gray-500">ahmad.buyer@gmail.com</p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Ganti Akun</span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex space-x-2">
              <button
                onClick={() => setActiveSubView('main')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  showToast('Anda telah keluar dari sesi.');
                  setIsSettingsModalOpen(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
