// src/components/MapView.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { StudySpot } from "@/data/studySpots";
import { MapPin, Plus, Minus } from "lucide-react"; // Changed zoom icons
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { mapStyleDark } from "@/lib/mapStyles"; // Import the style
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { useNavigate } from "react-router-dom"; // Import for navigation

// Define the map container style
const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

// Define map UI options
const options = {
    disableDefaultUI: true, // Cleaner look, add custom controls
    zoomControl: false, // Disable default zoom, use custom
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: mapStyleDark, // Apply the dark style
    gestureHandling: "cooperative", // Better for touch devices
};

// Cal State Fullerton coordinates
const csufCoordinates = { lat: 33.8816, lng: -117.8854 };

interface MapViewProps {
    spots: StudySpot[];
    userLocation: { lat: number; lng: number } | null;
}

const MapView = ({ spots, userLocation }: MapViewProps) => {
    const { toast } = useToast();
    const [selectedSpot, setSelectedSpot] = useState<StudySpot | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const navigate = useNavigate(); // Hook for navigation

    // Load the Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"], // Keep places if needed elsewhere, otherwise remove
    });

    // Calculate map center
    const getMapCenter = useCallback(() => {
        if (userLocation) {
            return userLocation;
        }
        // Simple fallback to CSUF if no user location
        return csufCoordinates;
    }, [userLocation]);

    const mapCenter = getMapCenter();

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
         // Fit bounds to markers if spots exist? Optional.
         if (spots.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            spots.forEach(spot => {
                if (spot.coordinates) {
                    bounds.extend(spot.coordinates);
                }
            });
             if (userLocation) {
                 bounds.extend(userLocation);
             } else {
                 bounds.extend(csufCoordinates); // Include default center if no user loc
             }
            // map.fitBounds(bounds); // This might zoom out too much initially

            // Optional: Add padding to fitBounds
            // map.fitBounds(bounds, 100); // 100px padding
         }
    }, [spots, userLocation]); // Add dependencies

    const handleMarkerClick = (spot: StudySpot) => {
        setSelectedSpot(spot);
        if (mapRef.current && spot.coordinates) {
            mapRef.current.panTo(spot.coordinates);
        }
    };

    const handleZoomIn = () => {
        if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom() || 13; // Default zoom if undefined
            mapRef.current.setZoom(currentZoom + 1);
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom() || 13;
            mapRef.current.setZoom(currentZoom - 1);
        }
    };

    const handleInfoWindowClick = (spotId: string) => {
        navigate(`/spot/${spotId}`);
    };

    // Loading/Error States
    if (loadError) {
        return (
            <div className="bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col text-card-foreground border border-destructive">
                <div className="p-4 border-b border-destructive">
                    <h3 className="font-medium text-destructive-foreground">Map Error</h3>
                </div>
                <div className="flex-1 relative bg-destructive/10 min-h-[400px] flex items-center justify-center p-4 text-center">
                    <p className="text-sm text-destructive-foreground">Could not load Google Maps. Please check the API key and network connection.</p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col text-card-foreground border border-border">
                <div className="p-4 border-b border-border">
                    <h3 className="font-medium">Map View</h3>
                    <p className="text-xs text-muted-foreground mt-1">Loading map...</p>
                </div>
                <div className="flex-1 relative bg-muted min-h-[400px]">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Map Render
    return (
        <div className="bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col border border-border">
            <div className="p-4 border-b border-border">
                <h3 className="font-medium text-card-foreground">Map View</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {spots.length} study spots shown
                </p>
            </div>

            <div className="flex-1 relative bg-muted">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={14} // Slightly more zoomed in default
                    options={options}
                    onLoad={onMapLoad}
                    onClick={() => setSelectedSpot(null)} // Close info window on map click
                >
                    {/* User location marker */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                url: '/location-pin.svg', // Custom SVG icon for user location
                                scaledSize: new google.maps.Size(24, 24),
                                anchor: new google.maps.Point(12, 24),
                            }}
                            title="Your Location"
                            zIndex={10} // Ensure user pin is above others
                        />
                    )}

                    {/* Cal State Fullerton marker (optional, can be subtle) */}
                    <Marker
                        position={csufCoordinates}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 5,
                            fillColor: "#FFA500",
                            fillOpacity: 0.7,
                            strokeWeight: 0, // No stroke for subtle look
                        }}
                        title="Cal State Fullerton"
                        zIndex={1}
                    />

                    {/* Study spot markers */}
                    {spots.map((spot) => {
                        if (!spot.coordinates) return null;
                        return (
                            <Marker
                                key={spot.id}
                                position={spot.coordinates}
                                onClick={() => handleMarkerClick(spot)}
                                icon={{ // Custom icon for spots
                                    url: '/map-marker-icon.svg', // Example path, create this SVG
                                    scaledSize: new google.maps.Size(30, 30),
                                    anchor: new google.maps.Point(15, 30), // Point at the bottom center
                                }}
                                title={spot.name}
                                zIndex={5}
                            />
                        );
                    })}

                    {/* Info window for selected spot */}
                    {selectedSpot && selectedSpot.coordinates && (
                        <InfoWindow
                            position={selectedSpot.coordinates}
                            onCloseClick={() => setSelectedSpot(null)}
                            options={{
                                pixelOffset: new google.maps.Size(0, -35), // Adjust offset based on marker size
                                disableAutoPan: true // Prevent map panning when opening
                             }}
                        >
                            {/* Style the InfoWindow content */}
                             <div className="p-2 bg-popover text-popover-foreground rounded shadow-lg max-w-[200px] text-xs" style={{ fontFamily: 'sans-serif' }}> {/* Add font family */}
                                <h3 className="font-semibold text-sm mb-1 truncate">{selectedSpot.name}</h3>
                                <p className="text-muted-foreground mb-1 truncate">{selectedSpot.distance ?? 'N/A'} away</p>
                                <p className="text-muted-foreground truncate">{selectedSpot.hours}</p>
                                 <Button size="sm" variant="link" className="p-0 h-auto mt-1 text-xs text-primary" onClick={() => handleInfoWindowClick(selectedSpot.id)}>
                                     View Details
                                 </Button>
                             </div>
                        </InfoWindow>
                    )}
                </GoogleMap>

                {/* Custom Map controls */}
                <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                    <Button size="icon" variant="secondary" className="bg-card/80 backdrop-blur-sm shadow-md h-8 w-8 border border-border hover:bg-secondary" onClick={handleZoomIn}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Zoom In</span>
                    </Button>
                    <Button size="icon" variant="secondary" className="bg-card/80 backdrop-blur-sm shadow-md h-8 w-8 border border-border hover:bg-secondary" onClick={handleZoomOut}>
                        <Minus className="h-4 w-4" />
                         <span className="sr-only">Zoom Out</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MapView;