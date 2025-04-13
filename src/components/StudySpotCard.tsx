import { Link } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";
import { StudySpot } from "@/data/studySpots";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "./StarRating"; // Import StarRating

interface StudySpotCardProps {
  spot: StudySpot;
  featured?: boolean;
}

const StudySpotCard = ({ spot, featured = false }: StudySpotCardProps) => {
  return (
    <Link to={`/spot/${spot.id}`} className="group block">
      <Card className={`overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg ${featured ? 'h-full flex flex-col' : ''}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={spot.images[0]}
            alt={spot.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow">
            <Star className="h-3 w-3 fill-star-yellow text-star-yellow" />
            <span className="text-xs font-semibold text-foreground">{spot.rating.toFixed(1)}</span>
          </div>
        </div>
        <CardContent className={`p-4 flex-grow flex flex-col ${featured ? '' : ''}`}>
          <h3 className="font-semibold text-base mb-1 line-clamp-1 text-foreground">{spot.name}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{spot.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{spot.hours}</span>
          </div>
          {/* Use StarRating component */}
          {/* <StarRating rating={spot.rating} size="sm" className="mb-3" /> */}
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
             <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20">
              {spot.distance} away
            </span>
            <span className="text-xs text-muted-foreground">
              {spot.reviews.length} {spot.reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StudySpotCard;