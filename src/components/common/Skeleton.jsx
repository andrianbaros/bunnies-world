import React from 'react';

export function SkeletonCard() {
  return (
    <div className="glass-surface p-6 rounded-3xl flex flex-col gap-4 animate-pulse">
      <div className="w-full aspect-square bg-white/10 rounded-2xl" />
      <div className="h-5 bg-white/10 rounded-md w-3/4" />
      <div className="h-3 bg-white/10 rounded-md w-1/2" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="flex flex-col gap-2 animate-pulse w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-white/10 rounded-md" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}
