import React from 'react';

/**
 * NexusCapFIN Brand Logo
 * Features:
 * - "N" Monogram with interlocking Nexus node
 * - Upward Capital Growth arrow (Cap)
 * - Modern fintech styling (FIN)
 */
export const NexusCapLogo = ({ size = 'md', showText = true, textClassName = '', className = '' }) => {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7 rounded-[7px]',
      svg: 'w-4 h-4',
      text: 'text-[15px]',
    },
    md: {
      box: 'w-8 h-8 rounded-[9px]',
      svg: 'w-5 h-5',
      text: 'text-[17px]',
    },
    lg: {
      box: 'w-10 h-10 rounded-[11px]',
      svg: 'w-6 h-6',
      text: 'text-[22px]',
    },
    xl: {
      box: 'w-12 h-12 rounded-[14px]',
      svg: 'w-7 h-7',
      text: 'text-[26px]',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Icon Mark */}
      <div
        className={`${currentSize.box} bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 flex items-center justify-center shadow-sm flex-shrink-0 relative overflow-hidden group`}
      >
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 pointer-events-none" />

        <svg
          viewBox="0 0 32 32"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`nexus-grad-${size}`} x1="7" y1="25" x2="25" y2="7" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#A5B4FC" />
              <stop offset="1" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Left vertical pillar */}
          <rect x="7" y="7" width="3.6" height="18" rx="1.8" fill="white" fillOpacity="0.95" />

          {/* Dynamic Nexus Diagonal Bar (N-stroke) */}
          <path
            d="M8.5 9L23.5 23"
            stroke={`url(#nexus-grad-${size})`}
            strokeWidth="3.6"
            strokeLinecap="round"
          />

          {/* Right vertical pillar */}
          <rect x="21.4" y="10.5" width="3.6" height="14.5" rx="1.8" fill="white" fillOpacity="0.95" />

          {/* Upward Capital Growth Vector (North-East Breakout Arrow) */}
          <path
            d="M18 6.5H25.5V14"
            stroke="#38BDF8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24.5 7.5L18.5 13.5"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Central Nexus Connection Node */}
          <circle cx="16" cy="16" r="2.2" fill="#38BDF8" />
          <circle cx="16" cy="16" r="1.1" fill="white" />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <span
          className={`font-bold tracking-tight text-gray-900 flex items-center ${currentSize.text} ${textClassName}`}
        >
          <span>Nexus</span>
          <span className="text-gray-700">Cap</span>
          <span className="text-indigo-600 font-extrabold ml-[1px]">FIN</span>
        </span>
      )}
    </div>
  );
};

export default NexusCapLogo;
