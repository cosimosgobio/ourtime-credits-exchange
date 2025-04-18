
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  Music, Users, BookOpen, Home, Briefcase, Coffee, Gift, Package, HelpCircle,
  Car, Plane, ShoppingBag
} from "lucide-react";

export type Category = {
  id: string;
  name: string;
  icon: React.ElementType;
};

const categories: Category[] = [
  { id: "music", name: "Music & Entertainment", icon: Music },
  { id: "assistance", name: "Assistance", icon: Users },
  { id: "lessons", name: "Lessons", icon: BookOpen },
  { id: "home", name: "Home Tasks", icon: Home },
  { id: "consulting", name: "Consulting", icon: Briefcase },
  { id: "food", name: "Food & Drink", icon: Coffee },
  { id: "give", name: "Give", icon: Gift },
  { id: "lend", name: "Lend", icon: Package },
  { id: "mobility", name: "Mobility", icon: Car },
  { id: "holiday", name: "Holiday & Trips", icon: Plane },
  { id: "try", name: "Try a Product", icon: ShoppingBag },
  { id: "other", name: "Other", icon: HelpCircle },
];

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selected?: string | string[];
  className?: string;
  multiSelect?: boolean;
}

export function CategorySelector({ 
  onSelect, 
  selected, 
  className,
  multiSelect = false
}: CategorySelectorProps) {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  // Handle initial selected state
  useEffect(() => {
    if (selected) {
      if (Array.isArray(selected)) {
        setActiveIds(selected);
      } else {
        setActiveIds([selected]);
      }
    } else {
      setActiveIds([]);
    }
  }, [selected]);

  const handleSelect = (category: Category) => {
    if (multiSelect) {
      // For multi-select, toggle the selection
      if (activeIds.includes(category.id)) {
        setActiveIds(activeIds.filter(id => id !== category.id));
      } else {
        setActiveIds([...activeIds, category.id]);
      }
    } else {
      // For single select, replace the selection
      setActiveIds([category.id]);
    }
    
    onSelect(category);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {categories.map((category) => {
          const isActive = activeIds.includes(category.id);
          const Icon = category.icon;
          
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelect(category)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200",
                "border hover:border-primary/50",
                isActive 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <Icon size={24} className="mb-2" />
              <span className="text-xs text-center line-clamp-2">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
