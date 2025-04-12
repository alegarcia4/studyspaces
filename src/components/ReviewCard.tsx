
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/data/studySpots";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="border-l-4 border-l-studyspot-light-purple">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{review.user}</p>
            <p className="text-xs text-studyspot-neutral">{formatDate(review.date)}</p>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <p className="text-sm text-gray-700">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
