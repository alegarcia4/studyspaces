import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Navbar from "@/components/Navbar";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 33.8816, // CSUF location
  lng: -117.8854,
};

const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Study Map</h1>
        <div className="flex justify-center">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
            <Marker position={center} />
          </GoogleMap>
        </div>
      </main>
    </div>
  );
};

export default MapView;