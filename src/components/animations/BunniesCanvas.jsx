import React, { useRef, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export default function BunniesCanvas() {
  const canvasRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isTabVisible = !document.hidden;

    const mouse = { x: null, y: null, radius: 150 };

    const isLightMode = settings.theme === 'light' || (settings.theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
    const colorPalette = isLightMode
      ? ['#f472b6', '#38bdf8', '#c084fc', '#fbbf24']
      : ['#ffeaf5', '#bfeaff', '#dccbff', '#fff8e8'];

    class FloatingItem {
      constructor(type) {
        this.type = type;
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = isLightMode ? Math.random() * 0.35 + 0.2 : Math.random() * 0.35 + 0.15;
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.angularSpeed;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2.5;
            this.y -= (dy / dist) * force * 2.5;
          }
        }

        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.alpha;

        if (this.type === 'bubble') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(-this.size * 0.3, -this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = isLightMode ? 'rgba(255,255,255,0.8)' : '#ffffff';
          ctx.fill();
        } else if (this.type === 'sparkle') {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
            ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size / 3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size / 3));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const items = [];

    const init = () => {
      items.length = 0;
      const isSmallScreen = window.innerWidth < 768;
      const count = isSmallScreen ? 18 : 35;
      const types = ['bubble', 'sparkle', 'star'];
      for (let i = 0; i < count; i++) {
        items.push(new FloatingItem(types[i % types.length]));
      }
    };

    const animate = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isSmallScreen = window.innerWidth < 768;

      if (!isSmallScreen) {
        for (let a = 0; a < items.length; a++) {
          for (let b = a + 1; b < items.length; b++) {
            const dx = items[a].x - items[b].x;
            const dy = items[a].y - items[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              ctx.strokeStyle = isLightMode
                ? `rgba(236, 72, 153, ${(90 - dist) / 90 * 0.08})`
                : `rgba(255, 234, 245, ${(90 - dist) / 90 * 0.1})`;
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(items[a].x, items[a].y);
              ctx.lineTo(items[b].x, items[b].y);
              ctx.stroke();
            }
          }
        }
      }

      items.forEach((item) => {
        item.update();
        item.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };

    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(any-hover: none)').matches;
    };

    const isMobileDevice = isTouchDevice();

    const handleMouseMove = (e) => {
      if (isMobileDevice) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (!isMobileDevice) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (!isMobileDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.reducedMotion, settings.theme]);

  if (settings.reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
