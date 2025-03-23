"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";

export interface TopBarProps {
  title: string;
  showVibeControl?: boolean;
  vibeLevel?: number;
  onVibeChange?: (value: number) => void;
  user?: {
    name: string;
    avatarUrl?: string;
  };
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onHelpClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showVibeControl = false,
  vibeLevel = 50,
  onVibeChange,
  user = { name: "User", avatarUrl: "" },
  onSettingsClick,
  onLogoutClick,
  onHelpClick,
}) => {
  const [sliderValue, setSliderValue] = useState(vibeLevel);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    onVibeChange?.(newValue);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="flex items-center relative" ref={menuRef}>
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          onClick={toggleMenu}
        >
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

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                role="menuitem"
                onClick={() => {
                  onSettingsClick?.();
                  setMenuOpen(false);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                role="menuitem"
                onClick={() => {
                  onHelpClick?.();
                  setMenuOpen(false);
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </button>
              <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                role="menuitem"
                onClick={() => {
                  onLogoutClick?.();
                  setMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar; 