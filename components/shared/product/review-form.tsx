"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createOrUpdateReview } from "@/lib/actions/review.action";
import { insertReviewSchema } from "@/lib/validators";
import { funnel } from "@/lib/fonts";

type ReviewFormProps = {
  productId: string;
  userId: string;
  existingReview?: {
    rating: number;
    description: string;
  } | null;
  onSuccess?: () => void;
};

const ReviewForm = ({
  productId,
  userId,
  existingReview,
  onSuccess,
}: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      productId,
      userId,
      rating: existingReview?.rating ?? 5,
      description: existingReview?.description ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof insertReviewSchema>) => {
    try {
      const res = await createOrUpdateReview(values);
      if (res.success) {
        toast.success(res.message);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const currentRating = form.watch("rating");

  return (
    <div className="bg-primary-bg/5 p-6 rounded-2xl border border-primary-bg/10 text-primary-bg font-normal">
      <h3 className="text-xl font-bold mb-4">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating Selector */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="font-semibold text-primary-bg/80">Rating</FormLabel>
                <FormControl>
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isHighlighted =
                        hoveredRating !== null
                          ? star <= hoveredRating
                          : star <= currentRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className="focus:outline-none transition-transform duration-100 active:scale-95"
                        >
                          <Star
                            size={28}
                            className={`transition-colors duration-200 cursor-pointer ${
                              isHighlighted
                                ? "text-amber-400 fill-amber-400"
                                : "text-primary-bg/30 fill-transparent hover:text-amber-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-sm font-semibold opacity-70">
                      {currentRating === 5 && "Excellent"}
                      {currentRating === 4 && "Very Good"}
                      {currentRating === 3 && "Good"}
                      {currentRating === 2 && "Fair"}
                      {currentRating === 1 && "Poor"}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Textarea */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-primary-bg/80">Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us what you think about this product..."
                    {...field}
                    className="min-h-[100px] bg-primary-bg/10 border border-primary-bg/20 rounded-xl focus-visible:ring-offset-0 focus-visible:ring-primary-bg/30 text-primary-bg placeholder:text-primary-bg/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-primary-bg text-primary-text font-bold rounded-full py-2 px-6 hover:bg-primary-bg/90 transition-colors"
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : existingReview
                ? "Update Review"
                : "Submit Review"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
