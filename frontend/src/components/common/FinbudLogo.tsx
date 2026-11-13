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
  const iconSize =
    size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact Logo from User Reference: Yellow icon with dark shadow */}
      <div className="relative shrink-0">
        <div
          className={`${iconSize} bg-[#FCD34D] border-[1.5px] border-[#0A1128] rounded-[8px] flex items-center justify-center font-black text-[#0A1128] tracking-tight relative z-10`}
          style={{
            boxShadow: '2.5px 2.5px 0 #0A1128',
          }}
        >
          FB
        </div>
      </div>
      {showWordmark && (
        <span
          className={`font-black tracking-tight text-[#F4F6FF] ${textSize}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          FINBUD
        </span>
      )}
    </div>
  );
};
