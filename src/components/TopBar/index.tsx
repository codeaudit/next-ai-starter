"use client";

import React, { useState } from "react";
import { User } from "lucide-react";

export interface TopBarProps {
  title: string;
  showVibeControl?: boolean;
  vibeLevel?: number;
  onVibeChange?: (value: number) => void;
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showVibeControl = false,
  vibeLevel = 50,
  onVibeChange,
  user = { name: "User", avatarUrl: "" },
}) => {
  const [sliderValue, setSliderValue] = useState(vibeLevel);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    onVibeChange?.(newValue);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      {/* Left section - Logo/Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">{title}</h1>
      </div>

      {/* Center section - Vibe Control */}
      <div className="flex-1 flex justify-center">
        {showVibeControl ? (
          <div className="flex flex-col items-center px-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 w-64">
            <div className="flex justify-between w-full mb-1">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Analytical</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Creative</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
              aria-label="Vibe Level"
            />
            <div className="text-center mt-1">
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                Vibe Level: {sliderValue}%
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Right section - User Menu */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-8 h-8 rounded-full" 
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <User className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
            </div>
          )}
          <span className="text-sm text-neutral-700 dark:text-neutral-300">{user.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 