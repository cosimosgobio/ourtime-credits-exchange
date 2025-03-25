
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface CreditDisplayProps {
  credits: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CreditDisplay({
  credits,
  size = 'md',
  className,
}: CreditDisplayProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 font-medium',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        className
      )}
    >
      <Coins
        className="text-amber-500"
        size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
      />
      <span>{credits}</span>
    </div>
  );
}
