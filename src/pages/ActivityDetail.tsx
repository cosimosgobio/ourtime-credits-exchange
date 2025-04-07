import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/ui/credit-display';
import { 
  MapPin, Calendar, Clock, ArrowLeft, User,
  Tag, MessageCircle, AlertCircle, CheckCircle2, Minus, Plus
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { mockActivities } from '@/data/mockActivities';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [activity, setActivity] = useState<any>(null);
  const [userCredits] = useState(500);
  const [quantity, setQuantity] = useState(1);
  const [totalCredits, setTotalCredits] = useState(0);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  
  useEffect(() => {
    console.log("Fetching activity with id:", id); // Debugging log
    const foundActivity = mockActivities.find(act => act.id === id);
    console.log("Found activity:", foundActivity); // Debugging log
    if (foundActivity) {
      setActivity(foundActivity);
      const initialQuantity = foundActivity.partialBooking ? 
                             (foundActivity.minQuantity || 1) : 
                             foundActivity.duration;
      setQuantity(initialQuantity);
      
      // If activity has available time slots, select the first one by default
      if (foundActivity.availableTimeSlots && foundActivity.availableTimeSlots.length > 0) {
        setSelectedTimeSlots([foundActivity.availableTimeSlots[0].id]);
      }
    }
  }, [id]);
  
  useEffect(() => {
    if (activity) {
      const creditsPerUnit = activity.credits / activity.duration;
      
      // If using specific time slots
      if (activity.availableTimeSlots && selectedTimeSlots.length > 0) {
        let totalHours = 0;
        selectedTimeSlots.forEach(slotId => {
          const slot = activity.availableTimeSlots.find((slot: any) => slot.id === slotId);
          if (slot) {
            const startHour = parseInt(slot.start.split(':')[0]);
            const endHour = parseInt(slot.end.split(':')[0]);
            totalHours += endHour - startHour;
          }
        });
        setQuantity(totalHours);
        setTotalCredits(Math.round(creditsPerUnit * totalHours));
      } else {
        setTotalCredits(Math.round(creditsPerUnit * quantity));
      }
    }
  }, [activity, quantity, selectedTimeSlots]);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (!activity?.partialBooking) return;
    
    const min = activity.minQuantity || 1;
    const max = activity.maxQuantity || activity.duration;
    
    if (newQuantity >= min && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };
  
  const toggleTimeSlot = (slotId: string) => {
    if (selectedTimeSlots.includes(slotId)) {
      // If we're not at the minimum required, don't remove
      if (activity.minQuantity && selectedTimeSlots.length <= activity.minQuantity) {
        toast.error("You must select at least " + activity.minQuantity + " time slots");
        return;
      }
      setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== slotId));
    } else {
      // If we're at the maximum allowed, don't add more
      if (activity.maxQuantity && selectedTimeSlots.length >= activity.maxQuantity) {
        toast.error("You can select maximum " + activity.maxQuantity + " time slots");
        return;
      }
      setSelectedTimeSlots([...selectedTimeSlots, slotId]);
    }
  };
  
  const getDayName = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return format(date, 'EEEE');
  };
  
  const handleBook = () => {
    if (userCredits < totalCredits) {
      toast("You don't have enough credits", {
        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
      });
      return;
    }
    
    setIsBooking(true);
    
    setTimeout(() => {
      toast("Activity booked successfully", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        description: `You booked ${quantity} hour${quantity > 1 ? 's' : ''} for ${totalCredits} credits`,
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
                
                {activity.startTime && !activity.availableTimeSlots && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      {activity.startTime} to {activity.endTime} 
                      {activity.duration && ` (${activity.duration} hour${activity.duration > 1 ? 's' : ''})`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="glass p-4 rounded-lg border border-muted/30 bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{activity.createdBy?.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.902 1.113l-2.8-2.034a1 1 0 00-1.118 0l-2.8 2.034c-1.147.575-2.202-.192-1.902-1.113l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/>
                        </svg>
                        {activity.createdBy?.rating}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{activity.createdBy?.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                
                {/* Time Slots Selection */}
                {activity.availableTimeSlots && activity.availableTimeSlots.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">
                      Select available time slots (min: {activity.minQuantity || 1}, max: {activity.maxQuantity || activity.availableTimeSlots.length})
                    </p>
                    
                    <div className="space-y-3">
                      {/* Group by day */}
                      {[...new Set(activity.availableTimeSlots.map((slot: any) => slot.day))].map((day: number) => (
                        <div key={day} className="space-y-2">
                          <p className="text-sm font-medium">{getDayName(day)}</p>
                          <div className="flex flex-wrap gap-2">
                            {activity.availableTimeSlots
                              .filter((slot: any) => slot.day === day)
                              .map((slot: any) => (
                                <Button
                                  key={slot.id}
                                  variant={selectedTimeSlots.includes(slot.id) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleTimeSlot(slot.id)}
                                  className="flex gap-1 items-center"
                                >
                                  {slot.start} - {slot.end}
                                  {selectedTimeSlots.includes(slot.id) && 
                                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center ml-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                    </span>
                                  }
                                </Button>
                              ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-right">
                      <span className="text-sm text-muted-foreground">Total hours: {quantity}</span>
                      <div className="font-semibold text-primary">{totalCredits} credits</div>
                    </div>
                  </div>
                )}
                
                {/* Manual quantity adjustment for activities without specific time slots */}
                {activity.partialBooking && !activity.availableTimeSlots && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      You can book from {activity.minQuantity || 1} to {activity.maxQuantity || activity.duration} hours
                    </p>
                    <div className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= (activity.minQuantity || 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="font-medium">
                        {quantity} hour{quantity > 1 ? 's' : ''}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= (activity.maxQuantity || activity.duration)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="font-semibold text-primary">{totalCredits} credits</span>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleBook}
                  disabled={isBooking || (activity.availableTimeSlots && selectedTimeSlots.length === 0)}
                  className="w-full"
                >
                  {isBooking ? 'Booking...' : `Book Now (${totalCredits} credits)`}
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
