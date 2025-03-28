
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { LocationInput } from '@/components/ui/location-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, List, Map, Plus, MapPin, Navigation } from 'lucide-react';
import { MapView } from '@/components/ui/map-view';
import { toast } from 'sonner';

// Mock data for activities to perform (earn credits)
const mockActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Music & Entertainment',
    location: 'Via Monte Rosa 16, 20148, Milan, Italy',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '2',
    title: 'Help with Moving Furniture',
    category: 'Home Tasks',
    location: 'Via del Corso 12, 00186, Rome, Italy',
    date: new Date(Date.now() + 86400000 * 1),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '3',
    title: 'Homemade Lasagna Making Class',
    category: 'Food & Drink',
    location: 'Via dei Calzaiuoli 8, 50122, Florence, Italy',
    date: new Date(Date.now() + 86400000 * 3),
    credits: 8,
    status: 'available',
  },
  {
    id: '4',
    title: 'Bike Sharing Service',
    category: 'Mobility',
    location: 'Alexanderplatz, 10178 Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 1),
    duration: 2,
    credits: 20, 
    status: 'available',
  },
  {
    id: '5',
    title: 'Rome Walking Tour Guide',
    category: 'Holiday & Trips',
    location: 'Piazza del Colosseo, 00184 Rome, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 3,
    credits: 30,
    status: 'available',
  },
  {
    id: '6',
    title: 'Beta Test New Organic Snacks',
    category: 'Try a Product',
    location: '350 Fifth Avenue, New York, NY 10118, USA',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '7',
    title: 'Teach Spanish Basics',
    category: 'Education',
    location: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
    date: new Date(Date.now() + 86400000 * 4),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '8',
    title: 'Small Garden Maintenance',
    category: 'Gardening',
    location: 'Prenzlauer Berg, Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 3,
    credits: 30,
    status: 'available',
  },
  {
    id: '9',
    title: 'Elderly Care Assistance',
    category: 'Care',
    location: 'Rue de Rivoli, 75001 Paris, France',
    date: new Date(Date.now() + 86400000 * 1),
    duration: 4,
    credits: 40,
    status: 'available',
  },
  {
    id: '10',
    title: 'Smartphone Photography Workshop',
    category: 'Arts',
    location: 'Museumplein, Amsterdam, Netherlands',
    date: new Date(Date.now() + 86400000 * 7),
    duration: 2, 
    credits: 20,
    status: 'available',
  },
  {
    id: '11',
    title: 'Share Homegrown Vegetables',
    category: 'Give',
    location: "Campo de' Fiori, Rome, Italy",
    date: new Date(Date.now() + 86400000 * 3),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '12',
    title: 'Lend Professional Camera',
    category: 'Lend',
    location: 'Friedrichstraße, Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 2,
    credits: 20,
    status: 'available',
  }
];

const EarnCredits = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<ActivityCardProps[]>(mockActivities);
  const [filteredActivities, setFilteredActivities] = useState<ActivityCardProps[]>(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter activities based on search query, location and categories
    const filtered = activities.filter(activity => {
      // Filter by location if selected
      const matchesLocation = !selectedLocation || 
        activity.location.toLowerCase().includes(selectedLocation.toLowerCase());
        
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedCategories([]);
    setFilteredActivities(activities);
  };
  
  const handleLocationChange = (address: string, displayValue?: string) => {
    setSelectedLocation(address);
  };
  
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, this would perform reverse geocoding
          // For now, we'll just show a success message
          toast.success("Using your current location");
          setSelectedLocation("Current location");
        },
        () => {
          toast.error("Could not get your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Earn Credits</h1>
              <p className="text-muted-foreground">Perform activities to earn credits</p>
            </div>
            <Button onClick={() => navigate('/create')} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Activity
            </Button>
          </div>
          
          {/* Search Form */}
          <div className="mb-8 bg-card p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Location Selector */}
                <div className="relative flex-1">
                  <Input 
                    placeholder="Enter city..." 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleUseMyLocation}
                    className="shrink-0"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Near Me
                  </Button>
                  <Button type="submit" className="shrink-0">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter by Category
                  </h2>
                  {(selectedCategories.length > 0 || searchQuery || selectedLocation) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
                
                <CategorySelector 
                  onSelect={handleCategorySelect}
                  selected={selectedCategories.map(c => c.id)}
                  multiSelect={true}
                />
              </div>
            </form>
          </div>
          
          {/* View toggle */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Activities to Earn Credits {filteredActivities.length > 0 && `(${filteredActivities.length})`}
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
                <div className="text-center py-10 bg-card/50 rounded-lg backdrop-blur-sm">
                  <p className="text-muted-foreground mb-2">No activities found.</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <MapView activities={filteredActivities} />
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default EarnCredits;
