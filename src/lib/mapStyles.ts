// src/lib/mapStyles.ts

// Simple Dark Theme for Google Maps
export const mapStyleDark: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#1f2937" }] }, // Darker blue-grey base
    { elementType: "labels.text.stroke", stylers: [{ color: "#1f2937" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] }, // Grey text
    {
        featureType: "administrative", // Country, state borders etc.
        elementType: "geometry.stroke",
        stylers: [{ color: "#4b5563" }], // Slightly lighter border
    },
    {
        featureType: "administrative.locality", // City names
        elementType: "labels.text.fill",
        stylers: [{ color: "#d1d5db" }], // Lighter grey for cities
    },
    {
        featureType: "poi", // Points of Interest
        elementType: "labels.text", // Hide POI text by default for cleaner map
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi", // Keep POI markers but make them subtle
        elementType: "geometry",
        stylers: [{ color: "#2b3646" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#233438" }], // Dark teal/blue for parks
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill", // Park text can be slightly more visible
        stylers: [{ color: "#6b9a76" }],
    },
     { // Hide most POI icons
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
     },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#374151" }], // Medium grey roads
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2937" }], // Darker stroke for roads
    },
    {
        featureType: "road",
        elementType: "labels.icon", // Hide road icons (A, B markers etc.)
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca3af" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#52525b" }], // Distinct highway color
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2937" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d1d5db" }], // Lighter text for highways
    },
    {
        featureType: "transit", // Public transit lines
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station", // Transit station icons/text
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca3af" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#111827" }], // Very dark blue for water
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4b5563" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#111827" }],
    },
];