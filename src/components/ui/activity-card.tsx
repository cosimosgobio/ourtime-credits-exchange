
import { Clock, MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  location: string;
  date?: Date;
  duration?: number;
  credits: number;
  status: 'available' | 'booked' | 'completed';
  onClick?: () => void;
}

export function ActivityCard({
  title,
  category,
  location,
  date,
  duration,
  credits,
  status,
  onClick,
}: ActivityCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-white border rounded-xl shadow-sm overflow-hidden card-hover cursor-pointer",
        "transition-all duration-300 animate-fade-in"
      )}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-lg line-clamp-1 mr-2">{title}</h3>
          <div className="shrink-0">
            <span className="font-semibold text-primary">{credits} credits</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag size={16} className="mr-2 flex-shrink-0" />
            <span>{category}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          
          {date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={16} className="mr-2 flex-shrink-0" />
              <span>{formatDistanceToNow(date, { addSuffix: true })} {duration && `· ${duration} hour${duration > 1 ? 's' : ''}`}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div 
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              status === 'available' && "bg-green-100 text-green-800",
              status === 'booked' && "bg-blue-100 text-blue-800",
              status === 'completed' && "bg-gray-100 text-gray-800"
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
