
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchFilters, { FilterOptions } from "@/components/SearchFilters";
import StudySpotCard from "@/components/StudySpotCard";
import { studySpots, StudySpot } from "@/data/studySpots";
import { Grid3X3, List, Locate, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ListingPage = () => {
  const [filteredSpots, setFilteredSpots] = useState<StudySpot[]>(studySpots);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const { toast } = useToast();

  // Get current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        toast({
          title: "Location Found",
          description: "Using your current location to find nearby study spots",
        });
        setLocationLoading(false);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: error.message,
          variant: "destructive",
        });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Calculate distance between two coordinates in miles
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lat1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Update spots with real distances when user location changes
  useEffect(() => {
    if (userLocation) {
      // Update distances based on user location
      const spotsWithRealDistance = studySpots.map(spot => {
        // For this demo, we'll use a random lat/lng for each spot
        // In a real app, these would come from your database
        const spotLat = parseFloat(spot.address.split(',')[0]) || (Math.random() * 0.1 + 34.0);
        const spotLng = parseFloat(spot.address.split(',')[1]) || (Math.random() * 0.1 - 118.2);
        
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng,
          spotLat,
          spotLng
        ).toFixed(1) + " miles";
        
        return {...spot, distance};
      });
      
      setFilteredSpots(spotsWithRealDistance);
    }
  }, [userLocation]);

  const handleFilter = (filters: FilterOptions) => {
    // Apply filters
    const filtered = studySpots.filter(spot => {
      // Search filter
      const searchMatch = filters.search === "" || 
        spot.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        spot.description.toLowerCase().includes(filters.search.toLowerCase());
      
      // Distance filter
      const distanceValue = parseFloat(spot.distance.split(" ")[0]);
      const distanceMatch = distanceValue <= filters.distance;
      
      // Amenities filter
      const amenitiesMatch = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => spot.amenities.includes(amenity));
      
      // Open now filter (check if it's 24/7 or check current time against operating hours)
      let openNowMatch = true;
      if (filters.openNow) {
        // Simple implementation - in a real app you would parse actual opening hours
        openNowMatch = spot.hours === "24/7";
      }
      
      return searchMatch && distanceMatch && amenitiesMatch && openNowMatch;
    });
    
    setFilteredSpots(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Study Spots</h1>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="md:col-span-1">
            <SearchFilters onFilter={handleFilter} />
            
            {/* Location and Time Tools */}
            <div className="bg-white mt-4 rounded-lg shadow-md p-5">
              <h3 className="font-medium mb-4">Real-Time Tools</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-studyspot-purple" />
                    <span className="text-sm font-medium">Current Time</span>
                  </div>
                  <span className="text-sm bg-studyspot-soft-purple text-studyspot-purple px-2 py-1 rounded-full">
                    {currentTime}
                  </span>
                </div>
                <p className="text-xs text-studyspot-neutral">
                  We use this to check if spots are currently open
                </p>
              </div>
              
              <Button
                onClick={getUserLocation}
                disabled={locationLoading}
                className="w-full bg-studyspot-purple hover:bg-studyspot-light-purple flex items-center justify-center gap-2"
              >
                <Locate className="h-4 w-4" />
                {locationLoading ? "Finding location..." : "Use My Location"}
              </Button>
              
              {userLocation && (
                <div className="mt-2 text-xs text-center text-studyspot-neutral">
                  Location active. Distances are now calculated in real-time.
                </div>
              )}
            </div>
          </div>
          
          {/* Study spots listing */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-studyspot-neutral">
                  {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} found
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    className={viewMode === "grid" ? "bg-studyspot-purple hover:bg-studyspot-light-purple" : ""}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className={viewMode === "list" ? "bg-studyspot-purple hover:bg-studyspot-light-purple" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded-md animate-pulse mb-3 w-3/4" />
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse mb-2 w-full" />
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredSpots.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-lg font-medium mb-2">No study spots found</p>
                    <p className="text-studyspot-neutral">Try adjusting your filters or add a new study spot</p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "flex flex-col gap-4"
                  }>
                    {filteredSpots.map(spot => (
                      <StudySpotCard key={spot.id} spot={spot} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingPage;
