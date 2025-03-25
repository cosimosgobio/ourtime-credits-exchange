
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { CreditDisplay } from '@/components/ui/credit-display';
import { MapPin, Search, Filter, AlertCircle } from 'lucide-react';

// Mock data for buying activities
const mockBuyActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Homemade Italian Lasagna',
    category: 'Food & Drink',
    location: 'Milan, Italy',
    credits: 8,
    status: 'available',
  },
  {
    id: '2',
    title: 'Used Python Programming Book',
    category: 'Giving Items',
    location: 'Rome, Italy',
    credits: 5,
    status: 'available',
  },
  {
    id: '3',
    title: 'Professional Camera Rental',
    category: 'Lending Items',
    location: 'Florence, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    duration: 3,
    credits: 15,
    status: 'available',
  },
];

const Buy = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredActivities, setFilteredActivities] = useState(mockBuyActivities);
  const [userCredits] = useState(10); // Mock user credits
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter activities based on search query and category
    const filtered = mockBuyActivities.filter(activity => {
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Buy with Credits</h1>
            <CreditDisplay credits={userCredits} />
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search location or items/services"
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
                      setFilteredActivities(mockBuyActivities);
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
          
          {/* Credit Warning */}
          {userCredits < 5 && (
            <div className="mb-6 p-4 glass border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Low Credits</h3>
                <p className="text-sm text-muted-foreground">
                  You're running low on credits. Perform activities to earn more!
                </p>
              </div>
            </div>
          )}
          
          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Available Items & Services {filteredActivities.length > 0 && `(${filteredActivities.length})`}
            </h2>
            
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
                  <p className="text-muted-foreground mb-2">No items or services found.</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Buy;
