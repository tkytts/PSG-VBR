import { useState } from "react";

export function useFontSize(initialSize = 16) {
  const [fontSize, setFontSize] = useState(initialSize);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  return { fontSize, increaseFontSize, decreaseFontSize };
}