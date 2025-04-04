import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from './button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const getCoordinates = async (address: string) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
  }
  return { lat: 41.9028, lng: 12.4964 }; // Default to Rome if not found
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
  const [markers, setMarkers] = useState<{ id: string, position: { lat: number, lng: number }, title: string, location: string, credits: number }[]>([]);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const markerData = await Promise.all(activities.map(async (activity) => {
        const coordinates = await getCoordinates(activity.location);
        return {
          id: activity.id,
          position: coordinates,
          title: activity.title,
          location: activity.location,
          credits: activity.credits
        };
      }));
      setMarkers(markerData);
    };

    fetchCoordinates();
  }, [activities]);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => marker.position));
      if (userLocation) {
        bounds.extend(userLocation);
      }
      mapRef.current.fitBounds(bounds);
    }
  }, [markers, userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          if (mapRef.current) {
            mapRef.current.flyTo(userPos, 12);
          }
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

  return (
    <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm relative">
      <MapContainer
        style={containerStyle}
        center={defaultCenter}
        zoom={5}
        ref={mapRef}
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
