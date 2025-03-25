
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreditDisplay } from '@/components/ui/credit-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityCard, ActivityCardProps } from '@/components/ui/activity-card';
import { Button } from '@/components/ui/button';
import { Settings, Star, Clock, Calendar } from 'lucide-react';

// Mock data
const mockCreatedActivities: ActivityCardProps[] = [
  {
    id: '1',
    title: 'Help with Website Design',
    category: 'Consulting',
    location: 'Milan, Italy',
    date: new Date(Date.now() + 86400000 * 4),
    duration: 3,
    credits: 30,
    status: 'available',
  },
];

const mockBookedActivities: ActivityCardProps[] = [
  {
    id: '2',
    title: 'Dog Walking Service',
    category: 'Assistance',
    location: 'Milan, Italy',
    date: new Date(Date.now() + 86400000 * 2),
    duration: 1,
    credits: 10,
    status: 'booked',
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('created');
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 border-2 border-primary/10">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">John Doe</h1>
                  <p className="text-muted-foreground mb-3">Milan, Italy</p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <CreditDisplay credits={42} size="lg" />
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-amber-500 mr-1" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground text-sm ml-1">(12)</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* Activities Tabs */}
          <Tabs defaultValue="created" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="created" className="gap-2">
                <Clock className="w-4 h-4" />
                <span>Activities Created</span>
              </TabsTrigger>
              <TabsTrigger value="booked" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span>Activities Booked</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="created" className="space-y-4">
              {mockCreatedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard {...activity} />
                </motion.div>
              ))}
              
              {mockCreatedActivities.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You haven't created any activities yet.</p>
                  <Button>Create New Activity</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="booked" className="space-y-4">
              {mockBookedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ActivityCard {...activity} />
                </motion.div>
              ))}
              
              {mockBookedActivities.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You haven't booked any activities yet.</p>
                  <Button>Find Activities</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Profile;
