
import { Link } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";
import { StudySpot } from "@/data/studySpots";
import { Card, CardContent } from "@/components/ui/card";

interface StudySpotCardProps {
  spot: StudySpot;
  featured?: boolean;
}

const StudySpotCard = ({ spot, featured = false }: StudySpotCardProps) => {
  return (
    <Link to={`/spot/${spot.id}`}>
      <Card className={`overflow-hidden hover:shadow-spot transition-shadow duration-300 ${featured ? 'h-full' : ''}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={spot.images[0]} 
            alt={spot.name} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{spot.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{spot.name}</h3>
          <div className="flex items-center gap-2 text-studyspot-neutral text-sm mb-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{spot.address}</span>
          </div>
          <div className="flex items-center gap-2 text-studyspot-neutral text-sm mb-3">
            <Clock className="h-4 w-4" />
            <span>{spot.hours}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-studyspot-soft-purple text-studyspot-purple px-2 py-1 rounded-full">
              {spot.distance} away
            </span>
            <span className="text-xs text-studyspot-neutral">
              {spot.reviews.length} {spot.reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StudySpotCard;
