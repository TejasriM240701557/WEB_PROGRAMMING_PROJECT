import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'neon',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  tooltip,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none rounded-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090F]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 tracking-wide min-h-[32px]',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2 tracking-wide min-h-[38px]',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 tracking-wide font-semibold min-h-[44px]',
    icon: 'p-2 rounded-xl min-w-[36px] min-h-[36px] aspect-square',
    'icon-sm': 'p-1.5 rounded-lg min-w-[30px] min-h-[30px] aspect-square',
    'icon-lg': 'p-2.5 rounded-xl min-w-[42px] min-h-[42px] aspect-square',
  };

  const variantStyles = {
    // Primary signature neon action with violet-to-cyan gradient and luminous edge
    neon: 'bg-gradient-to-r from-neon-violet via-neon-cyan to-neon-cyan text-white shadow-glow-violet/25 hover:shadow-glow-cyan/40 hover:brightness-110 active:brightness-95 font-semibold border border-white/20',
    primary: 'bg-gradient-to-r from-neon-violet to-neon-cyan text-white shadow-glow-violet/25 hover:shadow-glow-cyan/40 hover:brightness-110 active:brightness-95 font-semibold border border-white/20',
    
    // Secondary elevated dark surface with subtle luminous border
    secondary: 'bg-[#121624] hover:bg-[#1A2033] text-[#F5F7FF] border border-white/10 hover:border-white/20 shadow-sm hover:shadow-glow-violet/10',
    
    // Minimal ghost action
    ghost: 'bg-transparent hover:bg-white/5 text-[#9298AD] hover:text-[#F5F7FF] border border-transparent',
    
    // Restrained destructive action for irreversible operations
    destructive: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 hover:border-rose-500/40 shadow-sm',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 hover:border-rose-500/40 shadow-sm',
    
    // Specialized accent variants
    violet: 'bg-neon-violet/15 hover:bg-neon-violet/25 text-neon-violet border border-neon-violet/30 hover:shadow-glow-violet/30',
    cyan: 'bg-neon-cyan/15 hover:bg-neon-cyan/25 text-neon-cyan border border-neon-cyan/30 hover:shadow-glow-cyan/30',
    mint: 'bg-neon-mint/15 hover:bg-neon-mint/25 text-neon-mint border border-neon-mint/30 hover:shadow-glow-mint/30',
  };

  const disabledStyles =
    disabled || isLoading
      ? 'opacity-45 pointer-events-none cursor-not-allowed filter grayscale-[30%]'
      : 'cursor-pointer';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : tooltip)}
      title={tooltip}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.secondary} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={size === 'sm' || size === 'icon-sm' ? 14 : size === 'lg' || size === 'icon-lg' ? 18 : 16} className="shrink-0 transition-transform group-hover:scale-105" />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon size={size === 'sm' || size === 'icon-sm' ? 14 : size === 'lg' || size === 'icon-lg' ? 18 : 16} className="shrink-0 transition-transform group-hover:scale-105" />
          )}
        </>
      )}
    </button>
  );
};
