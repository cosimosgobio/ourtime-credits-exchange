import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

const getCoordinates = (address: string) => {
  // Replace with actual geocoding logic
  return { lat: 41.9028, lng: 12.4964 };
};

interface MapViewProps {
  activities: any[];
  defaultCenter?: { lat: number; lng: number };
}

export function MapView({
  activities,
  defaultCenter = { lat: 41.9028, lng: 12.4964 }
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
        Use My Location
      </Button>
    </div>
  );
}
