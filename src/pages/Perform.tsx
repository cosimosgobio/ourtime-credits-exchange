
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { MapView } from '@/components/ui/map-view';
import { MapPin, Search, Filter, List, Map, Info, X, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock location data for autocomplete suggestions
const suggestedLocations = [
  { value: 'rome', label: 'Rome, Italy', address: 'Rome, Metropolitan City of Rome, Italy' },
  { value: 'milan', label: 'Milan, Italy', address: 'Milan, Metropolitan City of Milan, Italy' },
  { value: 'florence', label: 'Florence, Italy', address: 'Florence, Metropolitan City of Florence, Italy' },
  { value: 'naples', label: 'Naples, Italy', address: 'Naples, Metropolitan City of Naples, Italy' },
  { value: 'venice', label: 'Venice, Italy', address: 'Venice, Metropolitan City of Venice, Italy' },
];

// Mock data for activities
const mockActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Music & Entertainment',
    location: 'Milan, Italy',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '2',
    title: 'Help with Moving Furniture',
    category: 'Home Tasks',
    location: 'Rome, Italy',
    date: new Date(Date.now() + 86400000 * 1),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '3',
    title: 'English Conversation Practice',
    category: 'Lessons',
    location: 'Florence, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '4',
    title: 'IT Support and Troubleshooting',
    category: 'Consulting',
    location: 'Naples, Italy',
    date: new Date(Date.now() + 86400000 * 3),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '5',
    title: 'Photography Session',
    category: 'Arts',
    location: 'Venice, Italy',
    date: new Date(Date.now() + 86400000 * 7),
    duration: 2,
    credits: 15,
    status: 'available',
  },
];

const Perform = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ value: string, label: string, address: string } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter activities based on search query and categories
    const filtered = mockActivities.filter(activity => {
      // Filter by location if selected
      const matchesLocation = !selectedLocation || 
        activity.location.toLowerCase().includes(selectedLocation.label.toLowerCase());
        
      // Filter by text query
      const matchesQuery = !searchQuery || 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase());
        
      // Filter by categories (if any are selected)
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.some(cat => activity.category.toLowerCase().includes(cat.name.toLowerCase()));
        
      return matchesLocation && matchesQuery && matchesCategory;
    });
    
    setFilteredActivities(filtered);
    toast.success("Search complete", {
      description: `Found ${filtered.length} activities`
    });
  };
  
  const handleCategorySelect = (category: Category) => {
    // Check if category is already selected
    if (selectedCategories.some(c => c.id === category.id)) {
      // If already selected, remove it
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      // If not selected, add it
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const handleSelectAllCategories = () => {
    // We use an empty array to represent "All categories"
    setSelectedCategories([]);
  };
  
  const handleLocationSelect = (location: typeof suggestedLocations[0]) => {
    setSelectedLocation(location);
    setShowLocationPopover(false);
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
  };

  useEffect(() => {
    // Show rules dialog on first visit
    const hasSeenRules = localStorage.getItem('hasSeenRules');
    if (!hasSeenRules) {
      setShowRulesDialog(true);
      localStorage.setItem('hasSeenRules', 'true');
    }
  }, []);
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Find Activities to Perform</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRulesDialog(true)}
              className="flex items-center gap-1"
            >
              <Info className="h-4 w-4" />
              Rules
            </Button>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Location Selector with Autocomplete */}
              <div className="relative flex-1">
                <Popover open={showLocationPopover} onOpenChange={setShowLocationPopover}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={selectedLocation ? selectedLocation.label : "Select location"}
                        value={selectedLocation ? selectedLocation.label : ""}
                        onClick={() => setShowLocationPopover(true)}
                        className="pl-10 pr-8 cursor-pointer"
                        readOnly
                      />
                      {selectedLocation && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearLocation();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start" sideOffset={5}>
                    <Command>
                      <CommandInput placeholder="Search location..." />
                      <CommandList>
                        <CommandEmpty>No locations found.</CommandEmpty>
                        <CommandGroup heading="Suggested locations">
                          {suggestedLocations.map((location) => (
                            <CommandItem
                              key={location.value}
                              value={location.value}
                              onSelect={() => handleLocationSelect(location)}
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

              {/* Activity Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search activities"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button type="submit" className="shrink-0">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Category
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllCategories}
                    className={selectedCategories.length === 0 ? "bg-primary/10 text-primary" : ""}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    All
                  </Button>
                  {selectedCategories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCategories}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Selected categories badges */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories.map(category => (
                    <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                      <category.icon className="h-3 w-3" />
                      {category.name}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => handleCategorySelect(category)} 
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <CategorySelector 
                onSelect={handleCategorySelect}
                selected={selectedCategories.map(c => c.id)}
                multiSelect={true}
              />
            </div>
          </form>
          
          {/* View toggle */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Available Activities {filteredActivities.length > 0 && `(${filteredActivities.length})`}
            </h2>
            <Tabs defaultValue="list" className="w-[200px]" onValueChange={(value) => setViewMode(value as 'list' | 'map')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results */}
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard
                    {...activity}
                    onClick={() => navigate(`/activity/${activity.id}`)}
                  />
                </motion.div>
              ))}
              
              {filteredActivities.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-2">No activities found.</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <MapView activities={filteredActivities} />
            </div>
          )}

          {/* Rules Dialog */}
          <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  How OurTime Works
                </DialogTitle>
                <DialogDescription>
                  Understanding the time-banking system
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                <div>
                  <h3 className="font-medium text-base mb-1">The Basics</h3>
                  <p className="text-sm text-muted-foreground">
                    OurTime is a time-banking platform where time is the currency. Each credit represents one hour of service.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-base mb-1">Earning Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Perform activities for others in the community to earn credits. The number of credits equals the hours spent.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-base mb-1">Spending Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your earned credits to request services from other members of the community.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-base mb-1">Community Guidelines</h3>
                  <p className="text-sm text-muted-foreground">
                    Respect other members, provide quality service, and communicate clearly about expectations and time commitments.
                  </p>
                </div>
              </div>
              
              <Button onClick={() => setShowRulesDialog(false)} className="w-full mt-2">
                Got it
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Perform;
