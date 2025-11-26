"use client";

import { Minus, X, Pin, PinOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";

declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      toggleAlwaysOnTop: () => Promise<boolean>;
    };
  }
}

export function WindowControls() {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  const handleToggleAlwaysOnTop = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.toggleAlwaysOnTop();
      setIsAlwaysOnTop(result);
    }
  };

  // 检查是否在 Electron 环境中
  const isElectron = typeof window !== "undefined" && !!window.electronAPI;

  if (!isElectron) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleAlwaysOnTop}
        className="h-6 w-6 p-0"
        title={isAlwaysOnTop ? "取消置顶" : "置顶"}
      >
        {isAlwaysOnTop ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMinimize}
        className="h-6 w-6 p-0"
        title="最小化"
      >
        <Minus className="w-3 h-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        title="关闭"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

