
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from './button';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

const googleMapsApiKey = ""; // In a real app, you'd set this to your Google Maps API key

export interface MapViewProps {
  activities: Array<{
    id: string;
    title: string;
    location: string;
    credits: number;
  }>;
  defaultCenter?: { lat: number; lng: number };
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Helper function to convert addresses to coordinates
// In a real app, this would use geocoding API
const getCoordinates = (location: string): { lat: number; lng: number } => {
  // Parse addresses to extract city name
  const cityMatch = location.match(/([A-Za-z\s]+),\s*[A-Za-z\s]+$/);
  const cityName = cityMatch ? cityMatch[1].trim() : '';
  
  // Mock location database
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Florence': { lat: 43.7696, lng: 11.2558 },
    'Naples': { lat: 40.8518, lng: 14.2681 },
    'Venice': { lat: 45.4408, lng: 12.3155 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Barcelona': { lat: 41.3851, lng: 2.1734 },
    'Cairo': { lat: 30.0444, lng: 31.2357 },
    'Rio': { lat: -22.9068, lng: -43.1729 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Berlin': { lat: 52.5200, lng: 13.4050 },
  };
  
  // First try to match the city name
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.includes(key)) {
      return coords;
    }
  }
  
  // If no match, return default (Rome)
  return { lat: 41.9028, lng: 12.4964 };
};

export function MapView({ 
  activities, 
  defaultCenter = { lat: 41.9028, lng: 12.4964 } // Rome as default
}: MapViewProps) {
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
          toast.success("Location detected", {
            description: "Using your current location"
          });
        },
        () => {
          toast.error("Location error", {
            description: "Unable to get your location"
          });
        }
      );
    } else {
      toast.error("Geolocation unavailable", {
        description: "Your browser doesn't support geolocation"
      });
    }
  };

  // Convert activity locations to marker data
  const markers = activities.map(activity => ({
    id: activity.id,
    position: getCoordinates(activity.location),
    title: activity.title,
    location: activity.location,
    credits: activity.credits
  }));

  // Update marker coordinates whenever activities change
  useEffect(() => {
    console.log("Activities for map:", activities.length);
    console.log("Markers created:", markers.length);
  }, [activities]);

  if (!isLoaded) {
    return (
      <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm flex items-center justify-center bg-gradient-accent">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          }
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            }}
          />
        )}

        {/* Activity markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker.id)}
          />
        ))}

        {/* Info windows for selected marker */}
        {selectedMarker && 
          markers.find(m => m.id === selectedMarker) && (
            <InfoWindow
              position={markers.find(m => m.id === selectedMarker)!.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-medium">{markers.find(m => m.id === selectedMarker)!.title}</h3>
                <p className="text-sm text-muted-foreground my-1">
                  {markers.find(m => m.id === selectedMarker)!.location}
                </p>
                <p className="text-sm font-medium my-1">
                  {markers.find(m => m.id === selectedMarker)!.credits} credits
                </p>
                <Button 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate(`/activity/${selectedMarker}`)}
                >
                  View Details
                </Button>
              </div>
            </InfoWindow>
          )
        }
      </GoogleMap>
      
      {/* Use my location button */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-3 right-3 z-10 shadow-md"
        onClick={getUserLocation}
      >
        <Navigation className="h-4 w-4 mr-1" />
        Use My Location
      </Button>
    </div>
  );
}
