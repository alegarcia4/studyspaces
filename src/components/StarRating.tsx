
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const StarRating = ({ rating, size = "md", className = "" }: StarRatingProps) => {
  // Convert rating to nearest half star
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Set size based on prop
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5",
  }[size];

  return (
    <div className={`flex items-center ${className}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${starSize} fill-yellow-400 text-yellow-400`} />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${starSize} text-gray-300`} />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
      ))}
    </div>
  );
};

export default StarRating;
