
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { MapView } from '@/components/ui/map-view';
import { MapPin, Search, Filter, List, Map } from 'lucide-react';

// Mock data
const mockActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Lessons',
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
    location: 'Milan, Italy',
    date: new Date(Date.now() + 86400000 * 3),
    duration: 1,
    credits: 10,
    status: 'available',
  },
];

const Perform = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter activities based on search query and category
    const filtered = mockActivities.filter(activity => {
      const matchesQuery = !searchQuery || 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = !selectedCategory || 
        activity.category.toLowerCase() === selectedCategory.name.toLowerCase();
        
      return matchesQuery && matchesCategory;
    });
    
    setFilteredActivities(filtered);
  };
  
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Find Activities to Perform</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search location or activity"
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
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setFilteredActivities(mockActivities);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <CategorySelector 
                onSelect={handleCategorySelect}
                selected={selectedCategory?.id}
              />
            </div>
          </form>
          
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Available Activities {filteredActivities.length > 0 && `(${filteredActivities.length})`}
            </h2>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button 
                variant={viewMode === 'map' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
            </div>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MapView activities={filteredActivities} />
            </motion.div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Perform;
