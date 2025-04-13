
import { useState, useEffect, useCallback, useRef } from "react";
import { StudySpot } from "@/data/studySpots";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

// Define the map container style
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
};

// Define map UI options
const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

interface MapViewProps {
  spots: StudySpot[];
  userLocation: { lat: number; lng: number } | null;
}

const MapView = ({ spots, userLocation }: MapViewProps) => {
  const { toast } = useToast();
  const [selectedSpot, setSelectedSpot] = useState<StudySpot | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY", // Replace with your actual API key
    libraries: ["places"],
  });

  // Calculate map center based on spots or user location
  const getMapCenter = useCallback(() => {
    if (userLocation) {
      return { lat: userLocation.lat, lng: userLocation.lng };
    }
    
    // If we have spots with valid coordinates, use average of spots
    const validSpots = spots.filter(spot => {
      const [lat, lng] = spot.address.split(',').map(coord => parseFloat(coord.trim()));
      return !isNaN(lat) && !isNaN(lng);
    });
    
    if (validSpots.length > 0) {
      const latSum = validSpots.reduce((sum, spot) => {
        const lat = parseFloat(spot.address.split(',')[0].trim());
        return sum + lat;
      }, 0);
      
      const lngSum = validSpots.reduce((sum, spot) => {
        const lng = parseFloat(spot.address.split(',')[1].trim());
        return sum + lng;
      }, 0);
      
      return {
        lat: latSum / validSpots.length,
        lng: lngSum / validSpots.length
      };
    }
    
    // Default to a central point if no user location
    return { lat: 34.052235, lng: -118.243683 }; // Los Angeles coordinates
  }, [spots, userLocation]);

  const mapCenter = getMapCenter();
  
  // Save map instance when it loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle spot click
  const handleSpotClick = (spot: StudySpot) => {
    setSelectedSpot(spot);
    toast({
      title: spot.name,
      description: `${spot.distance} away - ${spot.hours}`,
    });
  };

  // Handle zoom in
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || 10) + 1);
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || 10) - 1);
    }
  };
  
  // Show loading state
  if (loadError) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium">Map View</h3>
          <p className="text-xs text-studyspot-neutral mt-1">
            Error loading maps
          </p>
        </div>
        <div className="flex-1 relative bg-gray-100 min-h-[400px] flex items-center justify-center">
          <p>Error loading Google Maps. Please check your internet connection.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium">Map View</h3>
          <p className="text-xs text-studyspot-neutral mt-1">
            Loading map...
          </p>
        </div>
        <div className="flex-1 relative bg-gray-100 min-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-studyspot-purple border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Map View</h3>
        <p className="text-xs text-studyspot-neutral mt-1">
          {spots.length} study spots shown on map
        </p>
      </div>
      
      <div className="flex-1 relative bg-gray-100 min-h-[400px]">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
          options={options}
          onLoad={onMapLoad}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
            />
          )}
          
          {/* Study spot markers */}
          {spots.map((spot) => {
            // Extract coordinates from address string
            const [latStr, lngStr] = spot.address.split(',');
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            
            // Skip invalid coordinates
            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Invalid coordinates for spot: ${spot.name}`);
              return null;
            }
            
            return (
              <Marker
                key={spot.id}
                position={{ lat, lng }}
                onClick={() => handleSpotClick(spot)}
                icon={{
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: "#9759f5", // studyspot-purple
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 1,
                }}
              />
            );
          })}
          
          {/* Info window for selected spot */}
          {selectedSpot && (
            <InfoWindow
              position={{ 
                lat: parseFloat(selectedSpot.address.split(',')[0]), 
                lng: parseFloat(selectedSpot.address.split(',')[1]) 
              }}
              onCloseClick={() => setSelectedSpot(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedSpot.name}</h3>
                <p className="text-xs">{selectedSpot.distance} away</p>
                <p className="text-xs">{selectedSpot.hours}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        
        {/* Map controls */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="bg-white shadow-md h-8 w-8" onClick={handleZoomIn}>
            <span className="text-lg font-medium">+</span>
          </Button>
          <Button size="icon" variant="secondary" className="bg-white shadow-md h-8 w-8" onClick={handleZoomOut}>
            <span className="text-lg font-medium">−</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
