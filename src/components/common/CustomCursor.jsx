import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const checkIsMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isTouchMedia = window.matchMedia('(any-hover: none)').matches;
      return hasTouch || isTouchMedia;
    };

    const mobileCheck = checkIsMobile();
    setIsMobile(mobileCheck);

    if (settings.reducedMotion || mobileCheck) return;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [settings.reducedMotion]);

  if (settings.reducedMotion || isMobile) return null;

  return (
    <div
      className={`fixed pointer-events-none z-50 rounded-full transition-transform duration-150 ease-out -translate-x-1/2 -translate-y-1/2 border border-pink-500/50 ${
        isHovered
          ? 'w-8 h-8 bg-pink-500/10 scale-125'
          : 'w-5 h-5 bg-pink-500/5'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="absolute inset-0 m-auto w-1 h-1 bg-pink-500 rounded-full" />
    </div>
  );
}
