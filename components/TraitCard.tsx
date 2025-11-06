import React from 'react';
import type { ChoiceItem } from '../types';

interface ChoiceCardProps {
  item: ChoiceItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectionColor?: 'cyan' | 'amber' | 'green' | 'brown';
  layout?: 'vertical' | 'horizontal' | 'horizontal-tall';
  imageShape?: 'rect' | 'circle';
  aspect?: 'square';
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({ item, isSelected, onSelect, disabled = false, selectionColor = 'cyan', layout = 'vertical', imageShape = 'rect', aspect }) => {
  const { id, title, cost, description, imageSrc } = item;

  const isGain = cost && (cost.toLowerCase().includes('grants') || cost.toLowerCase().includes('+'));
  const costColor = isGain ? 'text-green-400' : 'text-red-400';

  const colorThemes = {
    cyan: {
        border: 'border-cyan-400',
        ring: 'ring-cyan-400',
        hover: 'hover:border-cyan-300/70',
        ringHover: 'group-hover:ring-cyan-300/70',
        bg: 'bg-slate-900/80'
    },
    amber: {
        border: 'border-amber-400',
        ring: 'ring-amber-400',
        hover: 'hover:border-amber-300/70',
        ringHover: 'group-hover:ring-amber-300/70',
        bg: 'bg-slate-900/80'
    },
    green: {
        border: 'border-green-400',
        ring: 'ring-green-400',
        hover: 'hover:border-green-300/70',
        ringHover: 'group-hover:ring-green-300/70',
        bg: 'bg-slate-900/80'
    },
    brown: {
        border: 'border-yellow-700',
        ring: 'ring-yellow-700',
        hover: 'hover:border-yellow-600/70',
        ringHover: 'group-hover:ring-yellow-600/70',
        bg: 'bg-[#4a2e1d]/80'
    }
  };
  const currentTheme = colorThemes[selectionColor] || colorThemes.cyan;

  const borderClass = isSelected 
    ? `border-2 ${currentTheme.border}` 
    : `border border-gray-800 ${currentTheme.hover}`;
  
  const interactionClass = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer transition-colors';

  if (layout === 'horizontal-tall') {
    return (
      <div
        className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-3 flex flex-row items-start gap-4 h-full text-left border ${borderClass} ${interactionClass}`}
        onClick={() => !disabled && onSelect(id)}
        aria-disabled={disabled}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        <img src={imageSrc} alt={title} className="w-28 h-48 object-cover rounded-md flex-shrink-0" />
        <div className="flex flex-col justify-start pt-2">
          <h4 className="font-bold font-cinzel text-white text-base">{title}</h4>
          {cost && cost.trim() && <p className={`text-xs font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>}
          <p className="text-sm text-gray-400 leading-snug mt-1 whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    );
  }
    
  if (layout === 'horizontal') {
    return (
      <div
        className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-3 flex flex-row items-start gap-4 h-full text-left border ${borderClass} ${interactionClass}`}
        onClick={() => !disabled && onSelect(id)}
        aria-disabled={disabled}
        role="button"
        tabIndex={disabled ? -1 : 0}
      >
        <img src={imageSrc} alt={title} className={`w-32 h-24 object-contain bg-black/20 flex-shrink-0 ${imageShape === 'circle' ? 'rounded-full' : 'rounded-md'}`} />
        <div className="flex flex-col justify-center">
          <h4 className="font-bold font-cinzel text-white">{title}</h4>
          {cost && cost.trim() && <p className={`text-xs font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>}
          <p className="text-sm text-gray-400 leading-snug mt-1 whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    );
  }

  // Vertical layout
  const imageRingClass = isSelected ? `ring-2 ${currentTheme.ring}` : `ring-1 ring-gray-700/50 ${currentTheme.ringHover}`;

  return (
    <div
      className={`${currentTheme.bg} backdrop-blur-sm rounded-lg p-2 sm:p-4 flex flex-col h-full text-center border ${borderClass} ${interactionClass} ${aspect === 'square' ? 'aspect-square' : ''}`}
      onClick={() => !disabled && onSelect(id)}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {imageShape === 'circle' ? (
        <div className={`p-1 rounded-full mx-auto mb-2 sm:mb-4 transition-all ${imageRingClass}`}>
          <img src={imageSrc} alt={title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full" />
        </div>
      ) : (
        <img src={imageSrc} alt={title} className={`w-full ${aspect === 'square' ? 'flex-grow min-h-0' : 'h-48'} object-contain rounded-md ${aspect === 'square' ? 'mb-2' : 'mb-4'}`} />
      )}
      
      <div className={`flex flex-col justify-center ${aspect === 'square' ? '' : 'flex-grow'}`}>
        <h4 className={`font-bold font-cinzel text-white ${description ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>{title}</h4>
        {cost && cost.trim() && <p className={`text-[10px] font-semibold my-1 ${costColor}`}>{cost.toUpperCase()}</p>}
        {description && <p className="text-xs text-gray-400 leading-snug mt-2 flex-grow text-left whitespace-pre-wrap">{description}</p>}
      </div>
    </div>
  );
};