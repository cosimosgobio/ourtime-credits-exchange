import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { LocationAutocomplete } from '@/components/ui/LocationAutocomplete'; // Ensure correct import
import { toast } from 'sonner';
import { MapPin, Calendar, Clock, AlertCircle, CheckCircle2, Coins, Store, FileText } from 'lucide-react';
import cn from 'classnames';

const CreateActivity = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    locationDisplay: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    quantity: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activityType, setActivityType] = useState<'earn' | 'use'>('earn');

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category: category.id });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (address: string, displayValue?: string) => {
    setFormData({
      ...formData,
      location: address,
      locationDisplay: displayValue || address,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.title || !formData.category || !formData.location) {
      toast("Please fill out all required fields", {
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
      navigate('/');
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
                <span>Location *</span>
              </Label>
              <LocationAutocomplete
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="Enter a specific address or city"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date *</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="bg-background/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Start Time *</span>
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="bg-background/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>End Time *</span>
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="bg-background/60"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Quantity *</span>
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter the quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="bg-background/60"
                min="1"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Activity'}
            </Button>
          </form>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CreateActivity;
