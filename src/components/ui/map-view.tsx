
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { ActivityCardProps } from './activity-card';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  activities: ActivityCardProps[];
  defaultCenter?: [number, number]; // [latitude, longitude]
}

export function MapView({ activities, defaultCenter = [41.9028, 12.4964] }: MapViewProps) {
  const navigate = useNavigate();

  // Helper function to convert addresses to coordinates
  // In a real app, this would use geocoding API
  const getCoordinates = (location: string): [number, number] => {
    // This is a simplified mock implementation
    // In reality, you would use a geocoding service
    const locationMap: Record<string, [number, number]> = {
      'Milan, Italy': [45.4642, 9.1900],
      'Rome, Italy': [41.9028, 12.4964],
      'Florence, Italy': [43.7696, 11.2558],
      // Add more mappings as needed
    };
    
    return locationMap[location] || defaultCenter;
  };

  return (
    <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activities.map((activity) => {
          const coordinates = getCoordinates(activity.location);
          return (
            <Marker
              key={activity.id}
              position={coordinates}
              eventHandlers={{
                click: () => {
                  navigate(`/activity/${activity.id}`);
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold mb-1">{activity.title}</h3>
                  <p className="text-sm mb-1">{activity.category}</p>
                  <p className="text-sm">{activity.credits} credits</p>
                </div>
              </Popup>
            </Marker>
          )}
        )}
      </MapContainer>
    </div>
  );
}
