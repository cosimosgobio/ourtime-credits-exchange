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
import { mockActivityCards } from '@/data/mockActivities';

const EarnCredits = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activities] = useState<ActivityCardProps[]>(mockActivityCards);
  const [filteredActivities, setFilteredActivities] = useState<ActivityCardProps[]>(mockActivityCards);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter activities based on search query, location, and categories
    const filtered = activities.filter(activity => {
      const matchesLocation = !selectedLocation || 
        activity.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesQuery = !searchQuery || 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase());
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
    if (selectedCategories.some(c => c.id === category.id)) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedCategories([]);
    setFilteredActivities(activities);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
                <div className="relative flex-1">
                  <Input 
                    placeholder="Enter city..." 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>

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
