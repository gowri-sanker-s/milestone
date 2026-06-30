"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, CheckCircle, MessageSquare, Plus, Edit3 } from "lucide-react";
// Let's check lib/utils.ts for formatDate helper.
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReviewForm from "./review-form";
import { oleo } from "@/lib/fonts";

type ReviewListProps = {
  productId: string;
  userId?: string;
  reviews: any[];
  slug: string;
  kind: string; // "book" | "bookmark" | "combo"
};

const ReviewList = ({
  productId,
  userId,
  reviews,
  slug,
  kind,
}: ReviewListProps) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  // Find if current user has an existing review
  const myReview = userId
    ? reviews.find((review) => review.userId === userId)
    : null;

  // Calculate review counts for breakdown
  const totalReviews = reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars

  let sumRatings = 0;
  reviews.forEach((review) => {
    sumRatings += review.rating;
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[5 - review.rating]++;
    }
  });

  const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "0.0";

  const handleReviewSuccess = () => {
    setShowForm(false);
    router.refresh();
  };

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const currentPath = kind === "bookmark" ? `/bookmark-details/${slug}` : `/book-details/${slug}`;

  return (
    <div className="mt-16 pt-10 border-t border-primary-bg/10 text-primary-bg font-normal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className={`${oleo.className} text-[35px] text-primary-bg tracking-wide`}>
            Ratings & Reviews
          </h3>
          <p className="text-primary-bg/60 text-sm mt-1">
            Read opinions from other readers and buyers
          </p>
        </div>

        {userId ? (
          <Button
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-2 bg-primary-bg text-primary-text font-bold rounded-full py-2 px-6 hover:bg-primary-bg/90 transition-colors"
          >
            {myReview ? (
              <>
                <Edit3 size={18} />
                {showForm ? "Cancel Edit" : "Edit Your Review"}
              </>
            ) : (
              <>
                <Plus size={18} />
                {showForm ? "Cancel" : "Write a Review"}
              </>
            )}
          </Button>
        ) : (
          <Link
            href={`/sign-in?callbackUrl=${currentPath}`}
            className="flex items-center gap-2 bg-primary-bg text-primary-text font-bold rounded-full py-2.5 px-6 hover:bg-primary-bg/90 transition-colors text-sm"
          >
            Sign in to Write a Review
          </Link>
        )}
      </div>

      {/* Review Form inline container */}
      {showForm && userId && (
        <div className="mb-10 max-w-xl">
          <ReviewForm
            productId={productId}
            userId={userId}
            existingReview={myReview}
            onSuccess={handleReviewSuccess}
          />
        </div>
      )}

      {totalReviews > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Summary Column */}
          <div className="lg:col-span-1 bg-primary-bg/5 p-6 rounded-2xl border border-primary-bg/10 flex flex-col items-center text-center">
            <h4 className="text-[60px] font-extrabold leading-none text-primary-bg mb-2">
              {averageRating}
            </h4>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const roundedAvg = Math.round(Number(averageRating));
                return (
                  <Star
                    key={star}
                    size={22}
                    className={
                      star <= roundedAvg
                        ? "text-amber-400 fill-amber-400"
                        : "text-primary-bg/20 fill-transparent"
                    }
                  />
                );
              })}
            </div>
            <p className="text-sm font-semibold opacity-70 mb-6">
              based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>

            {/* Distribution bars */}
            <div className="w-full space-y-2">
              {ratingDistribution.map((count, index) => {
                const starsCount = 5 - index;
                const pct = getPercentage(count);
                return (
                  <div key={starsCount} className="flex items-center text-xs w-full gap-3 font-semibold">
                    <span className="w-12 text-left text-primary-bg/85 flex items-center gap-1 justify-end">
                      {starsCount} <Star size={12} className="text-amber-400 fill-amber-400 inline" />
                    </span>
                    <div className="flex-1 bg-primary-bg/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right opacity-60">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.map((review) => {
              const formattedDate = formatDate(new Date(review.createdAt)).dateOnly;
              const nameInitial = review.user?.name
                ? review.user.name.charAt(0).toUpperCase()
                : "U";

              return (
                <div
                  key={review.id}
                  className="bg-primary-bg/5 p-6 rounded-2xl border border-primary-bg/10 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-bg/10 flex items-center justify-center font-bold text-lg text-primary-bg border border-primary-bg/20">
                        {review.user?.image ? (
                          <img
                            src={review.user.image}
                            alt={review.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          nameInitial
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[16px] text-primary-bg flex items-center gap-2">
                          {review.user?.name ?? "Anonymous Reader"}
                          {review.isVerifiedPurchase && (
                            <span className="flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                              <CheckCircle size={10} className="fill-emerald-400 text-emerald-950 inline" /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] opacity-60 font-medium">
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          className={
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-primary-bg/20 fill-transparent"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[15px] leading-relaxed text-primary-bg/90 whitespace-pre-line font-medium">
                    {review.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-primary-bg/5 p-10 rounded-2xl border border-primary-bg/10 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto">
          <MessageSquare size={48} className="text-primary-bg/30" />
          <h4 className="text-xl font-bold">No Reviews Yet</h4>
          <p className="text-sm opacity-70 max-w-xs">
            There are currently no ratings or reviews for this product. Be the first to share your thoughts!
          </p>
          {userId ? (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary-bg text-primary-text font-bold rounded-full py-2 px-6 hover:bg-primary-bg/90 transition-colors"
            >
              Write the First Review
            </Button>
          ) : (
            <Link
              href={`/sign-in?callbackUrl=${currentPath}`}
              className="bg-primary-bg text-primary-text font-bold rounded-full py-2 px-6 hover:bg-primary-bg/90 transition-colors text-sm inline-block"
            >
              Sign in to Review
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
