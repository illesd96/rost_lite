import Image from 'next/image';

interface WebshopIconProps {
  className?: string;
  size?: number;
}

export function WebshopIcon({ className = "w-5 h-5", size }: WebshopIconProps) {
  // Extract size from className if not provided explicitly
  const sizeMatch = className.match(/w-(\d+)/);
  const defaultSize = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 20; // Convert Tailwind size to pixels
  const iconSize = size || defaultSize;

  return (
    <Image
      src="/images/webshop_icon.png"
      alt="Webshop"
      width={iconSize}
      height={iconSize}
      className={className}
    />
  );
}
