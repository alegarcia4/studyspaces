
import { useState } from "react";
import { Search, Clock, MapPin, Wifi } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  search: string;
  distance: number;
  openNow: boolean;
  amenities: string[];
}

const SearchFilters = ({ onFilter }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    distance: 5,
    openNow: false,
    amenities: [],
  });

  const amenitiesList = ["Free WiFi", "Power Outlets", "Quiet Zone", "24/7 Access", "Food & Drinks"];

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

  const handleOpenNowToggle = () => {
    setFilters(prev => ({ ...prev, openNow: !prev.openNow }));
  };

  const applyFilters = () => {
    onFilter(filters);
  };

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
        <Button
          variant={filters.openNow ? "default" : "outline"}
          className={`w-full flex items-center gap-2 ${filters.openNow ? 'bg-studyspot-purple hover:bg-studyspot-light-purple' : ''}`}
          onClick={handleOpenNowToggle}
        >
          <Clock className="h-4 w-4" />
          Open Now
        </Button>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Wifi className="h-4 w-4 text-studyspot-purple" />
          Amenities
        </h3>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map(amenity => (
            <Button
              key={amenity}
              variant={filters.amenities.includes(amenity) ? "default" : "outline"}
              size="sm"
              className={filters.amenities.includes(amenity) ? 'bg-studyspot-purple hover:bg-studyspot-light-purple' : ''}
              onClick={() => handleAmenityToggle(amenity)}
            >
              {amenity}
            </Button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={applyFilters}
        className="w-full bg-studyspot-purple hover:bg-studyspot-light-purple"
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default SearchFilters;
