
import { useState, useEffect } from 'react';
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

// Combined mock activity data from both EarnCredits and Buy pages
const mockActivities = [
  // Activities to earn credits
  {
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
  },
  {
    id: '2',
    title: 'Help with Moving Furniture',
    category: 'Home Tasks',
    description: 'I need help moving some furniture within my apartment. This includes a sofa, two bookshelves, and a dining table. The move should take about 2 hours and doesn\'t require any special equipment.',
    location: 'Via del Corso 12, 00186, Rome, Italy',
    date: new Date(Date.now() + 86400000 * 1),
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    credits: 20,
    status: 'available',
    createdBy: {
      id: 'user2',
      name: 'Marco Rossi',
      rating: 4.5,
      reviews: 8,
    }
  },
  {
    id: '3',
    title: 'Homemade Lasagna Making Class',
    category: 'Food & Drink',
    description: 'Learn how to make authentic Italian lasagna from scratch! I will teach you my family recipe that has been passed down for generations. All ingredients will be provided. We\'ll make the pasta, sauce, and assemble the lasagna together.',
    location: 'Via dei Calzaiuoli 8, 50122, Florence, Italy',
    date: new Date(Date.now() + 86400000 * 3),
    startTime: '18:00',
    endTime: '20:00',
    duration: 2,
    credits: 8,
    status: 'available',
    createdBy: {
      id: 'user3',
      name: 'Giulia Bianchi',
      rating: 4.9,
      reviews: 20,
    }
  },
  {
    id: '4',
    title: 'Bike Sharing Service',
    category: 'Mobility',
    description: 'Offering my bicycle for use around the city. The bike is in excellent condition with a comfortable seat and basket. Perfect for sightseeing or quick errands around town.',
    location: 'Alexanderplatz, 10178 Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 1),
    startTime: '09:00',
    endTime: '11:00',
    duration: 2,
    credits: 5,
    status: 'available',
    createdBy: {
      id: 'user4',
      name: 'Thomas Schmidt',
      rating: 4.6,
      reviews: 5,
    }
  },
  {
    id: '5',
    title: 'Rome Walking Tour Guide',
    category: 'Holiday & Trips',
    description: 'I offer a walking tour of Rome\'s historical center. We\'ll visit the Colosseum, Roman Forum, Trevi Fountain, and other major attractions. I\'ll share historical facts and local stories to make the tour engaging and memorable.',
    location: 'Piazza del Colosseo, 00184 Rome, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    startTime: '09:30',
    endTime: '12:30',
    duration: 3,
    credits: 25,
    status: 'available',
    createdBy: {
      id: 'user5',
      name: 'Elena Verdi',
      rating: 4.9,
      reviews: 32,
    }
  },
  
  // Activities to buy
  {
    id: '101',
    title: 'Virtual Guitar Lessons',
    category: 'Music & Entertainment',
    description: 'Learn guitar from the comfort of your home! These virtual lessons are perfect for beginners to intermediate players. We\'ll cover basic chords, strumming patterns, and simple songs to get you playing quickly.',
    location: 'Online',
    date: new Date(Date.now() + 86400000 * 3),
    startTime: '20:00',
    endTime: '21:00',
    duration: 1,
    credits: 10,
    status: 'available',
    createdBy: {
      id: 'user6',
      name: 'James Wilson',
      rating: 4.7,
      reviews: 15,
    }
  },
  {
    id: '102',
    title: 'Professional Resume Review',
    category: 'Consulting',
    description: 'I\'ll review your resume and provide detailed feedback to help you improve it. As a hiring manager with 8 years of experience, I can help you highlight your strengths and make your resume stand out to potential employers.',
    location: 'Online',
    date: new Date(Date.now() + 86400000 * 5),
    startTime: '18:00',
    endTime: '19:00',
    duration: 1,
    credits: 8,
    status: 'available',
    createdBy: {
      id: 'user7',
      name: 'Lisa Chen',
      rating: 5.0,
      reviews: 28,
    }
  },
  {
    id: '6',
    title: 'Beta Test New Organic Snacks',
    category: 'Try a Product',
    description: 'Be among the first to taste our new range of organic snacks! We\'re looking for honest feedback on flavor, texture, and packaging. You\'ll receive a variety box with 10 different snacks to try and evaluate over a week.',
    location: '350 Fifth Avenue, New York, NY 10118, USA',
    date: new Date(Date.now() + 86400000 * 2),
    startTime: '15:00',
    endTime: '16:00',
    duration: 1,
    credits: 10,
    status: 'available',
    createdBy: {
      id: 'user6',
      name: 'Alex Johnson',
      rating: 4.7,
      reviews: 9,
    }
  },
];

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [activity, setActivity] = useState<any>(null);
  const [userCredits] = useState(42); // Mock user credits
  
  useEffect(() => {
    // Find the activity with the matching ID
    const foundActivity = mockActivities.find(act => act.id === id);
    setActivity(foundActivity);
  }, [id]);
  
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
                    <div className="font-medium">{activity.createdBy?.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {activity.createdBy?.rating}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{activity.createdBy?.reviews} reviews</span>
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
