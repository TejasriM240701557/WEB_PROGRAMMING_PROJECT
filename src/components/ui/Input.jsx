import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  helperText,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#9298AD] select-none flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#9298AD] pointer-events-none flex items-center">
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-[#11131D] text-[#F5F7FF] placeholder-[#555C75] text-sm rounded-xl border border-white/10 px-4 py-2.5 transition-all duration-200 outline-none hover:border-white/20 focus:border-neon-violet focus:ring-1 focus:ring-neon-violet focus:bg-[#181B29] ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#9298AD]/70">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
