// src/components/Maps.tsx
import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useParams } from 'react-router-dom';
import { studySpots, StudySpot } from '@/data/studySpots'; // Import StudySpot type
import { mapStyleDark } from '@/lib/mapStyles';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const containerStyle = {
    width: '100%',
    height: '100%', // Ensure it fills parent container
};

// Cal State Fullerton coordinates for default center
const defaultCenter = {
    lat: 33.8816, // CSUF
    lng: -117.8854
};

const Map = () => {
    const { id } = useParams<{ id: string }>();
    const [spot, setSpot] = React.useState<StudySpot | null>(null);

    // Helper functions (copied from DetailPage)
    const parseCoordinates = (address: string): { lat: number, lng: number } | null => {
        const parts = address.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
        const match = address.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
        if (match && match.length === 3) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
        return null;
    };

    const generateRandomCoordsNearCSUF = (): { lat: number, lng: number } => {
        const csufLat = 33.8816;
        const csufLng = -117.8854;
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        return { lat: csufLat + latOffset, lng: csufLng + lngOffset };
    };

    React.useEffect(() => {
        if (id) {
            const foundSpot = studySpots.find(s => s.id === id);
            if (foundSpot) {
                setSpot({
                    ...foundSpot,
                    coordinates: foundSpot.coordinates || parseCoordinates(foundSpot.address) || generateRandomCoordsNearCSUF()
                });
            } else {
                setSpot(null); // Spot not found
            }
        }
    }, [id]);


    const spotCoordinates = spot?.coordinates || defaultCenter;
    const mapCenter = spot?.coordinates || defaultCenter; // Center on spot if found

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    });

    if (loadError) {
        return <div className="flex items-center justify-center h-full bg-destructive/10 text-destructive-foreground p-4 text-center text-xs rounded">Map Error</div>;
    }
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full bg-muted rounded">
                <Skeleton className="w-full h-full" />
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={16} // Zoom in a bit more for detail view
            options={{
                zoomControl: true, // Keep zoom control for detail map
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: mapStyleDark, // Apply dark style
                gestureHandling: 'cooperative',
            }}
        >
            {spot && spot.coordinates && (
                <Marker
                    position={spot.coordinates}
                    icon={{ // Use custom icon consistent with MapView
                        url: '/map-marker-icon.svg',
                        scaledSize: new google.maps.Size(30, 30),
                        anchor: new google.maps.Point(15, 30),
                    }}
                    title={spot.name}
                />
            )}
            {/* Optional: Add CSUF marker for context */}
            {/* <Marker position={defaultCenter} ... /> */}
        </GoogleMap>
    );
};

export default Map;