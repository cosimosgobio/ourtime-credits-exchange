
import { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from './command';

// Mock geocoding API 
// In a real app, you would use Google Places API or similar
export interface LocationSuggestion {
  value: string;
  label: string;
  address: string;
}

// Expanded mock data with global locations
const globalLocations: LocationSuggestion[] = [
  { value: 'rome', label: 'Rome, Italy', address: 'Rome, Metropolitan City of Rome, Italy' },
  { value: 'milan', label: 'Milan, Italy', address: 'Milan, Metropolitan City of Milan, Italy' },
  { value: 'florence', label: 'Florence, Italy', address: 'Florence, Metropolitan City of Florence, Italy' },
  { value: 'naples', label: 'Naples, Italy', address: 'Naples, Metropolitan City of Naples, Italy' },
  { value: 'venice', label: 'Venice, Italy', address: 'Venice, Metropolitan City of Venice, Italy' },
  { value: 'new-york', label: 'New York, USA', address: '1 World Trade Center, New York, NY 10007, USA' },
  { value: 'tokyo', label: 'Tokyo, Japan', address: 'Tokyo Station, 1 Chome Marunouchi, Tokyo, Japan' },
  { value: 'paris', label: 'Paris, France', address: '75001 Paris, France' },
  { value: 'london', label: 'London, UK', address: 'Tower Bridge Rd, London SE1 2UP, UK' },
  { value: 'sydney', label: 'Sydney, Australia', address: 'Bennelong Point, Sydney NSW 2000, Australia' },
  { value: 'barcelona', label: 'Barcelona, Spain', address: 'Sagrada Familia, Barcelona, 08013, Spain' },
  { value: 'cairo', label: 'Cairo, Egypt', address: 'Pyramids of Giza, Al Haram, Giza Governorate, Egypt' },
  { value: 'rio', label: 'Rio de Janeiro, Brazil', address: 'Av. Atlantica, Copacabana, Rio de Janeiro, Brazil' },
  { value: 'singapore', label: 'Singapore', address: 'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953' },
  { value: 'berlin', label: 'Berlin, Germany', address: 'Brandenburg Gate, Pariser Platz, 10117 Berlin, Germany' },
];

export interface LocationInputProps {
  value: string;
  onChange: (value: string, displayValue?: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function LocationInput({ value, onChange, placeholder = "Select location", required = false }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<LocationSuggestion[]>(globalLocations);

  // Update filtered locations when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = globalLocations.filter(location => 
        location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(globalLocations);
    }
  }, [searchTerm]);

  // Handle selection of a location
  const handleSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    onChange(location.address, location.label);
    setOpen(false);
  };

  // Handle clearing the location
  const handleClear = () => {
    setSelectedLocation(null);
    onChange('');
    setSearchTerm('');
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // In a real app, you would reverse geocode with Google or similar API
          // For now, just use mock data for the closest major city
          const nearestCity = globalLocations[0]; // Pretend this is the nearest
          setSelectedLocation(nearestCity);
          onChange(nearestCity.address, nearestCity.label);
          toast.success("Location detected", {
            description: `Using ${nearestCity.label}`
          });
        },
        () => {
          toast.error("Location error", {
            description: "Unable to get your location"
          });
        }
      );
    } else {
      toast.error("Geolocation unavailable", {
        description: "Your browser doesn't support geolocation"
      });
    }
  };

  // Initialize from value prop
  useEffect(() => {
    if (value && !selectedLocation) {
      // Find if the address matches any of our locations
      const matchingLocation = globalLocations.find(loc => 
        loc.address === value || loc.label === value
      );
      
      if (matchingLocation) {
        setSelectedLocation(matchingLocation);
      }
    }
  }, [value, selectedLocation]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={selectedLocation ? selectedLocation.address : value}
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
        <PopoverContent className="p-0 w-[300px] sm:w-[400px]" align="start" sideOffset={5}>
          <Command>
            <CommandInput 
              placeholder="Search address..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-none focus:ring-0"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-12 top-2.5"
              onClick={getUserLocation}
            >
              <Navigation className="h-4 w-4 mr-1" />
              <span className="text-xs">My Location</span>
            </Button>
            <CommandList>
              <CommandEmpty>No locations found.</CommandEmpty>
              <CommandGroup heading="Suggested locations">
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location.value}
                    value={location.value}
                    onSelect={() => handleSelect(location)}
                    className="py-2"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{location.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {location.address}
                      </span>
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
}
