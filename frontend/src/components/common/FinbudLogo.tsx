import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FinbudLogo: React.FC<LogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Playful Neo-Brutalist Geometric Square Icon */}
      <div
        className={`${iconSize} bg-[#FFD05B] border-[1.5px] border-[#182B46] rounded-[8px] shadow-[2px_2px_0_#182B46] flex items-center justify-center font-extrabold text-[#182B46] tracking-tighter shrink-0 select-none`}
      >
        FB
      </div>
      {showWordmark && (
        <span className={`font-extrabold tracking-tight text-[#182B46] ${textSize}`}>
          FINBUD
        </span>
      )}
    </div>
  );
};
