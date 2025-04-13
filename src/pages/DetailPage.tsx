
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import type { StudySpot } from "@/data/studySpots";
import { studySpots } from "@/data/studySpots";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Star, Wifi, Coffee, ChevronLeft, Navigation } from "lucide-react";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Maps";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [spot, setSpot] = useState<StudySpot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [newReview, setNewReview] = useState({
    user: "",
    comment: "",
    rating: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundSpot = studySpots.find(s => s.id === id) || null;
      setSpot(foundSpot);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleGetDirections = () => {
    if (!spot) return;

    // Google Maps URL format for directions
    const destinationParam = encodeURIComponent(spot.address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}`;

    // Open in new tab
    window.open(googleMapsUrl, '_blank');

    toast({
      title: "Opening directions",
      description: `Getting directions to ${spot.name}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-80 bg-gray-200 rounded-lg mb-6" />
            <div className="h-8 bg-gray-200 rounded-md mb-4 w-2/3" />
            <div className="h-4 bg-gray-200 rounded-md mb-2 w-full" />
            <div className="h-4 bg-gray-200 rounded-md mb-6 w-3/4" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-200 rounded-md" />
              <div className="h-40 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Study Spot Not Found</h1>
          <p className="text-studyspot-neutral mb-8">The study spot you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-studyspot-purple hover:bg-studyspot-light-purple">
            <Link to="/spots">Browse Study Spots</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to="/spots">
              <ChevronLeft className="h-4 w-4" />
              Back to spots
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96">
            <img
              src={spot.images[activeImage]}
              alt={spot.name}
              className="w-full h-full object-cover"
            />

            {spot.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {spot.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full ${activeImage === idx ? 'bg-white' : 'bg-white/50'}`}
                    onClick={() => setActiveImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{spot.name}</h1>
              <div className="flex items-center gap-1 bg-studyspot-soft-purple px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-studyspot-purple text-studyspot-purple" />
                <span className="font-medium text-studyspot-purple">{spot.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-studyspot-neutral mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{spot.address}</span>
                </div>

                <div className="flex items-center gap-2 text-studyspot-neutral mb-6">
                  <Clock className="h-4 w-4" />
                  <span>{spot.hours}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">About this spot</h3>
                  <p className="text-gray-700">{spot.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {spot.amenities.map(amenity => (
                      <span
                        key={amenity}
                        className="bg-gray-100 text-studyspot-midnight px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 border rounded-lg p-4 bg-gray-50 h-fit">
                <h3 className="font-medium mb-2">Location</h3>
                <div className="aspect-video rounded-md mb-4 overflow-hidden">
                  <div className="h-full w-full">
                    <Map />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">Distance</span>
                  <span className="font-medium">{spot.distance}</span>
                </div>
                <Button
                  className="w-full bg-studyspot-purple hover:bg-studyspot-light-purple flex items-center gap-2 justify-center"
                  onClick={handleGetDirections}
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="bg-gray-50 p-4 rounded-lg shadow-md w-full max-w-2xl">
                  <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>

                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newReview.user}
                    onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                  />

                  <textarea
                    placeholder="Your Review"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                  />

                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl cursor-pointer ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <Button
                    className="bg-studyspot-purple hover:bg-studyspot-light-purple"
                    onClick={() => {
                      if (!newReview.user || !newReview.comment || !newReview.rating) return;

                      const reviewToAdd = {
                        id: Date.now().toString(), // or use crypto.randomUUID()
                        ...newReview,
                        date: new Date().toISOString(),
                      };
                      setSpot((prev: StudySpot | null) => {
                        if (!prev) return prev;

                        const updatedReviews = [...(prev.reviews || []), reviewToAdd];

                        return {
                          ...prev,
                          reviews: updatedReviews,
                        };
                      });

                      setNewReview({ user: "", comment: "", rating: 0 });
                    }}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>

              {spot.reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-lg font-medium mb-2">No reviews yet</p>
                  <p className="text-studyspot-neutral mb-4">Be the first to review this study spot</p>
                  <Button className="bg-studyspot-purple hover:bg-studyspot-light-purple">
                    Add a Review
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {spot.reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>

            {/* Submission info */}
            <div className="mt-8 pt-6 border-t text-sm text-studyspot-neutral">
              <p>Submitted by {spot.submittedBy} on {new Date(spot.submittedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPage;
