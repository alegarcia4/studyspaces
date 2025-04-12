
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchFilters, { FilterOptions } from "@/components/SearchFilters";
import StudySpotCard from "@/components/StudySpotCard";
import { studySpots, StudySpot } from "@/data/studySpots";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const ListingPage = () => {
  const [filteredSpots, setFilteredSpots] = useState<StudySpot[]>(studySpots);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
      
      // Open now filter
      const openNowMatch = !filters.openNow || spot.hours === "24/7";
      
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
