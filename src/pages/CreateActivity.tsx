import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelector, Category } from '@/components/ui/category-selector';
import { LocationInput } from '@/components/ui/location-input';
import { toast } from 'sonner';
import { 
  MapPin, Calendar, Clock, AlertCircle, CheckCircle2 
} from 'lucide-react';

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
      locationDisplay: displayValue || address
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e
