
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock, Image, Wifi, Info, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const amenitiesList = [
  "Free WiFi",
  "Power Outlets",
  "Quiet Zone",
  "24/7 Access",
  "Coffee & Snacks",
  "Restrooms",
  "Private Rooms",
  "Natural Lighting",
  "Free Parking",
  "Printing Services"
];

const SubmitSpotPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Study spot submitted!",
        description: "Thank you for contributing to StudySpot.",
        variant: "default",
      });
      
      // Redirect to listing page
      navigate("/spots");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Add a Study Spot</h1>
            <p className="text-studyspot-neutral">
              Share your favorite place to study with other students
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-studyspot-purple" />
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Spot Name</Label>
                    <Input id="name" placeholder="E.g., Campus Corner Cafe" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="address" className="pl-10" placeholder="Full address" required />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Opening Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="hours" className="pl-10" placeholder="E.g., 8:00 AM - 11:00 PM or 24/7" required />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe what makes this a good study spot..." 
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-studyspot-purple" />
                  Amenities
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`amenity-${amenity}`} 
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Photo Upload */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Image className="h-5 w-5 text-studyspot-purple" />
                  Photos
                </h2>
                
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Image className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2 text-sm">Drag and drop photos or click to upload</p>
                  <p className="text-xs text-gray-500 mb-4">
                    (Upload up to 5 photos that show the study environment)
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Select Photos
                  </Button>
                </div>
              </div>
              
              {/* Submit Section */}
              <div className="flex flex-col md:flex-row gap-4 justify-end border-t pt-6">
                <Button 
                  variant="outline" 
                  type="button"
                  asChild
                >
                  <Link to="/spots">Cancel</Link>
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-studyspot-purple hover:bg-studyspot-light-purple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">●</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Submit Study Spot
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitSpotPage;
