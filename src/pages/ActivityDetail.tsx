
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/ui/credit-display';
import { 
  MapPin, Calendar, Clock, ArrowLeft, User,
  Tag, MessageCircle, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock activity data (in a real app this would come from an API)
const mockActivity = {
  id: '1',
  title: 'Piano Lessons for Beginners',
  category: 'Lessons',
  description: 'I offer beginner piano lessons for people of all ages. I have 5 years of experience teaching piano and can help you learn the basics in a fun and engaging way. The lesson will be held at my home studio which has a grand piano.',
  location: 'Milan, Italy',
  date: new Date(Date.now() + 86400000 * 2),
  startTime: '14:00',
  endTime: '15:00',
  duration: 1,
  credits: 10,
  status: 'available',
  createdBy: {
    id: 'user1',
    name: 'Sarah Johnson',
    rating: 4.8,
    reviews: 12,
  }
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [activity] = useState(mockActivity); // In a real app, fetch by ID
  const [userCredits] = useState(42); // Mock user credits
  
  const handleBook = () => {
    if (userCredits < activity.credits) {
      toast("You don't have enough credits", {
        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
      });
      return;
    }
    
    setIsBooking(true);
    
    // Simulate API call
    setTimeout(() => {
      toast("Activity booked successfully", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
      setIsBooking(false);
      navigate('/profile');
    }, 1500);
  };
  
  if (!activity) {
    return (
      <Layout>
        <div className="container mx-auto py-8 text-center">
          <p>Activity not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold">{activity.title}</h1>
              <CreditDisplay credits={activity.credits} size="lg" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{activity.category}</span>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{activity.location}</span>
                </div>
                
                {activity.date && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div>{format(activity.date, 'EEEE, MMMM do, yyyy')}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(activity.date, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                )}
                
                {activity.startTime && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      {activity.startTime} to {activity.endTime} 
                      {activity.duration && ` (${activity.duration} hour${activity.duration > 1 ? 's' : ''})`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{activity.createdBy.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {activity.createdBy.rating}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{activity.createdBy.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full"
                >
                  {isBooking ? 'Booking...' : 'Book Now'}
                </Button>
                
                <div className="text-center mt-3 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4 inline mr-1" />
                  Contact creator with questions
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="font-medium text-lg mb-3">Description</h2>
              <p className="text-muted-foreground">{activity.description}</p>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ActivityDetail;
