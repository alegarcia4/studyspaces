// src/components/ReviewCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/data/studySpots";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
         // Check if date is valid
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "Date Error"; // Or return the original string or placeholder
    }
  };

  return (
    // Use bg-card, text-card-foreground, etc.
    <Card className="border-l-4 border-primary/50 bg-card text-card-foreground shadow-sm"> {/* Use primary as accent border */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium text-sm text-foreground">{review.user}</p>
            <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{review.comment}</p> {/* Slightly muted comment text */}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;