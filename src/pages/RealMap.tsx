
import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Compass, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studySpots } from "@/data/studySpots";

const containerStyle = {
  width: "100%",
  height: "70vh",
};

// Cal State Fullerton coordinates
const center = {
  lat: 33.8816,
  lng: -117.8854,
};

const MapView = () => {
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<typeof studySpots[0] | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  if (!isLoaded) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-studyspot-purple border-t-transparent rounded-full"></div>
        <span className="ml-3">Loading map...</span>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Study Map</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button 
                className="bg-studyspot-purple hover:bg-studyspot-light-purple flex items-center gap-2"
                onClick={() => navigate('/spots')}
              >
                <Compass className="h-4 w-4" />
                Find Spaces
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-studyspot-purple" />
                  Cal State Fullerton Study Spaces
                </h2>
                <span className="text-xs text-studyspot-neutral">
                  Click on spaces for more info
                </span>
              </div>
            </div>
            <div className="p-0">
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
                {/* Main CSUF marker */}
                <Marker 
                  position={center} 
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#FF8300", // CSUF orange color
                    fillOpacity: 0.8,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                  }}
                  title="Cal State Fullerton"
                />
                
                {/* Study spots markers */}
                {studySpots.map(spot => (
                  <Marker 
                    key={spot.id}
                    position={spot.coordinates}
                    onClick={() => setSelectedSpot(spot)}
                    title={spot.name}
                    icon={{
                      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                      scale: 6,
                      fillColor: "#9759f5", // studyspot-purple
                      fillOpacity: 1,
                      strokeColor: "#FFFFFF",
                      strokeWeight: 1,
                    }}
                  />
                ))}
                
                {/* Info window for selected spot */}
                {selectedSpot && (
                  <InfoWindow 
                    position={selectedSpot.coordinates}
                    onCloseClick={() => setSelectedSpot(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-lg">{selectedSpot.name}</h3>
                      <p className="text-sm mb-2">{selectedSpot.address}</p>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {selectedSpot.amenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="bg-studyspot-soft-purple text-studyspot-purple text-xs px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {selectedSpot.amenities.length > 3 && (
                          <span className="text-xs px-2 py-1">+{selectedSpot.amenities.length - 3} more</span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-studyspot-purple hover:bg-studyspot-light-purple"
                        onClick={() => navigate(`/spot/${selectedSpot.id}`)}
                      >
                        <Info className="h-3 w-3 mr-1" /> View Details
                      </Button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapView;
