
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "70vh",
};

const center = {
  lat: 33.8816, // CSUF location
  lng: -117.8854,
};

const MapView = () => {
  const navigate = useNavigate();
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
                Find Spots
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-studyspot-purple" />
                  Campus Study Spots
                </h2>
                <span className="text-xs text-studyspot-neutral">
                  Click on spots for more info
                </span>
              </div>
            </div>
            <div className="p-0">
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                <Marker position={center} />
                <Marker position={{lat: 33.8805, lng: -117.8851}} />
                <Marker position={{lat: 33.8830, lng: -117.8840}} />
              </GoogleMap>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapView;
