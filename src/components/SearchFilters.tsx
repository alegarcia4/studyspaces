
import { useState, useEffect } from "react";
import { Search, Clock, MapPin, Wifi, Star, Coffee, Power, Volume2, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SearchFiltersProps {
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  search: string;
  distance: number;
  openNow: boolean;
  minRating: number;
  amenities: string[];
}

const SearchFilters = ({ onFilter }: SearchFiltersProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    distance: 5,
    openNow: false,
    minRating: 0,
    amenities: [],
  });

  const amenitiesList = [
    { label: "Free WiFi", icon: <Wifi className="h-3 w-3" /> },
    { label: "Power Outlets", icon: <Power className="h-3 w-3" /> },
    { label: "Quiet Zone", icon: <Volume2 className="h-3 w-3" /> },
    { label: "24/7 Access", icon: <CalendarClock className="h-3 w-3" /> },
    { label: "Food & Drinks", icon: <Coffee className="h-3 w-3" /> },
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleDistanceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, distance: value[0] }));
  };

  const handleRatingChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, minRating: value[0] }));
  };

  const handleOpenNowToggle = () => {
    setFilters(prev => ({ ...prev, openNow: !prev.openNow }));
  };

  const applyFilters = () => {
    onFilter(filters);
    toast({
      title: "Filters Applied",
      description: `Showing spots within ${filters.distance} miles${filters.openNow ? ' that are open now' : ''}`,
    });
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      distance: 5,
      openNow: false,
      minRating: 0,
      amenities: [],
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
    toast({
      title: "Filters Cleared",
      description: "Showing all study spots",
    });
  };

  // Auto-apply filters when component mounts
  useEffect(() => {
    applyFilters();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search study spots..."
          className="pl-10"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-studyspot-purple" />
            Distance
          </label>
          <span className="text-sm text-studyspot-neutral">{filters.distance} miles</span>
        </div>
        <Slider
          defaultValue={[5]}
          max={10}
          step={0.5}
          value={[filters.distance]}
          onValueChange={handleDistanceChange}
          className="my-2"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-studyspot-purple" />
            Minimum Rating
          </label>
          <span className="text-sm text-studyspot-neutral">{filters.minRating.toFixed(1)}+</span>
        </div>
        <Slider
          defaultValue={[0]}
          min={0}
          max={5}
          step={0.5}
          value={[filters.minRating]}
          onValueChange={handleRatingChange}
          className="my-2"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="open-now" 
            checked={filters.openNow} 
            onCheckedChange={handleOpenNowToggle}
          />
          <Label htmlFor="open-now" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-studyspot-purple" />
            Open Now
          </Label>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Wifi className="h-4 w-4 text-studyspot-purple" />
          Amenities
        </h3>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map(amenity => (
            <Badge
              key={amenity.label}
              variant={filters.amenities.includes(amenity.label) ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 ${
                filters.amenities.includes(amenity.label) 
                  ? 'bg-studyspot-purple hover:bg-studyspot-light-purple' 
                  : 'hover:bg-studyspot-soft-purple hover:text-studyspot-purple'
              }`}
              onClick={() => handleAmenityToggle(amenity.label)}
            >
              {amenity.icon}
              {amenity.label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={applyFilters}
          className="flex-1 bg-studyspot-purple hover:bg-studyspot-light-purple"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={clearFilters}
          variant="outline"
          className="w-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
