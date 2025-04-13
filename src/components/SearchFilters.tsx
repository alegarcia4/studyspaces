// src/components/SearchFilters.tsx
import { useState, useEffect } from "react";
import { Search, Clock, MapPin, Wifi, Star, Coffee, Power, Volume2, CalendarClock, X } from "lucide-react"; // Added X
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

const defaultFilters: FilterOptions = {
    search: "",
    distance: 5, // Default distance
    openNow: false,
    minRating: 0,
    amenities: [],
};

const SearchFilters = ({ onFilter }: SearchFiltersProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

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
      return { ...prev, amenities: newAmenities };
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

  const handleOpenNowToggle = (checked: boolean) => { // Receive checked state
    setFilters(prev => ({ ...prev, openNow: checked }));
  };

  const applyFilters = () => {
    onFilter(filters);
    // Optional: Keep toast or remove if too noisy
    // toast({
    //   title: "Filters Applied",
    //   description: `Showing spots matching criteria.`,
    // });
  };

   const clearFilters = () => {
    setFilters(defaultFilters); // Reset state to defaults
    onFilter(defaultFilters); // Notify parent with default filters
    toast({
      title: "Filters Cleared",
      description: "Showing all study spots.",
    });
   };

   // Apply filters automatically when component mounts or filters change internally
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            applyFilters();
        }, 300); // Debounce filter application slightly

        return () => clearTimeout(debounceTimer);
    }, [filters]); // Rerun effect when filters state changes


  return (
    // Use bg-card, text-foreground, text-muted-foreground, border-border
    <div className="bg-card rounded-lg p-5 border border-border text-foreground">
      <h3 className="text-lg font-semibold mb-4">Filter Spots</h3>
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name or description..."
            className="pl-10 bg-background border-border focus:ring-primary" // Theme applied
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Distance Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Max Distance
            </Label>
            <span className="text-xs text-muted-foreground">{filters.distance} miles</span>
          </div>
          <Slider
            defaultValue={[defaultFilters.distance]}
            max={10} // Allow setting max distance
            min={0.5} // Set a minimum distance
            step={0.5}
            value={[filters.distance]}
            onValueChange={handleDistanceChange}
            className="[&>span>span]:bg-primary [&>span]:bg-secondary" // Theme slider
          />
           <p className="text-xs text-muted-foreground mt-1">Set to 10 miles for no limit.</p>
        </div>

        {/* Rating Slider */}
         <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Star className="h-4 w-4 text-primary" />
              Minimum Rating
            </Label>
            <span className="text-xs text-muted-foreground">{filters.minRating.toFixed(1)}+ stars</span>
          </div>
          <Slider
            defaultValue={[defaultFilters.minRating]}
            min={0}
            max={5}
            step={0.5}
            value={[filters.minRating]}
            onValueChange={handleRatingChange}
            className="[&>span>span]:bg-primary [&>span]:bg-secondary" // Theme slider
          />
        </div>

        {/* Open Now Switch */}
        <div className="flex items-center justify-between">
          <Label htmlFor="open-now" className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Open Now
          </Label>
          <Switch
            id="open-now"
            checked={filters.openNow}
            onCheckedChange={handleOpenNowToggle}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary" // Theme switch
          />
        </div>

        {/* Amenities */}
         <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-foreground">
            <Wifi className="h-4 w-4 text-primary" />
            Amenities
          </h3>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map(amenity => (
              <Badge
                key={amenity.label}
                variant={filters.amenities.includes(amenity.label) ? "default" : "secondary"} // Use theme variants
                className={`cursor-pointer flex items-center gap-1 text-xs font-normal px-2 py-1 transition-colors ${
                  filters.amenities.includes(amenity.label)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                onClick={() => handleAmenityToggle(amenity.label)}
              >
                {amenity.icon}
                {amenity.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            onClick={clearFilters}
            variant="ghost" // Use ghost for less emphasis
            size="sm"
            className="flex-1 text-muted-foreground hover:text-foreground"
          >
             <X className="h-4 w-4 mr-1"/> Clear Filters
          </Button>
           {/* Apply button can be removed if filters apply automatically via useEffect */}
           {/*
           <Button
             onClick={applyFilters}
             size="sm"
             className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
           >
             Apply Filters
           </Button>
           */}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;