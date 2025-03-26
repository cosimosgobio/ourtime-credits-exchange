
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreditDisplay } from '@/components/ui/credit-display';
import { Button } from '@/components/ui/button';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { Clock, Search, Plus, TrendingUp } from 'lucide-react';
import { RulesDialog } from '@/components/ui/rules-dialog';

// Placeholder data
const mockActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Lessons',
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
    title: 'Homemade Lasagna',
    category: 'Food & Drink',
    location: 'Via dei Calzaiuoli 8, 50122, Florence, Italy',
    credits: 8,
    status: 'available',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityCardProps[]>([]);
  const [userCredits, setUserCredits] = useState(100); // Starting with 100 credits
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setActivities(mockActivities);
  }, []);
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.section 
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <CreditDisplay credits={userCredits} size="lg" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-primary text-transparent bg-clip-text">
              Welcome to OurTime
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Exchange your time and skills for credits. Help others and receive help in return.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <Button 
                onClick={() => navigate('/perform')} 
                variant="outline" 
                className="btn-scale"
              >
                <Clock className="mr-2 h-4 w-4" />
                Perform Activities
              </Button>
              <Button 
                onClick={() => navigate('/create')} 
                className="btn-scale"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Activity
              </Button>
              <Button 
                onClick={() => navigate('/buy')} 
                variant="outline" 
                className="btn-scale"
              >
                <Search className="mr-2 h-4 w-4" />
                Find Services
              </Button>
            </div>
            
            <div className="flex justify-center">
              <RulesDialog />
            </div>
          </motion.section>
          
          {/* Recent Activities */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold bg-gradient-primary text-transparent bg-clip-text">Recent Activities</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/perform')}
              >
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((activity, index) => (
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
            </div>
            
            {activities.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No activities available yet.</p>
              </div>
            )}
          </section>
          
          {/* How It Works */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-center bg-gradient-primary text-transparent bg-clip-text">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-muted to-card shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Perform Activities</h3>
                <p className="text-sm text-muted-foreground">
                  Find activities you can perform to earn credits.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-muted to-card shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Create Activities</h3>
                <p className="text-sm text-muted-foreground">
                  Create activities when you need help from others.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-muted to-card shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Exchange Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Use your earned credits to get help from others.
                </p>
              </motion.div>
            </div>
          </section>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Index;
