import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const containerStyle = {
  width: '100%',
  height: '500px',
};

interface MapViewProps {
  activities: {
    id: string;
    title: string;
    location: string;
    credits: number;
    coordinates: { lat: number; lng: number };
  }[];
  defaultCenter?: { lat: number; lng: number };
}

export function MapView({
  activities,
  defaultCenter = { lat: 41.9028, lng: 12.4964 }
}: MapViewProps) {
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          console.log("Detected user location:", userPos);
        },
        (error) => {
          console.error("Unable to get your location", error);
        }
      );
    } else {
      console.error("Your browser doesn't support geolocation");
    }
  };

  const bounds = L.latLngBounds(
    activities.map(activity => {
      if (activity.coordinates && activity.coordinates.lat && activity.coordinates.lng) {
        return activity.coordinates;
      } else {
        console.error(`Invalid coordinates for activity: ${activity.id}`, activity);
        return null;
      }
    }).filter(Boolean)
  );

  if (userLocation) {
    bounds.extend(userLocation);
  }

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    console.log("Map bounds:", bounds);
  }, [bounds]);

  return (
    <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm relative">
      <MapContainer
        style={containerStyle}
        center={defaultCenter}
        zoom={5}
        bounds={bounds.isValid() ? bounds : undefined}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=gx0LszzOzHY33jSxgeOC`}
          attribution='&copy; <a href="https://www.maptiler.com/copyright">MapTiler</a> contributors'
        />
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {activities.map(activity => (
          activity.coordinates && activity.coordinates.lat && activity.coordinates.lng ? (
            <Marker
              key={activity.id}
              position={activity.coordinates}
              eventHandlers={{
                click: () => {
                  setSelectedMarker(activity.id);
                },
              }}
            >
              {selectedMarker === activity.id && (
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground my-1">
                      {activity.location}
                    </p>
                    <p className="text-sm font-medium my-1">
                      {activity.credits} credits
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              )}
            </Marker>
          ) : (
            console.error(`Invalid coordinates for activity: ${activity.id}`, activity)
          )
        ))}
      </MapContainer>

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
