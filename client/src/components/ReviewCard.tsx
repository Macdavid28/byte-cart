import { Star, User } from "lucide-react";
import type { Review } from "../types";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="border border-slate-100 rounded-xl p-5 bg-white">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.user.displayPicture ? (
            <img
              src={review.user.displayPicture}
              alt={review.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 text-sm capitalize">{review.user.name}</h4>
            <span className="text-xs text-slate-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
