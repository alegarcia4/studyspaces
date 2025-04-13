// src/pages/DetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import type { StudySpot, Review } from "@/data/studySpots";
import { studySpots } from "@/data/studySpots";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, Wifi, Coffee, ChevronLeft, Navigation, MessageSquare, Edit3 } from "lucide-react";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Maps";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // *** ADDED IMPORT ***
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [spot, setSpot] = useState<StudySpot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper for placeholder coordinates (copied from ListingPage)
  const generateRandomCoordsNearCSUF = (): { lat: number, lng: number } => {
    const csufLat = 33.8816;
    const csufLng = -117.8854;
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    return { lat: csufLat + latOffset, lng: csufLng + lngOffset };
  };

   // Helper to parse coordinates (copied from ListingPage)
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

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundSpot = studySpots.find(s => s.id === id);
      if (foundSpot) {
        // Ensure coordinates exist or generate placeholders
        const spotWithCoords = {
          ...foundSpot,
           // Use existing coordinates, parse from address, or generate random
          coordinates: foundSpot.coordinates || parseCoordinates(foundSpot.address) || generateRandomCoordsNearCSUF()
        };
        setSpot(spotWithCoords);
      } else {
        setSpot(null);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);


  const handleGetDirections = () => {
    if (!spot || !spot.address) return;
    const destinationParam = encodeURIComponent(spot.coordinates ? `${spot.coordinates.lat},${spot.coordinates.lng}` : spot.address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}`;
    window.open(googleMapsUrl, '_blank');
    toast({
      title: "Opening Directions",
      description: `Getting directions to ${spot.name}`,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to leave a review.", variant: "destructive" });
      return;
    }
    if (!newReview.comment || newReview.rating === 0) {
      toast({ title: "Incomplete Review", description: "Please provide a rating and comment.", variant: "destructive" });
      return;
    }
    setIsSubmittingReview(true);
    console.log("Simulating review submission:", { spotId: spot?.id, userId: user.id, userName: user.email?.split('@')[0] || "User", rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString() });
    setTimeout(() => {
      const reviewToAdd: Review = { id: crypto.randomUUID(), user: user.email?.split('@')[0] || "User", rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString() };
      setSpot(prevSpot => prevSpot ? { ...prevSpot, reviews: [reviewToAdd, ...(prevSpot.reviews || [])] } : null);
      toast({ title: "Review Submitted (Locally)", description: "Thanks for your feedback! (Note: This review is not saved permanently)." });
      setNewReview({ comment: "", rating: 0 });
      setIsSubmittingReview(false);
    }, 1000);
  };

  if (isLoading) {
    // --- Loading Skeleton (Keep existing skeleton) ---
    return (
       <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
           <div className="bg-card rounded-lg shadow-md p-6 md:p-8 border border-border">
            <Skeleton className="h-8 w-32 mb-6"/> {/* Back button placeholder */}
            <Skeleton className="h-80 w-full rounded-lg mb-6" />
            <div className="flex justify-between items-start mb-4">
               <Skeleton className="h-8 w-2/3 rounded-md"/>
               <Skeleton className="h-8 w-16 rounded-full"/>
            </div>
             <Skeleton className="h-4 w-1/2 rounded-md mb-3" />
             <Skeleton className="h-4 w-1/3 rounded-md mb-6" />

            <div className="grid md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-6 w-1/4 rounded-md"/>
                    <Skeleton className="h-16 w-full rounded-md"/>
                     <Skeleton className="h-6 w-1/4 rounded-md"/>
                    <div className="flex flex-wrap gap-2">
                         <Skeleton className="h-6 w-20 rounded-full"/>
                         <Skeleton className="h-6 w-24 rounded-full"/>
                         <Skeleton className="h-6 w-16 rounded-full"/>
                    </div>
               </div>
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="h-6 w-1/3 rounded-md"/>
                    <Skeleton className="aspect-video w-full rounded-md"/>
                    <Skeleton className="h-10 w-full rounded-md"/>
                </div>
            </div>
             <div className="border-t border-border pt-8 mt-8">
                 <Skeleton className="h-8 w-1/4 mb-6"/>
                 <div className="space-y-4">
                      <Skeleton className="h-20 w-full rounded-md"/>
                      <Skeleton className="h-20 w-full rounded-md"/>
                 </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spot) {
    // --- Not Found Content (Keep existing content) ---
     return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Study Spot Not Found</h1>
          <p className="text-muted-foreground mb-8">The study spot you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/spots">Browse Study Spots</Link>
          </Button>
        </div>
      </div>
    );
  }

  // --- Render Spot Details (Keep existing structure, styles applied via CSS variables) ---
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Link to="/spots">
              <ChevronLeft className="h-4 w-4" />
              Back to spots
            </Link>
          </Button>
        </div>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
           {/* Image Gallery */}
          <div className="relative h-64 md:h-96 bg-muted">
            {spot.images && spot.images.length > 0 ? (
                <>
                    <img src={spot.images[activeImage]} alt={spot.name} className="w-full h-full object-cover"/>
                     {spot.images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {spot.images.map((_, idx) => (
                          <button key={idx} aria-label={`View image ${idx + 1}`} className={`w-2 h-2 rounded-full transition-colors duration-200 ${activeImage === idx ? 'bg-background' : 'bg-background/50 hover:bg-background/75'}`} onClick={() => setActiveImage(idx)}/>
                        ))}
                      </div>
                    )}
                </>
            ) : ( <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image Available</div> )}
          </div>
          {/* Content */}
          <div className="p-6 md:p-8">
             <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">{spot.name}</h1>
              <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-secondary-foreground">{spot.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground ml-1">({spot.reviews.length} reviews)</span>
              </div>
            </div>
             <div className="flex flex-col md:flex-row gap-8 mb-8">
               {/* Left Column: Details & Amenities */}
              <div className="flex-1 md:w-2/3">
                <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{spot.address}</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground mb-6 text-sm">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{spot.hours}</span>
                </div>
                 <div className="mb-6 prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-medium mb-2 text-foreground">About this spot</h3>
                  <p>{spot.description}</p> {/* Removed text-foreground/90 */}
                </div>
                 <div>
                  <h3 className="text-lg font-medium mb-3 text-foreground">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {spot.amenities.map(amenity => ( <Badge key={amenity} variant="secondary" className="text-xs">{amenity}</Badge> ))}
                  </div>
                </div>
              </div>
               {/* Right Column: Map & Actions */}
               <div className="md:w-1/3 border border-border rounded-lg p-4 bg-secondary/30 h-fit space-y-4"> {/* Changed background */}
                <h3 className="font-medium text-foreground">Location</h3>
                 <div className="aspect-video rounded-md overflow-hidden border border-border">
                    <div className="h-full w-full">
                         {spot.coordinates ? <Map /> : <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">Map unavailable</div>}
                    </div>
                 </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="font-medium text-foreground">{spot.distance}</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 justify-center" onClick={handleGetDirections} disabled={!spot.address}>
                  <Navigation className="h-4 w-4" /> Get Directions
                </Button>
              </div>
            </div>
             {/* Reviews Section */}
            <div className="border-t border-border pt-8 mt-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Reviews</h2>
               {/* Review Submission Form */}
               <div className="bg-card border border-border p-4 rounded-lg shadow-sm mb-8">
                   <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                       <Edit3 className="h-5 w-5 text-primary"/> Leave a Review
                   </h3>
                   {user ? (
                       <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="rating" className="mb-2 block text-sm font-medium text-foreground">Rating</Label>
                                <div className="flex">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                     <button type="button" key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="p-1 focus:outline-none focus:ring-2 focus:ring-ring rounded" aria-label={`Rate ${star} out of 5 stars`}>
                                         <Star className={`h-5 w-5 transition-colors ${ star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-foreground/80' }`} />
                                     </button>
                                 ))}
                                 </div>
                            </div>
                            <div>
                                 <Label htmlFor="comment" className="mb-2 block text-sm font-medium text-foreground">Comment</Label>
                                 <Textarea id="comment" placeholder={`Share your experience at ${spot.name}...`} value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="min-h-[80px] bg-background" required />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmittingReview} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                     {isSubmittingReview ? "Submitting..." : "Submit Review"}
                                </Button>
                            </div>
                              <p className="text-xs text-muted-foreground text-center mt-2">Note: Reviews submitted here are for demonstration and are not saved permanently.</p>
                       </form>
                   ) : (
                       <div className="text-center py-4 border border-dashed rounded-md border-border">
                           <p className="text-sm text-muted-foreground mb-3">You must be signed in to leave a review.</p>
                       </div>
                   )}
               </div>
               {/* Display Reviews */}
               {spot.reviews.length === 0 ? (
                 <div className="text-center py-12 bg-secondary/30 rounded-lg border border-dashed border-border">
                   <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                   <p className="text-lg font-medium mb-2 text-card-foreground">No reviews yet</p>
                   <p className="text-muted-foreground">Be the first to share your experience!</p>
                 </div>
               ) : ( <div className="space-y-6"> {spot.reviews.map(review => ( <ReviewCard key={review.id} review={review} /> ))} </div> )}
             </div>
             {/* Submission info */}
             <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
               <p>Spot submitted by {spot.submittedBy} on {new Date(spot.submittedDate).toLocaleDateString()}</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPage;