import { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from './command';

export interface LocationSuggestion {
  display_name: string;
  place_id: string;
}

export interface LocationInputProps {
  value: string;
  onChange: (value: string, displayValue?: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const LocationInput = ({ value, onChange, placeholder = "Select location", required = false }: LocationInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<LocationSuggestion[]>([]);

  // Fetch location suggestions from Nominatim API
  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&addressdetails=1`);
          const data = await response.json();
          setFilteredLocations(data);
        } catch (error) {
          console.error('Error fetching location suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setFilteredLocations([]);
    }
  }, [searchTerm]);

  // Handle selection of a location
  const handleSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    onChange(location.display_name, location.display_name);
    setOpen(false);
  };

  // Handle clearing the location
  const handleClear = () => {
    setSelectedLocation(null);
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={selectedLocation ? selectedLocation.display_name : value}
              onClick={() => setOpen(true)}
              className="pl-10 pr-8 cursor-pointer bg-card"
              readOnly
              required={required}
            />
            {(selectedLocation || value) && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px] sm:w-[450px]" align="start" sideOffset={5}>
          <Command>
            <CommandInput
              placeholder="Search for a full address..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-none focus:ring-0"
            />
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              <CommandGroup heading="Suggested locations">
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location.place_id}
                    value={location.place_id}
                    onSelect={() => handleSelect(location)}
                    className="py-2"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{location.display_name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
