
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
import { LocationInput, LocationSuggestion } from '@/components/ui/location-input';
import { Search, Filter, List, Map, Info, X, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for activities - Extended with global locations
const mockActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Music & Entertainment',
    location: 'Milan, Metropolitan City of Milan, Italy',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '2',
    title: 'Help with Moving Furniture',
    category: 'Home Tasks',
    location: 'Rome, Metropolitan City of Rome, Italy',
    date: new Date(Date.now() + 86400000 * 1),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '3',
    title: 'English Conversation Practice',
    category: 'Lessons',
    location: 'Florence, Metropolitan City of Florence, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '4',
    title: 'IT Support and Troubleshooting',
    category: 'Consulting',
    location: 'Naples, Metropolitan City of Naples, Italy',
    date: new Date(Date.now() + 86400000 * 3),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '5',
    title: 'Photography Session',
    category: 'Arts',
    location: 'Venice, Metropolitan City of Venice, Italy',
    date: new Date(Date.now() + 86400000 * 7),
    duration: 2,
    credits: 15,
    status: 'available',
  },
  {
    id: '6',
    title: 'Japanese Cooking Class',
    category: 'Food & Drink',
    location: 'Tokyo Station, 1 Chome Marunouchi, Tokyo, Japan',
    date: new Date(Date.now() + 86400000 * 10),
    duration: 3,
    credits: 25,
    status: 'available',
  },
  {
    id: '7',
    title: 'Tour Guide for Tourists',
    category: 'Assistance',
    location: '75001 Paris, France',
    date: new Date(Date.now() + 86400000 * 4),
    duration: 4,
    credits: 30,
    status: 'available',
  },
  {
    id: '8',
    title: 'Coding Workshop for Beginners',
    category: 'Lessons',
    location: 'Tower Bridge Rd, London SE1 2UP, UK',
    date: new Date(Date.now() + 86400000 * 6),
    duration: 2,
    credits: 15,
    status: 'available',
  },
  {
    id: '9',
    title: 'Surfing Lessons',
    category: 'Lessons',
    location: 'Bennelong Point, Sydney NSW 2000, Australia',
    date: new Date(Date.now() + 86400000 * 15),
    duration: 2,
    credits: 20,
    status: 'available',
  },
  {
    id: '10',
    title: 'Spanish Language Exchange',
    category: 'Lessons',
    location: 'Sagrada Familia, Barcelona, 08013, Spain',
    date: new Date(Date.now() + 86400000 * 8),
    duration: 1,
    credits: 10,
    status: 'available',
  },
  {
    id: '11',
    title: 'Ancient History Tour',
    category: 'Lessons',
    location: 'Pyramids of Giza, Al Haram, Giza Governorate, Egypt',
    date: new Date(Date.now() + 86400000 * 20),
    duration: 3,
    credits: 25,
    status: 'available',
  },
  {
    id: '12',
    title: 'Samba Dance Class',
    category: 'Music & Entertainment',
    location: 'Av. Atlantica, Copacabana, Rio de Janeiro, Brazil',
    date: new Date(Date.now() + 86400000 * 12),
    duration: 2,
    credits: 15,
    status: 'available',
  },
  {
    id: '13',
    title: 'Urban Gardening Workshop',
    category: 'Home Tasks',
    location: 'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
    date: new Date(Date.now() + 86400000 * 9),
    duration: 2,
    credits: 15,
    status: 'available',
  },
  {
    id: '14',
    title: 'Art History Tour',
    category: 'Lessons',
    location: 'Brandenburg Gate, Pariser Platz, 10117 Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 11),
    duration: 2,
    credits: 15,
    status: 'available',
  },
  {
    id: '15',
    title: 'Yoga Session in Central Park',
    category: 'Assistance',
    location: '1 World Trade Center, New York, NY 10007, USA',
    date: new Date(Date.now() + 86400000 * 3),
    duration: 1,
    credits: 10,
    status: 'available',
  },
];

const Perform = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedLocationDisplay, setSelectedLocationDisplay] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  
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
  
  const handleLocationChange = (address: string, displayValue?: string) => {
    setSelectedLocation(address);
    setSelectedLocationDisplay(displayValue || address);
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
            <h1 className="text-2xl font-bold text-primary">Find Activities to Perform</h1>
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
          <form onSubmit={handleSearch} className="mb-8 bg-card/70 p-6 rounded-lg backdrop-blur-sm shadow-sm">
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
                    <Badge key={category.id} variant="secondary" className="flex items-center gap-1 bg-primary/10">
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

          {/* Rules Dialog */}
          <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
            <DialogContent className="max-w-md bg-card/95 backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2 text-primary">
                  <Info className="h-5 w-5 text-primary" />
                  How OurTime Works
                </DialogTitle>
                <DialogDescription>
                  Understanding the time-banking system
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                <div className="bg-primary/5 p-3 rounded-md">
                  <h3 className="font-medium text-base mb-1 text-primary">The Basics</h3>
                  <p className="text-sm text-muted-foreground">
                    OurTime is a time-banking platform where time is the currency. Each credit represents one hour of service.
                  </p>
                </div>
                
                <Separator />
                
                <div className="bg-primary/5 p-3 rounded-md">
                  <h3 className="font-medium text-base mb-1 text-primary">Free Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    New users receive 100 credits for free when they join. Additionally, all users receive 10 free credits each week.
                  </p>
                </div>
                
                <Separator />
                
                <div className="bg-primary/5 p-3 rounded-md">
                  <h3 className="font-medium text-base mb-1 text-primary">Earning Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Perform activities for others in the community to earn credits. The number of credits equals the hours spent.
                  </p>
                </div>
                
                <Separator />
                
                <div className="bg-primary/5 p-3 rounded-md">
                  <h3 className="font-medium text-base mb-1 text-primary">Spending Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your earned credits to request services from other members of the community.
                  </p>
                </div>
                
                <Separator />
                
                <div className="bg-primary/5 p-3 rounded-md">
                  <h3 className="font-medium text-base mb-1 text-primary">Community Guidelines</h3>
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
