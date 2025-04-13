
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchFilters, { FilterOptions } from "@/components/SearchFilters";
import StudySpotCard from "@/components/StudySpotCard";
import MapView from "@/components/MapView";
import { studySpots, StudySpot } from "@/data/studySpots";
import { Grid3X3, List, Locate, Clock, MapPin, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ListingPage = () => {
  const [filteredSpots, setFilteredSpots] = useState<StudySpot[]>(studySpots);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
      const spotsWithRealDistance = studySpots.map(spot => {
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
    const filtered = studySpots.filter(spot => {
      // Search text filter
      const searchMatch = filters.search === "" || 
        spot.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        spot.description.toLowerCase().includes(filters.search.toLowerCase());
      
      // Distance filter
      const distanceValue = parseFloat(spot.distance.split(" ")[0]);
      const distanceMatch = distanceValue <= filters.distance;
      
      // Amenities filter
      const amenitiesMatch = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => spot.amenities.includes(amenity));
      
      // Open now filter
      let openNowMatch = true;
      if (filters.openNow) {
        openNowMatch = spot.hours === "24/7";
      }
      
      // Rating filter
      const ratingMatch = spot.rating >= filters.minRating;
      
      return searchMatch && distanceMatch && amenitiesMatch && openNowMatch && ratingMatch;
    });
    
    setFilteredSpots(filtered);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
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
      );
    }
    
    if (filteredSpots.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Sparkles className="h-12 w-12 text-studyspot-purple mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-medium mb-2">No study spots found</p>
          <p className="text-studyspot-neutral mb-6">Try adjusting your filters or add a new study spot</p>
          <Button variant="outline" onClick={() => setFilteredSpots(studySpots)}>
            Show All Spots
          </Button>
        </div>
      );
    }
    
    switch (viewMode) {
      case "map":
        return (
          <div className="h-[calc(100vh-250px)]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map(spot => (
              <StudySpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Find Study Spots</h1>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden flex items-center gap-2"
              onClick={toggleMobileFilters}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <Button
              onClick={getUserLocation}
              disabled={locationLoading}
              size="sm"
              className="flex items-center gap-2 bg-studyspot-purple hover:bg-studyspot-light-purple"
            >
              <Locate className="h-4 w-4" />
              {locationLoading ? "Finding..." : "Use My Location"}
            </Button>
            
            <div className="border-l pl-3 hidden md:flex items-center gap-2">
              <Clock className="h-4 w-4 text-studyspot-purple" />
              <span className="text-sm font-medium">{currentTime}</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar filters - hidden on mobile unless toggled */}
          <div className={`md:col-span-1 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <SearchFilters onFilter={handleFilter} />
            
            <div className="bg-white mt-4 rounded-lg shadow-md p-5">
              <h3 className="font-medium mb-4">Quick Stats</h3>
              
              {userLocation && (
                <div className="mb-4 p-3 bg-studyspot-soft-purple rounded-md">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-studyspot-purple" />
                    <span className="text-sm font-medium text-studyspot-purple">Location Active</span>
                  </div>
                  <p className="text-xs text-studyspot-neutral mt-1">
                    Distances are calculated in real-time
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  {studySpots.length} Total Spots
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  {studySpots.filter(spot => spot.hours === "24/7").length} Open 24/7
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>
                  {studySpots.filter(spot => spot.amenities.includes("Free WiFi")).length} With WiFi
                </Badge>
              </div>
            </div>
          </div>
          
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
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    className={viewMode === "map" ? "bg-studyspot-purple hover:bg-studyspot-light-purple" : ""}
                    onClick={() => setViewMode("map")}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingPage;
