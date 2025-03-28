import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreditDisplay } from '@/components/ui/credit-display';
import { Button } from '@/components/ui/button';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { Award, CreditCard, Search, Plus, TrendingUp, Bike, Plane, ShoppingBag } from 'lucide-react';
import { RulesDialog } from '@/components/ui/rules-dialog';

// Placeholder data for popular activities
const earnActivities: ActivityCardProps[] = [
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
    title: 'Bike Sharing Service',
    category: 'Mobility',
    location: 'Alexanderplatz, 10178 Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 1),
    duration: 2,
    credits: 20, 
    status: 'available',
  },
];

const useActivities: ActivityCardProps[] = [
  {
    id: '3',
    title: 'Beach House Weekend',
    category: 'Holiday & Trips',
    location: 'Ocean Drive, Miami Beach, FL 33139, USA',
    date: new Date(Date.now() + 86400000 * 14),
    duration: 48,
    credits: 480, 
    status: 'available',
  },
  {
    id: '4',
    title: 'Test New Smartphone Prototype',
    category: 'Try a Product',
    location: 'Silicon Valley, CA, USA',
    date: new Date(Date.now() + 86400000 * 10),
    duration: 7,
    credits: 70, 
    status: 'available',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [userCredits, setUserCredits] = useState(100); // Starting with 100 credits
  
  // Function to ensure the correct activity ID is passed to the navigation
  const handleActivityClick = (activityId: string) => {
    navigate(`/activity/${activityId}`);
  };
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          {/* Hero Section with gradient background */}
          <motion.section 
            className="mb-10 text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/10 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <CreditDisplay credits={userCredits} size="lg" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              Welcome to OurTime
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Exchange your time and skills for credits. Help others and receive help in return.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <Button 
                onClick={() => navigate('/earn')} 
                className="btn-scale"
              >
                <Award className="mr-2 h-4 w-4" />
                Earn Credits
              </Button>
              <Button 
                onClick={() => navigate('/use')} 
                variant="outline" 
                className="btn-scale"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Use Credits
              </Button>
              <Button 
                onClick={() => navigate('/create')} 
                variant="outline" 
                className="btn-scale"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Activity
              </Button>
            </div>
            
            <div className="flex justify-center">
              <RulesDialog isMobile={false} />
            </div>
          </motion.section>
          
          {/* Earn Credits Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                Popular Earn Activities
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/earn')}
              >
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard
                    {...activity}
                    onClick={() => handleActivityClick(activity.id)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Use Credits Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-accent to-accent/70 text-transparent bg-clip-text">
                Trending Use Activities
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/use')}
              >
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {useActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard
                    {...activity}
                    onClick={() => handleActivityClick(activity.id)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* New Categories Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              New Activity Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Mobility</h3>
                <p className="text-sm text-muted-foreground">
                  Car sharing, bike rentals, carpooling, and more transport options.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-medium mb-2">Holiday & Trips</h3>
                <p className="text-sm text-muted-foreground">
                  Holiday homes, guided tours, travel companions, and local experiences.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Try a Product</h3>
                <p className="text-sm text-muted-foreground">
                  Test new products before they hit the market and provide valuable feedback.
                </p>
              </motion.div>
            </div>
          </section>
          
          {/* How It Works */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-muted/80 to-card shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Earn Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Perform activities to earn credits and grow your balance.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-muted/80 to-card shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Use Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Spend your earned credits on services and goods you need.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-lg bg-gradient-to-br from-muted/80 to-card shadow-md text-center"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Credits Validity</h3>
                <p className="text-sm text-muted-foreground">
                  Use your credits within 30 days before they expire.
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
