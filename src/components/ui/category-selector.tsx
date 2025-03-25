
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  Music, Users, BookOpen, Home, Briefcase, Coffee, Gift, Package, HelpCircle
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
  { id: "items", name: "Giving Items", icon: Gift },
  { id: "lending", name: "Lending Items", icon: Package },
  { id: "other", name: "Other", icon: HelpCircle },
];

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selected?: string;
  className?: string;
}

export function CategorySelector({ onSelect, selected, className }: CategorySelectorProps) {
  const [activeId, setActiveId] = useState<string | undefined>(selected);

  const handleSelect = (category: Category) => {
    setActiveId(category.id);
    onSelect(category);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {categories.map((category) => {
          const isActive = activeId === category.id;
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
