import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from './button';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  width: '100%',
  height: '500px',
};

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

  return (
    <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm relative">
      <MapContainer
        style={containerStyle}
        center={mapCenter}
        zoom={5}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Activity markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => {
                setSelectedMarker(marker.id);
              },
            }}
          >
            {selectedMarker === marker.id && (
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-medium">{marker.title}</h3>
                  <p className="text-sm text-muted-foreground my-1">
                    {marker.location}
                  </p>
                  <p className="text-sm font-medium my-1">
                    {marker.credits} credits
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigate(`/activity/${marker.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

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
