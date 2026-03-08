import Image from 'next/image';

interface WebshopIconProps {
  className?: string;
  size?: number;
}

// Default: 1.25rem on small screens, 3rem on md and up (PC)
const DEFAULT_CLASS = "w-5 h-5 md:w-12 md:h-12";

export function WebshopIcon({ className = DEFAULT_CLASS, size }: WebshopIconProps) {
  const sizeMatch = className.match(/w-(\d+)/);
  const defaultSize = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 20;
  const iconSize = size || defaultSize;

  return (
    <Image
      src="/ROSTI WEBSHOP_S.svg"
      alt="Webshop"
      width={iconSize * 3}
      height={iconSize}
      className={className}
    />
  );
}
