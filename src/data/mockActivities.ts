import { ActivityCardProps } from '@/components/ui/activity-card';

// Helper types for the detailed activity data
export interface TimeSlot {
  id: string;
  day: number;
  start: string;
  end: string;
}

export interface CreatedBy {
  id: string;
  name: string;
  rating: number;
  reviews: number;
}

export interface DetailedActivity extends ActivityCardProps {
  description?: string;
  startTime?: string;
  endTime?: string;
  partialBooking?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  createdBy?: CreatedBy;
  availableTimeSlots?: TimeSlot[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Mock data for all activities
export const mockActivities: DetailedActivity[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Music & Entertainment',
    description: 'I offer beginner piano lessons for people of all ages. I have 5 years of experience teaching piano and can help you learn the basics in a fun and engaging way. The lesson will be...',
    location: 'Via Monte Rosa 16, 20148, Milan, Italy',
    coordinates: { lat: 45.478, lng: 9.151 },
    date: new Date(Date.now() + 86400000 * 2),
    startTime: '14:00',
    endTime: '15:00',
    duration: 1,
    credits: 10,
    status: 'available',
    partialBooking: false,
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
    description: 'I need help moving some furniture within my apartment. This includes a sofa, two bookshelves, and a dining table. The move should take about 2 hours and doesn\'t require any spec...',
    location: 'Via del Corso 12, 00186, Rome, Italy',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    date: new Date(Date.now() + 86400000 * 1),
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    credits: 20,
    status: 'available',
    partialBooking: false,
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
    description: 'Learn how to make authentic Italian lasagna from scratch. I will teach you my grandmother\'s secret recipe that has been passed down for generations. All ingredients and cooking ...',
    location: 'Via dei Calzaiuoli 8, 50122, Florence, Italy',
    coordinates: { lat: 43.7711, lng: 11.2536 },
    date: new Date(Date.now() + 86400000 * 3),
    startTime: '18:00',
    endTime: '20:00',
    duration: 2,
    credits: 8,
    status: 'available',
    partialBooking: false,
    createdBy: {
      id: 'user3',
      name: 'Maria Bianchi',
      rating: 4.9,
      reviews: 18,
    }
  },
  {
    id: '4',
    title: 'Bike Sharing Service',
    category: 'Mobility',
    description: 'Rent my city bike for your trips around the city. The bike is well-maintained and comes with a lock and helmet. Perfect for exploring the city without having to worry about publ...',
    location: 'Alexanderplatz, 10178 Berlin, Germany',
    coordinates: { lat: 52.5218, lng: 13.4132 },
    date: new Date(Date.now() + 86400000 * 1),
    startTime: '09:00',
    endTime: '19:00',
    duration: 2,
    credits: 20, 
    status: 'available',
    partialBooking: true,
    minQuantity: 1,
    maxQuantity: 10,
    createdBy: {
      id: 'user4',
      name: 'Hans Schmidt',
