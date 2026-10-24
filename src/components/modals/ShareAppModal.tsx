import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Smartphone,
  ExternalLink,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getPublicShareUrl, generateWhatsAppShareLink, generateTelegramShareLink } from '../../utils/shareUtils';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose, showToast }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'install'>('share');
  const { canInstall, isInstalled, isIOS, installApp } = usePWAInstall();

  if (!isOpen) return null;

  const shareUrl = getPublicShareUrl();

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      showToast('Link berhasil disalin! Siap dibagikan ke teman.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Gagal menyalin link otomatis.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KASAP_ID - Belanja & Jual Online',
          text: 'Yuk coba aplikasi KASAP_ID! Belanja hemat, upload produk sendiri, dan promo ongkir.',
          url: shareUrl,
        });
        showToast('Terima kasih sudah membagikan KASAP_ID!');
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleInstallClick = async () => {
    if (canInstall) {
      const accepted = await installApp();
      if (accepted) {
        showToast('KASAP_ID berhasil diinstal ke layar HP Anda!');
        onClose();
      }
    } else {
      setActiveTab('install');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Bagikan & Download Aplikasi</h3>
              <p className="text-[11px] text-gray-500">KASAP_ID siap dipakai publik di HP</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mt-3">
          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'share'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke Teman</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'install'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cara Download di HP</span>
          </button>
        </div>

        {activeTab === 'share' ? (
          <div className="pt-4 space-y-4">
            {/* App Card Banner */}
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-4 text-white shadow-sm flex items-center space-x-3.5">
              <img
                src="/icon.svg"
                alt="KASAP_ID Icon"
                className="w-13 h-13 rounded-xl bg-white p-1 shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-black text-sm">KASAP_ID</h4>
                  <span className="bg-amber-400 text-emerald-950 font-black text-[9px] px-1 rounded">
                    PUBLIK
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-tight mt-0.5 line-clamp-2">
                  Marketplace hijau gradasi putih. Buka di HP, belanja & upload produk online.
                </p>
              </div>
            </div>

            {/* Public URL Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Link URL Aplikasi untuk Dibagikan:
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-800 font-mono select-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-gray-700">Kirim Langsung Lewat:</span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={generateWhatsAppShareLink(shareUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={generateTelegramShareLink(shareUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
              </div>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Buka Menu Bagikan Bawaan HP</span>
                </button>
              )}
            </div>

            {/* Install Banner Prompt */}
            {!isInstalled && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Download className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-emerald-950">Pasang di Layar HP</h5>
                    <p className="text-[11px] text-gray-600">Bisa dibuka langsung tanpa buka browser lagi</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs cursor-pointer shrink-0"
                >
                  {canInstall ? 'Install Sekarang' : 'Lihat Cara'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Cara Download di HP */
          <div className="pt-4 space-y-4 text-xs text-gray-700">
            {canInstall && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-black text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Klik di Sini: Install Aplikasi KASAP_ID ke HP</span>
              </button>
            )}

            {isInstalled ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
                <Check className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <h4 className="font-bold text-xs text-emerald-950">Aplikasi Sudah Terpasang di HP!</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Anda sedang membuka KASAP_ID dalam mode aplikasi mandiri (standalone).
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Android Guide */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/70">
                  <div className="flex items-center space-x-2 mb-2 font-bold text-xs text-gray-900">
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span>Untuk Pengguna HP Android (Chrome / Samsung)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-gray-600 pl-1 leading-relaxed">
                    <li>Buka link aplikasi di browser Google Chrome pada HP.</li>
                    <li>
                      Ketuk ikon <strong>titik tiga (⋮)</strong> di pojok kanan atas browser.
                    </li>
                    <li>
                      Pilih menu <strong>"Instal aplikasi"</strong> atau{' '}
                      <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong>.
                    </li>
                    <li>
                      Ketuk <strong>"Instal"</strong>. Ikon <strong>KASAP_ID</strong> akan langsung
                      muncul di layar HP Anda layaknya aplikasi Play Store!
                    </li>
                  </ol>
                </div>

                {/* iPhone / iOS Guide */}
                <div className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/70">
                  <div className="flex items-center space-x-2 mb-2 font-bold text-xs text-gray-900">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Untuk Pengguna iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-gray-600 pl-1 leading-relaxed">
                    <li>Buka link aplikasi menggunakan browser <strong>Safari</strong>.</li>
                    <li>
                      Ketuk tombol <strong>Bagikan (Share)</strong> (ikon kotak dengan panah ke atas{' '}
                      <span className="font-mono text-gray-800 font-bold">📤</span> di bilah bawah).
                    </li>
                    <li>
                      Gulir ke bawah dan ketuk <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home
                      Screen).
                    </li>
                    <li>
                      Ketuk <strong>"Tambah"</strong> di pojok kanan atas layar. Selesai!
                    </li>
                  </ol>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2 text-amber-900 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Kelebihan Download via PWA:</strong> Tidak perlu repot unduh file APK atau login Play Store. Aplikasi berjalan cepat, ukuran sangat hemat kuota (&lt; 2 MB), dan selalu update otomatis.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
