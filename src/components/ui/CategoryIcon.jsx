import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

export const CategoryIcon = ({
  categoryKey,
  iconName,
  color,
  size = 18,
  className = '',
  containerClassName = '',
}) => {
  const cat = CATEGORIES[categoryKey];
  const targetIcon = iconName || cat?.icon || 'Package';
  const targetColor = color || cat?.color || '#A855F7';
  const bgSoft = cat?.bgSoft || 'rgba(168, 85, 247, 0.12)';

  // Lookup the Lucide icon dynamically
  const IconComponent = LucideIcons[targetIcon] || LucideIcons.Package;

  return (
    <div
      className={`flex items-center justify-center rounded-xl transition-transform duration-200 ${containerClassName}`}
      style={{
        backgroundColor: bgSoft,
        border: `1px solid ${targetColor}33`,
      }}
    >
      <IconComponent size={size} style={{ color: targetColor }} className={className} />
    </div>
  );
};
