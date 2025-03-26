
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, List, Map, CalendarDays, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { LocationInput } from '@/components/ui/location-input';
import { Badge } from "@/components/ui/badge";
import { MapView } from '@/components/ui/map-view';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock data for activities - Extended with global locations
const mockActivities: ActivityCardProps[] = [
  {
    id: '101',
    title: 'Virtual Guitar Lessons',
    category: 'Music & Entertainment',
    location: 'Online',
    date: new Date(Date.now() + 86400000 * 3),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '102',
    title: 'Professional Resume Review',
    category: 'Consulting',
    location: 'Online',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 1,
    credits: 8,
    status: 'available',
  },
  {
    id: '103',
    title: 'Italian Language Tutoring',
    category: 'Lessons',
    location: 'Rome, Metropolitan City of Rome, Italy',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 1.5,
    credits: 15,
    status: 'available',
  },
  {
    id: '104',
    title: 'Handmade Pottery Workshop',
    category: 'Arts',
    location: 'Florence, Metropolitan City of Florence, Italy',
    date: new Date(Date.now() + 86400000 * 7),
    duration: 3,
    credits: 30,
    status: 'available',
  },
  {
    id: '105',
    title: 'Fashion District Tour',
    category: 'Assistance',
    location: 'Milan, Metropolitan City of Milan, Italy',
    date: new Date(Date.now() + 86400000 * 4),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '106',
    title: 'Authentic Pizza Making Class',
    category: 'Food & Drink',
    location: 'Naples, Metropolitan City of Naples, Italy',
    date: new Date(Date.now() + 86400000 * 6),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '107',
    title: 'Gondola Rowing Lesson',
    category: 'Lessons',
    location: 'Venice, Metropolitan City of Venice, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 1,
    credits: 15,
    status: 'available',
  },
  {
    id: '108',
    title: 'Broadway Show Tips & Tickets Help',
    category: 'Assistance',
    location: '1 World Trade Center, New York, NY 10007, USA',
    date: new Date(Date.now() + 86400000 * 10),
    duration: 2,
    credits: 15,
    status: 'available',
  },
  {
    id: '109',
    title: 'Sushi Making Workshop',
    category: 'Food & Drink',
    location: 'Tokyo Station, 1 Chome Marunouchi, Tokyo, Japan',
    date: new Date(Date.now() + 86400000 * 8),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '110',
    title: 'Louvre Museum Private Tour',
    category: 'Lessons',
    location: '75001 Paris, France',
    date: new Date(Date.now() + 86400000 * 12),
    duration: 3,
    credits: 30,
    status: 'available',
  },
  {
    id: '111',
    title: 'British Pub Crawl Guide',
    category: 'Food & Drink',
    location: 'Tower Bridge Rd, London SE1 2UP, UK',
    date: new Date(Date.now() + 86400000 * 7),
    duration: 3,
    credits: 25,
    status: 'available',
  },
  {
    id: '112',
    title: 'Opera House Backstage Tour',
    category: 'Music & Entertainment',
    location: 'Bennelong Point, Sydney NSW 2000, Australia',
    date: new Date(Date.now() + 86400000 * 15),
    duration: 1.5,
    credits: 20,
    status: 'available',
  },
  {
    id: '113',
    title: 'Tapas Cooking Class',
    category: 'Food & Drink',
    location: 'Sagrada Familia, Barcelona, 08013, Spain',
    date: new Date(Date.now() + 86400000 * 9),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '114',
    title: 'Ancient Hieroglyphs Workshop',
    category: 'Lessons',
    location: 'Pyramids of Giza, Al Haram, Giza Governorate, Egypt',
    date: new Date(Date.now() + 86400000 * 20),
    duration: 1.5,
    credits: 15,
    status: 'available',
  },
  {
    id: '115',
    title: 'Carnival Costume Making',
    category: 'Arts',
    location: 'Av. Atlantica, Copacabana, Rio de Janeiro, Brazil',
    date: new Date(Date.now() + 86400000 * 30),
    duration: 4,
    credits: 35,
    status: 'available',
  },
];

const Buy = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedLocationDisplay, setSelectedLocationDisplay] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleLocationChange = (address: string, displayValue?: string) => {
    setSelectedLocation(address);
    setSelectedLocationDisplay(displayValue || address);
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter activities based on search query and categories
    const filtered = mockActivities.filter(activity => {
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

  useEffect(() => {
    // Set initial filter
    setFilteredActivities(mockActivities);
  }, []);

  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary">Find Activities to Buy</h1>
            <div className="flex items-center gap-2">
              <div className="text-sm px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Weekly: 10 free credits</span>
              </div>
            </div>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8 bg-card/70 p-6 rounded-lg backdrop-blur-sm shadow-sm border border-primary/10">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Location Selector with Autocomplete */}
              <div className="relative flex-1">
                <LocationInput
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  placeholder="Select location"
                />
              </div>

              {/* Activity Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search activities"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/60"
                />
              </div>
              
              <Button type="submit" className="shrink-0">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            
            <div className="space-y-3">
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
                    <Badge key={category.id} variant="secondary" className="flex items-center gap-1 bg-primary/10">
                      <category.icon className="h-3 w-3" />
                      {category.name}
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
            <h2 className="text-xl font-semibold text-primary">
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

export default Buy;
