import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import { studySpots } from '@/data/studySpots';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Cal State Fullerton coordinates for default center
const defaultCenter = {
  lat: 33.8816, // CSUF
  lng: -117.8854
};

const Map = () => {
  const { id } = useParams<{ id: string }>();
  
  // If on detail page, find the specific spot coordinates
  const spotCoordinates = id ? 
    studySpots.find(spot => spot.id === id)?.coordinates || defaultCenter : 
    defaultCenter;
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
  });

  if (!isLoaded) return <div className="flex items-center justify-center h-full bg-gray-100">Loading Map...</div>;

  return (
    <GoogleMap 
      mapContainerStyle={containerStyle} 
      center={spotCoordinates} 
      zoom={15}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }}
    >
      <Marker 
        position={spotCoordinates} 
        icon={{
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#9759f5", // studyspot-purple
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 1,
        }} 
      />
    </GoogleMap>
  );
};

export default Map;
