import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Image, CheckCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StatusBar } from '../StatusBar';

export const ChatDetailModal: React.FC = () => {
  const { activeChat, setActiveChat, sendChatMessage, showToast } = useShop();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  if (!activeChat) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(activeChat.id, inputText.trim());
    setInputText('');
  };

  const quickQuestions = [
    'Apakah produk ini masih ready?',
    'Bisa dikirim hari ini kak?',
    'Bisa minta rekomendasi varian terbaik?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col max-w-md mx-auto shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <StatusBar darkText={true} />
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveChat(null)}
              aria-label="Kembali"
              className="p-1 -ml-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-rose-500" />
            </button>

            <div className="relative">
              <img
                src={activeChat.avatar}
                alt={activeChat.storeName}
                className="w-9 h-9 rounded-full object-cover border border-gray-100"
              />
              {activeChat.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-bold text-xs text-gray-900">{activeChat.storeName}</h3>
                {activeChat.badge && (
                  <span className="text-[8px] bg-red-500 text-white font-black px-1 rounded">
                    {activeChat.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-emerald-700 font-medium">
                {activeChat.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {/* Safety Notice */}
        <div className="bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-center text-[11px] leading-relaxed">
          <span className="font-bold">Tips Keamanan:</span> Jangan pernah bertransaksi di luar aplikasi KASAP_ID untuk perlindungan garansi penuh.
        </div>

        {activeChat.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-xs leading-relaxed ${
                  isMe
                    ? 'bg-emerald-700 text-white rounded-br-xs'
                    : 'bg-white text-gray-800 rounded-bl-xs border border-gray-100'
                }`}
              >
                <p>{msg.text}</p>
                <div
                  className={`flex items-center justify-end space-x-1 mt-1 text-[9px] ${
                    isMe ? 'text-emerald-200' : 'text-gray-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Chips */}
      <div className="px-3 py-1.5 bg-gray-50 flex space-x-1.5 overflow-x-auto border-t border-gray-100 no-scrollbar">
        {quickQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => sendChatMessage(activeChat.id, q)}
            className="text-[10px] bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-100 p-2.5 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => showToast('Kirim foto/lampiran')}
          className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-full cursor-pointer"
        >
          <Image className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan untuk penjual..."
          className="flex-1 bg-gray-100 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
