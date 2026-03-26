import { useState } from "react";
import { Star } from "lucide-react";
import api from "../api/axios";
import { useToast } from "./Toast";

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

const ReviewForm = ({ productId, onReviewAdded }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warning("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/reviews/create", {
        productId,
        rating,
        comment: comment.trim(),
      });
      if (res.data.success) {
        toast.success("Review submitted!");
        setRating(0);
        setComment("");
        onReviewAdded();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-slate-100 rounded-xl p-5 bg-white">
      <h4 className="font-bold font-secondary text-slate-900 mb-4">Write a Review</h4>

      {/* Star Rating Input */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-slate-500 ml-2">
          {rating > 0 ? `${rating}/5` : "Select rating"}
        </span>
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        maxLength={500}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">{comment.length}/500</span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-sm px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
