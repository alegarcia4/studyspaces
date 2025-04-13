// src/pages/ListingPage.tsx
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchFilters, { FilterOptions } from "@/components/SearchFilters";
import StudySpotCard from "@/components/StudySpotCard";
import MapView from "@/components/MapView";
import { studySpots, StudySpot } from "@/data/studySpots";
import { Grid3X3, List, Locate, Clock, MapPin, Filter, Sparkles, X, Wifi } from "lucide-react"; // Added Wifi
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const ListingPage = () => {
  const [allSpots, setAllSpots] = useState<StudySpot[]>([]); // Initialize empty
  const [filteredSpots, setFilteredSpots] = useState<StudySpot[]>([]); // Initialize empty
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<FilterOptions | null>(null); // Store filters
  const { toast } = useToast();

  // --- Helper Functions ---
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
    console.warn(`Could not parse coordinates from address: ${address}`);
    return null; // Return null if parsing fails
   };

   const generateRandomCoordsNearCSUF = (): { lat: number, lng: number } => {
    const csufLat = 33.8816;
    const csufLng = -117.8854;
    const latOffset = (Math.random() - 0.5) * 0.07; // ~5 miles radius
    const lngOffset = (Math.random() - 0.5) * 0.07;
    return { lat: csufLat + latOffset, lng: csufLng + lngOffset };
   };

   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
     if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
         console.error("Invalid coordinates for distance calculation:", {lat1, lon1, lat2, lon2});
         return Infinity;
     }
     const R = 3958.8; // Radius of the Earth in miles
     const dLat = (lat2 - lat1) * Math.PI / 180;
     const dLon = (lon2 - lon1) * Math.PI / 180;
     const a =
       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
       Math.sin(dLon / 2) * Math.sin(dLon / 2);
     if (isNaN(a) || a < 0) {
         console.error("Invalid value 'a' in distance calc:", a);
         return Infinity;
     }
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     const distance = R * c;
     return isNaN(distance) ? Infinity : distance;
   };

   // --- Effects ---
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // Process initial spots data
    const processedSpots = studySpots.map(spot => ({
      ...spot,
      coordinates: spot.coordinates || parseCoordinates(spot.address) || generateRandomCoordsNearCSUF(),
      // Keep original distance string as placeholder until location is known
    }));
    setAllSpots(processedSpots);
    setFilteredSpots(processedSpots); // Initially show all processed spots
    setIsLoading(false);
  }, []); // Run only once on mount


  // Update distances when userLocation changes
  useEffect(() => {
    if (userLocation) {
      updateSpotDistances(userLocation);
    }
  }, [userLocation]); // Depend only on userLocation

  // Re-apply filters whenever allSpots changes (due to distance update) or filters change
  useEffect(() => {
    if (currentFilters) {
        applyFilters(currentFilters); // Re-run filter logic
    } else {
        setFilteredSpots(allSpots); // If no filters yet, show all
    }
  }, [allSpots, currentFilters]); // Depend on allSpots (for distance updates) and currentFilters


  // --- Event Handlers ---
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation Error", description: "Geolocation is not supported.", variant: "destructive" });
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(newLocation); // This triggers the useEffect above
        toast({ title: "Location Found", description: "Calculating distances..." });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({ title: "Location Error", description: `Could not get location: ${error.message}.`, variant: "destructive" });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const updateSpotDistances = (location: { lat: number; lng: number }) => {
     setAllSpots(prevSpots => prevSpots.map(spot => {
         if (!spot.coordinates) {
             console.warn(`Spot ${spot.name} has no coordinates.`);
             return { ...spot, distance: "N/A" };
         }
         const dist = calculateDistance(location.lat, location.lng, spot.coordinates.lat, spot.coordinates.lng);
         return { ...spot, distance: dist === Infinity ? "N/A" : `${dist.toFixed(1)} miles` };
     }));
     // Note: Re-filtering will happen automatically due to the useEffect dependency on allSpots
  };

  const applyFilters = (filters: FilterOptions) => {
     setCurrentFilters(filters); // Store the current filters
     const filtered = allSpots.filter(spot => {
        const searchMatch = filters.search === "" ||
            spot.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            spot.description.toLowerCase().includes(filters.search.toLowerCase());

        const distanceValue = spot.distance === "N/A" ? Infinity : parseFloat(spot.distance);
        // Check if distance is within range OR if max distance is selected (treat as no limit)
        const distanceMatch = filters.distance >= 10 || distanceValue <= filters.distance;

        const amenitiesMatch = filters.amenities.length === 0 ||
            filters.amenities.every(amenity => spot.amenities.includes(amenity));

        // Basic 'open now' check - needs improvement for real hours
        let openNowMatch = true;
        if (filters.openNow) {
            openNowMatch = spot.hours?.toLowerCase().includes("24/7") || spot.hours?.toLowerCase().includes("midnight");
        }

        const ratingMatch = spot.rating >= filters.minRating;

        return searchMatch && distanceMatch && amenitiesMatch && openNowMatch && ratingMatch;
     });
     setFilteredSpots(filtered);
  };


  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      // Keep existing skeleton
       return (
        <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredSpots.length === 0) {
       // Keep existing empty state
       return (
        <div className="text-center py-16 bg-card rounded-lg shadow-md border border-border mt-6 md:mt-0">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-medium mb-2 text-card-foreground">No study spots found</p>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or add a new study spot!</p>
          <Button variant="outline" onClick={() => {
              setCurrentFilters(null); // Reset filters
              setFilteredSpots(allSpots); // Show all
              // Optionally reset filter component state here if needed
          }}>
            Clear Filters & Show All
          </Button>
        </div>
      );
    }

    switch (viewMode) {
      case "map":
        return (
          <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-border">
            <MapView spots={filteredSpots} userLocation={userLocation} />
          </div>
        );
      case "list":
        return (
          <div className="flex flex-col gap-4">
            {filteredSpots.map(spot => (
              <StudySpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        );
      case "grid":
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map(spot => (
              <StudySpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        );
    }
  };

  // --- Main Component Return ---
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Find Study Spots</h1>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                 <Button variant="outline" size="sm" className="md:hidden flex items-center gap-2 flex-shrink-0">
                    <Filter className="h-4 w-4" /> Filters
                 </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[380px] p-0 bg-card overflow-y-auto flex flex-col">
                 <SheetHeader className="p-4 border-b border-border sticky top-0 bg-card z-10">
                   <SheetTitle>Filters</SheetTitle>
                 </SheetHeader>
                 <div className="p-4 flex-grow overflow-y-auto">
                    <SearchFilters onFilter={applyFilters} /> {/* Use applyFilters */}
                 </div>
                 <div className="p-4 border-t border-border sticky bottom-0 bg-card">
                     <SheetClose asChild>
                         <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">View Results</Button>
                     </SheetClose>
                 </div>
              </SheetContent>
            </Sheet>

            <Button onClick={getUserLocation} disabled={locationLoading} size="sm" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
              <Locate className={`h-4 w-4 ${locationLoading ? 'animate-spin' : ''}`} /> {locationLoading ? "Finding..." : "Use My Location"}
            </Button>

            <div className="border-l border-border pl-3 hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground flex-shrink-0">
              <Clock className="h-4 w-4 text-primary" /> <span>{currentTime}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar filters - Desktop */}
          <div className="hidden md:block md:col-span-1 space-y-6">
             <div className="bg-card rounded-lg shadow-md border border-border sticky top-20"> {/* Added sticky */}
                <SearchFilters onFilter={applyFilters} /> {/* Use applyFilters */}
             </div>
             {/* Stats Card */}
             <div className="bg-card rounded-lg shadow-md p-5 border border-border sticky top-[calc(20px+450px)]"> {/* Adjust top offset based on filter height */}
               <h3 className="font-medium mb-4 text-card-foreground">Quick Stats</h3>
               {userLocation && (
                 <div className="mb-4 p-3 bg-secondary rounded-md border border-border">
                   <div className="flex items-center gap-2"> <MapPin className="h-4 w-4 text-primary" /> <span className="text-sm font-medium text-secondary-foreground">Location Active</span> </div>
                   <p className="text-xs text-muted-foreground mt-1"> Distances calculated from your location. </p>
                 </div>
               )}
               <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs"> <MapPin className="h-3 w-3"/> {allSpots.length} Total Spots </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs"> <Clock className="h-3 w-3"/> {allSpots.filter(spot => spot.hours?.includes("24/7") || spot.hours?.includes("midnight")).length} Open Late/24h </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs"> <Wifi className="h-3 w-3"/> {allSpots.filter(spot => spot.amenities.includes("Free WiFi")).length} With WiFi </Badge>
               </div>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
             <div className="bg-card rounded-lg shadow-md p-4 mb-6 border border-border sticky top-20 z-10"> {/* Added sticky + z-index */}
              <div className="flex justify-between items-center">
                 <p className="text-sm text-muted-foreground"> Showing {filteredSpots.length} of {allSpots.length} spots </p>
                 <div className="flex gap-1 sm:gap-2">
                   <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" className={` ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"} hover:bg-accent hover:text-accent-foreground`} onClick={() => setViewMode("grid")}> <Grid3X3 className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Grid</span> </Button>
                   <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" className={` ${viewMode === "list" ? "text-primary" : "text-muted-foreground"} hover:bg-accent hover:text-accent-foreground`} onClick={() => setViewMode("list")}> <List className="h-4 w-4" /> <span className="hidden sm:inline ml-1">List</span> </Button>
                   <Button variant={viewMode === "map" ? "secondary" : "ghost"} size="sm" className={` ${viewMode === "map" ? "text-primary" : "text-muted-foreground"} hover:bg-accent hover:text-accent-foreground`} onClick={() => setViewMode("map")}> <MapPin className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Map</span> </Button>
                 </div>
               </div>
             </div>
             {/* Add margin-top to prevent content from hiding under sticky header */}
             <div className="mt-6">
                 {renderContent()}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingPage;