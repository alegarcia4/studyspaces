
import { useState, useEffect } from "react";
import { StudySpot } from "@/data/studySpots";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface MapViewProps {
  spots: StudySpot[];
  userLocation: { lat: number; lng: number } | null;
}

const MapView = ({ spots, userLocation }: MapViewProps) => {
  const { toast } = useToast();
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate map center based on spots or user location
  const getMapCenter = () => {
    if (userLocation) {
      return { lat: userLocation.lat, lng: userLocation.lng };
    }
    
    // Default to a central point if no user location
    return { lat: 34.052235, lng: -118.243683 }; // Los Angeles coordinates
  };

  const mapCenter = getMapCenter();

  const handleSpotClick = (spot: StudySpot) => {
    toast({
      title: spot.name,
      description: `${spot.distance} away - ${spot.hours}`,
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Map View</h3>
        <p className="text-xs text-studyspot-neutral mt-1">
          {spots.length} study spots shown on map
        </p>
      </div>
      
      <div className="flex-1 relative bg-gray-100 min-h-[400px]">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-studyspot-purple border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#e8e8e8]">
            {/* This would be replaced with an actual map library like Google Maps, Mapbox, or Leaflet */}
            <div className="relative h-full w-full overflow-hidden">
              {/* Simulated map background */}
              <div className="absolute inset-0">
                {/* Map grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-gray-300" 
                       style={{ top: `${i * 10}%` }} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-300" 
                       style={{ left: `${i * 10}%` }} />
                ))}
              </div>
              
              {/* Map center indicator (user location) */}
              {userLocation && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-blue-500 h-4 w-4 rounded-full animate-pulse border-2 border-white" />
                </div>
              )}
              
              {/* Study spot markers */}
              {spots.map((spot) => {
                // Generate pseudo-random positions for demo
                const spotId = parseInt(spot.id.replace(/\D/g, '')) || 0;
                const offsetX = ((spotId * 13) % 70) - 35;
                const offsetY = ((spotId * 17) % 70) - 35;
                
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                    style={{ 
                      left: `calc(50% + ${offsetX}px)`, 
                      top: `calc(50% + ${offsetY}px)`
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-studyspot-purple text-white p-1 rounded-full">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="bg-white shadow-md rounded px-2 py-1 mt-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {spot.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Map controls */}
            <div className="absolute right-4 bottom-4 flex flex-col gap-2">
              <Button size="icon" variant="secondary" className="bg-white shadow-md h-8 w-8">
                <span className="text-lg font-medium">+</span>
              </Button>
              <Button size="icon" variant="secondary" className="bg-white shadow-md h-8 w-8">
                <span className="text-lg font-medium">−</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
