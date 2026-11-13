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
      {/* Official FINBUD Emerald Brand Mark */}
      <div
        className={`${iconSize} bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-white tracking-tight shrink-0 select-none shadow-xs`}
      >
        FB
      </div>
      {showWordmark && (
        <span className={`font-bold tracking-tight text-[#111827] ${textSize}`}>
          FINBUD
        </span>
      )}
    </div>
  );
};
