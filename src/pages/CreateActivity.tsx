
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { LocationInput } from '@/components/ui/location-input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  MapPin, Calendar as CalendarIcon, Clock, 
  AlertCircle, CheckCircle2, Coins, 
  CalendarDays, FileText, Store, Clock2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CreateActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activityType, setActivityType] = useState<'earn' | 'use'>('earn');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    quantityValue: '',
    quantityType: 'hours', // 'hours' or 'pieces'
    credits: '',
    date: '',
    timeSlots: [] as {start: string, end: string}[],
  });
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category: category.id });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (address: string) => {
    setFormData({ ...formData, location: address });
  };
  
  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, {start: '09:00', end: '10:00'}]
    });
  };
  
  const removeTimeSlot = (index: number) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots.splice(index, 1);
    setFormData({
      ...formData,
      timeSlots: newTimeSlots
    });
  };
  
  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index][field] = value;
    setFormData({
      ...formData,
      timeSlots: newTimeSlots
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title || !formData.category || !formData.location || !formData.quantityValue || !formData.credits) {
      toast("Please fill out all required fields", {
        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
      });
      setIsSubmitting(false);
      return;
    }
    
    // Validate quantity is a positive number
    const quantity = parseInt(formData.quantityValue);
    if (isNaN(quantity) || quantity <= 0) {
      toast("Quantity must be a positive number", {
        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast("Activity created successfully", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
      setIsSubmitting(false);
      
      // Navigate to the appropriate section based on the activity type
      navigate(activityType === 'earn' ? '/earn' : '/use');
    }, 1500);
  };
  
  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-primary">Create New Activity</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
            {/* Activity Type */}
            <div className="space-y-2">
              <Label>Activity Type *</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={activityType === 'earn' ? 'default' : 'outline'}
                  className={cn("flex items-center gap-2 h-20", 
                    activityType === 'earn' && "border-2 border-primary"
                  )}
                  onClick={() => setActivityType('earn')}
                >
                  <Coins className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Earn Credits</div>
                    <div className="text-xs opacity-70">Offer a service or item</div>
                  </div>
                </Button>
                
                <Button
                  type="button"
                  variant={activityType === 'use' ? 'default' : 'outline'}
                  className={cn("flex items-center gap-2 h-20", 
                    activityType === 'use' && "border-2 border-primary"
                  )}
                  onClick={() => setActivityType('use')}
                >
                  <Store className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Use Credits</div>
                    <div className="text-xs opacity-70">Request service or item</div>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Title *</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a descriptive title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="bg-background/60"
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>What *</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what the activity involves..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="bg-background/60"
                required
              />
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <CategorySelector 
                onSelect={handleCategorySelect}
                selected={formData.category}
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Where *</span>
              </Label>
              <LocationInput
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="Enter the full address"
                required
              />
              <p className="text-xs text-muted-foreground">
                Please enter a complete address (e.g., Via Monte Rosa 16, 20148, Milan, Italy)
              </p>
            </div>
            
            {/* Quantity */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock2 className="h-4 w-4" />
                <span>Quantity *</span>
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    id="quantityValue"
                    name="quantityValue"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantityValue}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="bg-background/60"
                  />
                </div>
                <div className="col-span-1">
                  <Select 
                    value={formData.quantityType} 
                    onValueChange={(value) => setFormData({...formData, quantityType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.quantityType === 'hours' 
                  ? 'Specify how many hours are available for booking'
                  : 'Specify how many items are available'
                }
              </p>
            </div>
            
            {/* When (Date Selection) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>When</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {/* Time Slots */}
              {selectedDate && formData.quantityType === 'hours' && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <Label>Available Time Slots</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addTimeSlot}
                    >
                      Add Slot
                    </Button>
                  </div>
                  
                  {formData.timeSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Add time slots when you're available for this activity
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                            className="bg-background/60"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                            className="bg-background/60"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Credits */}
            <div className="space-y-2">
              <Label htmlFor="credits" className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                <span>Credits *</span>
              </Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                placeholder="Enter credit amount"
                value={formData.credits}
                onChange={handleInputChange}
                min="1"
                required
                className="bg-background/60"
              />
              <p className="text-xs text-muted-foreground">
                {activityType === 'earn' 
                  ? 'How many credits you will earn for this activity'
                  : 'How many credits users need to pay for this activity'
                }
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Activity'}
              </Button>
            </div>
          </form>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CreateActivity;
