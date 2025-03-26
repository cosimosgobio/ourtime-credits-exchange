
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './button';

// Fix marker icon issue with Leaflet in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up the default icon for Leaflet
// This fixes the _getIconUrl error
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface MapViewProps {
  activities: Array<{
    id: string;
    title: string;
    location: string;
    credits: number;
  }>;
  defaultCenter?: [number, number];
}

export function MapView({ activities, defaultCenter = [41.9028, 12.4964] }: MapViewProps) {
  const navigate = useNavigate();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Ensure the map is only initialized in the browser
    setMapReady(true);
  }, []);

  // Helper function to convert addresses to coordinates
  // In a real app, this would use geocoding API
  const getCoordinates = (location: string): [number, number] => {
    // Mock location database
    const locationMap: Record<string, [number, number]> = {
      'Rome, Italy': [41.9028, 12.4964],
      'Milan, Italy': [45.4642, 9.1900],
      'Florence, Italy': [43.7696, 11.2558],
      'Naples, Italy': [40.8518, 14.2681],
      'Venice, Italy': [45.4408, 12.3155],
    };
    
    return locationMap[location] || defaultCenter;
  };

  if (!mapReady) {
    return (
      <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    );
  }

  // Create marker components outside the MapContainer to prevent context issues
  const markers = activities.map((activity) => {
    const position = getCoordinates(activity.location);
    
    return {
      id: activity.id,
      position,
      title: activity.title,
      location: activity.location,
      credits: activity.credits
    };
  });

  return (
    <div className="w-full h-[calc(100vh-360px)] min-h-[400px] rounded-lg overflow-hidden border shadow-sm">
      <MapContainer 
        center={defaultCenter}
        zoom={5} 
        className="h-full w-full z-0"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="p-1">
                <h3 className="font-medium">{marker.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{marker.location}</p>
                <p className="text-sm font-medium mb-2">{marker.credits} credits</p>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/activity/${marker.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
