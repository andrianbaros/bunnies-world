import React from 'react';

export function SkeletonCard() {
  return (
    <div className="glass-surface p-6 rounded-2xl flex flex-col gap-4 animate-pulse border">
      <div className="w-full aspect-square bg-black/10 dark:bg-white/10 rounded-xl" />
      <div className="h-4 bg-black/10 dark:bg-white/10 rounded-md w-3/4" />
      <div className="h-3 bg-black/10 dark:bg-white/10 rounded-md w-1/2" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="flex flex-col gap-2 animate-pulse w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-black/10 dark:bg-white/10 rounded-md" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}
