
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
}

// Mock data for all activities
export const mockActivities: DetailedActivity[] = [
  {
    id: '1',
    title: 'Piano Lessons for Beginners',
    category: 'Music & Entertainment',
    description: 'I offer beginner piano lessons for people of all ages. I have 5 years of experience teaching piano and can help you learn the basics in a fun and engaging way. The lesson will be held at my home studio which has a grand piano.',
    location: 'Via Monte Rosa 16, 20148, Milan, Italy',
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
    description: 'I need help moving some furniture within my apartment. This includes a sofa, two bookshelves, and a dining table. The move should take about 2 hours and doesn\'t require any special equipment.',
    location: 'Via del Corso 12, 00186, Rome, Italy',
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
    description: 'Learn how to make authentic Italian lasagna from scratch. I will teach you my grandmother\'s secret recipe that has been passed down for generations. All ingredients and cooking equipment will be provided.',
    location: 'Via dei Calzaiuoli 8, 50122, Florence, Italy',
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
    description: 'Rent my city bike for your trips around the city. The bike is well-maintained and comes with a lock and helmet. Perfect for exploring the city without having to worry about public transportation.',
    location: 'Alexanderplatz, 10178 Berlin, Germany',
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
      rating: 4.6,
      reviews: 10,
    }
  },
  {
    id: '5',
    title: 'Rome Walking Tour Guide',
    category: 'Holiday & Trips',
    description: 'Explore the ancient wonders of Rome with a local guide. This walking tour covers the Colosseum, Roman Forum, Pantheon, and Trevi Fountain. I will share historical facts and local insights that you won\'t find in guidebooks.',
    location: 'Piazza del Colosseo, 00184 Rome, Italy',
    date: new Date(Date.now() + 86400000 * 5),
    startTime: '09:00',
    endTime: '12:00',
    duration: 3,
    credits: 30,
    status: 'available',
    partialBooking: false,
    createdBy: {
      id: 'user5',
      name: 'Andrea Romano',
      rating: 4.9,
      reviews: 25,
    }
  },
  {
    id: '6',
    title: 'Beta Test New Organic Snacks',
    category: 'Try a Product',
    description: "Be part of our taste test panel for a new line of organic snacks. You'll sample various flavors and provide feedback on taste, packaging, and overall experience. Your input will help shape the final product before market launch.",
    location: '350 Fifth Avenue, New York, NY 10118, USA',
    date: new Date(Date.now() + 86400000 * 2),
    startTime: '14:00',
    endTime: '15:00',
    duration: 1,
    credits: 10,
    status: 'available',
    partialBooking: false,
    createdBy: {
      id: 'user6',
      name: 'James Wilson',
      rating: 4.7,
      reviews: 15,
    }
  },
  {
    id: '7',
    title: 'Teach Spanish Basics',
    category: 'Education',
    description: 'Learn the basics of Spanish conversation with a fluent speaker. This session is perfect for beginners or those looking to refresh their knowledge. We will focus on practical phrases for travel and everyday situations.',
    location: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
    date: new Date(Date.now() + 86400000 * 4),
    startTime: '17:00',
    endTime: '19:00',
    duration: 2,
    credits: 20,
    status: 'available',
    partialBooking: false,
    createdBy: {
      id: 'user7',
      name: 'Carmen Rodriguez',
      rating: 4.8,
      reviews: 14,
    }
  },
  {
    id: '8',
    title: 'Small Garden Maintenance',
    category: 'Gardening',
    description: 'Help with maintaining a small urban garden. Tasks include planting seasonal flowers, pruning shrubs, and general garden cleanup. All tools and gardening supplies will be provided.',
    location: 'Prenzlauer Berg, Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 2),
    startTime: '10:00',
    endTime: '13:00',
    duration: 3,
    credits: 30,
    status: 'available',
    partialBooking: true,
    minQuantity: 1,
    maxQuantity: 3,
    createdBy: {
      id: 'user8',
      name: 'Greta Müller',
      rating: 4.5,
      reviews: 8,
    }
  },
  {
    id: '9',
    title: 'Elderly Care Assistance',
    category: 'Care',
    description: 'Provide companionship and assistance to an elderly person. This could include reading, playing board games, helping with light housework, or simply having a friendly conversation. Your time and attention mean a lot.',
    location: 'Rue de Rivoli, 75001 Paris, France',
    date: new Date(Date.now() + 86400000 * 1),
    startTime: '14:00',
    endTime: '18:00',
    duration: 4,
    credits: 40,
    status: 'available',
    partialBooking: true,
    minQuantity: 1,
    maxQuantity: 4,
    createdBy: {
      id: 'user9',
      name: 'Sophie Dubois',
      rating: 4.9,
      reviews: 20,
    }
  },
  {
    id: '10',
    title: 'Smartphone Photography Workshop',
    category: 'Arts',
    description: 'Learn how to take professional-quality photos with just your smartphone. This workshop covers composition, lighting, editing, and useful apps. Suitable for all smartphone users who want to improve their photography skills.',
    location: 'Museumplein, Amsterdam, Netherlands',
    date: new Date(Date.now() + 86400000 * 7),
    startTime: '13:00',
    endTime: '15:00',
    duration: 2, 
    credits: 20,
    status: 'available',
    partialBooking: false,
    createdBy: {
      id: 'user10',
      name: 'Jan van der Berg',
      rating: 4.7,
      reviews: 12,
    }
  },
  {
    id: '11',
    title: 'Share Homegrown Vegetables',
    category: 'Give',
    description: 'I have an abundance of fresh, organic vegetables from my garden to share. Available are tomatoes, zucchini, bell peppers, and herbs. All grown without pesticides in my community garden plot.',
    location: "Campo de' Fiori, Rome, Italy",
    date: new Date(Date.now() + 86400000 * 3),
    startTime: '09:00',
    endTime: '10:00',
    duration: 1,
    credits: 10,
    status: 'available',
    partialBooking: false,
    createdBy: {
      id: 'user11',
      name: 'Lucia Ferrari',
      rating: 4.6,
      reviews: 5,
    }
  },
  {
    id: '12',
    title: 'Lend Professional Camera',
    category: 'Lend',
    description: 'Borrow my DSLR camera and lens set for your photography needs. The kit includes a Canon EOS 80D, three lenses (wide, standard, and telephoto), a tripod, and a carrying case. Perfect for special events or travel photography.',
    location: 'Friedrichstraße, Berlin, Germany',
    date: new Date(Date.now() + 86400000 * 5),
    startTime: '08:00',
    endTime: '20:00',
    duration: 2,
    credits: 20,
    status: 'available',
    partialBooking: true,
    minQuantity: 1,
    maxQuantity: 5,
    createdBy: {
      id: 'user12',
      name: 'Thomas Weber',
      rating: 4.8,
      reviews: 9,
    }
  },
  {
    id: '13',
    title: 'Test New Smartphone Prototype',
    category: 'Try a Product',
    description: "Be among the first to test our new smartphone prototype before it hits the market. You'll have the opportunity to provide feedback that could influence the final product. The test period is 7 days.",
    location: 'Silicon Valley, CA, USA',
    date: new Date(Date.now() + 86400000 * 10),
    startTime: '09:00',
    endTime: '17:00',
    duration: 7,
    credits: 70,
    status: 'available',
    partialBooking: true,
    minQuantity: 1,
    maxQuantity: 7,
    createdBy: {
      id: 'user13',
      name: 'Alex Johnson',
      rating: 4.7,
      reviews: 15,
    },
    availableTimeSlots: [
      { id: '1', day: 0, start: '09:00', end: '12:00' },
      { id: '2', day: 0, start: '13:00', end: '17:00' },
      { id: '3', day: 1, start: '09:00', end: '12:00' },
      { id: '4', day: 1, start: '13:00', end: '17:00' },
      { id: '5', day: 2, start: '09:00', end: '12:00' },
    ]
  },
  {
    id: '14',
    title: 'Beach House Weekend',
    category: 'Holiday & Trips',
    description: 'Spend the weekend at my beach house. Beautiful ocean view, 3 bedrooms, full kitchen. Perfect for a family or small group of friends looking for a relaxing weekend getaway.',
    location: 'Ocean Drive, Miami Beach, FL 33139, USA',
    date: new Date(Date.now() + 86400000 * 14),
    startTime: '12:00',
    endTime: '12:00',
    duration: 48,
    credits: 480,
    status: 'available',
    partialBooking: true,
    minQuantity: 12,
    maxQuantity: 48,
    createdBy: {
      id: 'user14',
      name: 'Elena Verdi',
      rating: 4.9,
      reviews: 32,
    }
  },
];

// Export a version that conforms strictly to ActivityCardProps for components that only need the card data
export const mockActivityCards: ActivityCardProps[] = mockActivities.map(activity => ({
  id: activity.id,
  title: activity.title,
  category: activity.category,
  location: activity.location,
  date: activity.date,
  duration: activity.duration,
  credits: activity.credits,
  status: activity.status,
}));
