/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { BottomNavigation } from './components/BottomNavigation';
import { SayaView } from './components/views/SayaView';
import { KeranjangView } from './components/views/KeranjangView';
import { NotifikasiView } from './components/views/NotifikasiView';
import { ChatView } from './components/views/ChatView';
import { BerandaView } from './components/views/BerandaView';
import { TokoSayaView } from './components/views/TokoSayaView';

// Modals
import { UploadProductModal } from './components/modals/UploadProductModal';
import { EditProductModal } from './components/modals/EditProductModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { ChatDetailModal } from './components/modals/ChatDetailModal';
import { OrdersHistoryModal } from './components/modals/OrdersHistoryModal';
import { PengaturanAkunModal } from './components/modals/PengaturanAkunModal';
import { ShareAppModal } from './components/modals/ShareAppModal';

import { Smartphone, Monitor, CheckCircle, Info, Share2, Download } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toastMessage,
    isShareModalOpen,
    setIsShareModalOpen,
    showToast,
  } = useShop();
  const [isChatOverlayOpen, setIsChatOverlayOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'full'>('mobile');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start text-gray-800 antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Desktop Helper Bar */}
      <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-emerald-900/30 px-4 py-2 flex items-center justify-between text-xs text-slate-300 z-40">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold tracking-wide text-white">
            KASAP<span className="text-emerald-400">_ID</span>
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            &bull; Marketplace Hijau Gradasi Putih
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-md text-[11px] shadow-xs transition-colors cursor-pointer"
            title="Bagikan link atau pasang aplikasi ke HP"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan &amp; Download HP</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'full' : 'mobile')}
            className="flex items-center space-x-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tampilan Lebar</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tampilan HP (Mobile)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container Frame */}
      <div
        className={`w-full ${
          viewMode === 'mobile'
            ? 'max-w-md my-0 sm:my-3 sm:rounded-[36px] sm:shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:border-[8px] sm:border-slate-800'
            : 'max-w-4xl my-0 sm:my-3 sm:rounded-2xl sm:shadow-2xl'
        } bg-white min-h-[92vh] flex flex-col relative overflow-hidden transition-all duration-300`}
      >
        {/* Hidden trigger to open chat tab or chat overlay */}
        <button
          id="chat-trigger-btn"
          onClick={() => setIsChatOverlayOpen(true)}
          className="hidden"
          aria-hidden="true"
        >
          Chat
        </button>

        {/* View Switcher based on active tab */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'beranda' && <BerandaView />}
          {activeTab === 'kelola' && <TokoSayaView />}
          {activeTab === 'keranjang' && <KeranjangView />}
          {activeTab === 'notifikasi' && <NotifikasiView />}
          {activeTab === 'saya' && <SayaView />}
        </main>

        {/* Separate Chat View when opened via top icon */}
        {isChatOverlayOpen && (
          <div className="fixed inset-0 z-40 max-w-md mx-auto bg-white flex flex-col">
            <ChatView />
            <button
              onClick={() => setIsChatOverlayOpen(false)}
              className="absolute top-2 right-3 z-30 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Floating Toast Message */}
        {toastMessage && (
          <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 text-xs font-medium border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modals */}
        <UploadProductModal />
        <EditProductModal />
        <ProductDetailModal />
        <CheckoutModal />
        <ChatDetailModal />
        <OrdersHistoryModal />
        <PengaturanAkunModal />
        <ShareAppModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          showToast={showToast}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
