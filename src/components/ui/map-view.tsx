
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ActivityCardProps } from './activity-card';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './input';

// Temporary access token - in production, this should be handled securely
// Users should create their own Mapbox account and use their own token
// Note: This token may be expired or invalid
const MAPBOX_TOKEN = '';

interface MapViewProps {
  activities: ActivityCardProps[];
  defaultCenter?: [number, number]; // [longitude, latitude]
}

export function MapView({ activities, defaultCenter = [12.4964, 41.9028] }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const navigate = useNavigate();
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get token from localStorage
    return localStorage.getItem('mapbox_token') || MAPBOX_TOKEN;
  });
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!mapboxToken);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Helper function to convert addresses to coordinates
  // In a real app, this would use geocoding API
  const getCoordinates = (location: string): [number, number] => {
    // This is a simplified mock implementation
    // In reality, you would use the Mapbox Geocoding API
    const locationMap: Record<string, [number, number]> = {
      'Milan, Italy': [9.1900, 45.4642],
      'Rome, Italy': [12.4964, 41.9028],
      'Florence, Italy': [11.2558, 43.7696],
      // Add more mappings as needed
    };
    
    return locationMap[location] || defaultCenter;
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;
    
    // Clear any previous errors
    setMapError(null);

    try {
      // Initialize the map
      mapboxgl.accessToken = mapboxToken;
      
      // If we already have a map instance, remove it
      if (map.current) {
        map.current.remove();
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: defaultCenter,
        zoom: 5
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );

      // Save token to localStorage if successful
      localStorage.setItem('mapbox_token', mapboxToken);
      
      map.current.on('load', () => {
        setMapLoaded(true);
        // Add markers once map is loaded
        addMarkersToMap();
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Error loading map. Please check your Mapbox token.');
        setShowTokenInput(true);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please provide a valid Mapbox token.');
      setShowTokenInput(true);
    }
  };

  // Add markers to the map
  const addMarkersToMap = () => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Remove existing popups
    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];

    // Add markers for activities
    activities.forEach(activity => {
      const coordinates = getCoordinates(activity.location);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div>
          <h3 style="font-weight: bold; margin-bottom: 5px;">${activity.title}</h3>
          <p style="margin-bottom: 5px;">${activity.category}</p>
          <p style="margin-bottom: 5px;">${activity.credits} credits</p>
        </div>
      `);
      
      popupsRef.current.push(popup);

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = '#3b82f6';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current);
        
      marker.getElement().addEventListener('click', () => {
        navigate(`/activity/${activity.id}`);
      });
      
      markersRef.current.push(marker);
    });
  };

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      initializeMap();
      setShowTokenInput(false);
    } else {
      toast.error("Please enter a Mapbox token");
    }
  };

  // Initialize map on component mount or when token changes
  useEffect(() => {
    initializeMap();
    
    // Clean up on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      map.current?.remove();
    };
  }, [defaultCenter]); // Only re-run if defaultCenter changes

  // Update markers when activities change
  useEffect(() => {
    addMarkersToMap();
  }, [activities, mapLoaded]);

  return (
    <div className="relative w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm">
      {showTokenInput && (
        <div className="absolute inset-0 z-10 bg-background/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-lg shadow-lg border max-w-md w-full">
            <div className="flex items-start mb-4">
              <AlertCircle className="text-amber-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-1">Mapbox Access Token Required</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {mapError || "The map requires a valid Mapbox access token to display properly."}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <p className="text-sm mb-2">
                  You need to create a free Mapbox account and get your public token:
                </p>
                <a 
                  href="https://account.mapbox.com/auth/signup/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-primary hover:underline mb-4"
                >
                  Sign up for Mapbox <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <Input
                  type="text"
                  placeholder="Enter your Mapbox access token"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="w-full mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Your token will be saved in your browser for future visits
                </p>
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  <MapPin className="mr-2 h-4 w-4" />
                  Apply Token
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
