import React from 'react';
import { Wifi, Signal, BatteryMedium } from 'lucide-react';

interface StatusBarProps {
  darkText?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ darkText = false }) => {
  return (
    <div
      className={`flex items-center justify-between px-5 pt-2 pb-1 text-xs select-none ${
        darkText ? 'text-gray-800' : 'text-white'
      }`}
    >
      <span className="font-semibold tracking-tight text-[13px]">02.45</span>
      <div className="flex items-center space-x-1.5 opacity-90">
        <span className="text-[10px] font-bold tracking-tighter">VoLTE1</span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <BatteryMedium className="w-4 h-4" />
          <span className="text-[11px] font-medium">83%</span>
        </div>
      </div>
    </div>
  );
};
