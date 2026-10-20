import React from 'react';

export const Badge = ({
  children,
  variant = 'violet',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantClasses = {
    violet: 'bg-neon-violet/10 text-neon-violet border-neon-violet/30',
    cyan: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
    mint: 'bg-neon-mint/10 text-neon-mint border-neon-mint/30',
    pink: 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
    amber: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    coral: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    neutral: 'bg-white/5 text-gray-300 border-white/10',
  };

  const dotColors = {
    violet: 'bg-neon-violet',
    cyan: 'bg-neon-cyan',
    mint: 'bg-neon-mint',
    pink: 'bg-neon-pink',
    amber: 'bg-amber-400',
    coral: 'bg-rose-400',
    neutral: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.neutral} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse-subtle ${dotColors[variant] || 'bg-current'}`}
        />
      )}
      {children}
    </span>
  );
};
