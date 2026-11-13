import React from 'react';
import Image from 'next/image';

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
  if (!showWordmark) {
    const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
    return (
      <img
        src="/brand/finbud-icon.svg"
        alt="FINBUD Mark"
        width={dim}
        height={dim}
        className={`shrink-0 ${className}`}
      />
    );
  }

  const height = size === 'sm' ? 30 : size === 'lg' ? 44 : 36;
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/brand/finbud-logo.svg"
        alt="FINBUD Logo"
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain"
      />
    </div>
  );
};

