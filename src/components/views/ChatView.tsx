import React, { useState } from 'react';
import { ArrowLeft, CheckCheck, Search } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StatusBar } from '../StatusBar';
import { ChatConversation } from '../../types';

export const ChatView: React.FC = () => {
  const { chats, setActiveTab, setActiveChat } = useShop();
  const [filterTab, setFilterTab] = useState<'semua' | 'aktif'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((c) => {
    if (filterTab === 'aktif' && !c.isOnline) return false;
    if (searchQuery.trim()) {
      return (
        c.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-full pb-20 bg-white select-none text-gray-800">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <StatusBar darkText={true} />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('saya')}
              aria-label="Kembali"
              className="p-1 -ml-1 text-gray-700 hover:text-emerald-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-rose-500" />
            </button>
            <h1 className="font-bold text-base text-gray-900">Chat</h1>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 px-4 pb-2.5">
          <button
            onClick={() => setFilterTab('aktif')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              filterTab === 'aktif'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilterTab('semua')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              filterTab === 'semua'
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 border-b border-gray-50">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari chat atau toko..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-50">
        {filteredChats.map((chat: ChatConversation) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {/* Avatar & Online status */}
            <div className="relative shrink-0 mr-3">
              <img
                src={chat.avatar}
                alt={chat.storeName}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              {chat.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 truncate">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    {chat.storeName}
                  </span>
                  {chat.badge && (
                    <span
                      className={`text-[8px] font-black px-1 rounded ${
                        chat.badge === 'Official'
                          ? 'bg-gray-900 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {chat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                  {chat.lastMessageTime}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-1 text-xs text-gray-500 truncate">
                  <CheckCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{chat.lastMessage}</span>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
