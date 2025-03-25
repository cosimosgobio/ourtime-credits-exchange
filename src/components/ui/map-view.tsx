
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ActivityCardProps } from './activity-card';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { MapPin } from 'lucide-react';

// Temporary access token - in production, this should be handled securely
// Users should create their own Mapbox account and use their own token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2xzanFwNHBnMDI2MDJpbGVndnYzMzdiaSJ9.q1fy9DUvMV7P8t9GbwKfKw';

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
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);

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

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize the map
    mapboxgl.accessToken = mapboxToken;
    
    try {
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

      // Clean up on unmount
      return () => {
        markersRef.current.forEach(marker => marker.remove());
        popupsRef.current.forEach(popup => popup.remove());
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }
  }, [mapboxToken, defaultCenter]);

  useEffect(() => {
    if (!map.current) return;

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
  }, [activities, navigate]);

  return (
    <div className="relative w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm">
      {showTokenInput && (
        <div className="absolute inset-0 z-10 bg-background/90 flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-4">Mapbox Access Token Required</h3>
          <p className="mb-4 text-center text-muted-foreground">
            To use the map feature, you need to provide your Mapbox access token. 
            Get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary">mapbox.com</a>
          </p>
          <input
            type="text"
            placeholder="Enter your Mapbox access token"
            className="w-full p-2 mb-4 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button onClick={() => setShowTokenInput(false)}>
            <MapPin className="mr-2 h-4 w-4" />
            Apply Token
          </Button>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
