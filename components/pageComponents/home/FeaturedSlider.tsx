"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import type { ProductType } from "@/types/product";
import type { Cart } from "@/types";
import AddToCart from "@/components/shared/product/add-cart-button";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface FeaturedSliderProps {
  products: ProductType[];
  cart?: Cart;
}

const FeaturedSlider = ({ products, cart }: FeaturedSliderProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="wrapper">
      <div className=" featured-slider bg-primary-border rounded-3xl border-b border-primary-border/30 overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={50}
          slidesPerView={1}
          loop={products.length > 1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          className="w-full"
        >
          {products.map((product) => {
            const cartItem = {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              qty: 1,
              price: product.price,
              image: product.images[0] ?? "",
            };

            return (
              <SwiperSlide key={product.id}>
                <div className="grid lg:grid-cols-12 gap-10 items-center wrapper py-16 md:py-24 px-4 sm:px-8">
                  {/* Left Side: Book Details */}
                  <div className="lg:col-span-7 flex flex-col justify-center text-left">
                    <span className="w-fit rounded-full text-[12px] font-extrabold uppercase tracking-wider bg-primary-border/60 text-primary-text px-4 py-1.5 mb-4 shadow-sm">
                      Featured Selection
                    </span>

                    <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-extrabold leading-tight text-primary-text">
                      {product.name}
                    </h2>

                    {product.author && (
                      <p className="text-[16px] md:text-[18px] italic font-semibold text-primary-text/80 mt-1 mb-4">
                        by {product.author}
                      </p>
                    )}

                    <p className="text-[15px] sm:text-[16px] text-primary-text/80 leading-relaxed max-w-2xl mb-6 min-h-[104px]">
                      {product.description.length > 240
                        ? `${product.description.slice(0, 240)}...`
                        : product.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="text-[28px] font-extrabold text-primary-text flex items-center">
                        <span>₹ {product.price}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <Link
                          href={`/book-details/${product.slug}`}
                          className="px-6 py-2 rounded-full border-2 border-primary-text text-primary-text font-bold hover:bg-primary-text hover:text-white transition-all duration-300 shadow-sm"
                        >
                          View Details
                        </Link>

                        <div className="flex flex-wrap gap-5 items-center">
                          <AddToCart cart={cart} item={cartItem} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Book Cover Presentation */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end lg:pr-12">
                    <div className="relative group/img max-w-[220px] sm:max-w-[260px] w-full">
                      {/* Shadow Layer */}
                      <div className="absolute inset-0 bg-primary-text/15 rounded-2xl blur-md transform translate-x-4 translate-y-4 group-hover/img:translate-x-6 group-hover/img:translate-y-6 transition-all duration-500" />

                      {/* Cover Container */}
                      <div className="relative w-[300px] h-[390px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary-border bg-white transform group-hover/img:rotate-2 group-hover/img:scale-[1.03] transition-all duration-500">
                        <img
                          src={product.images[0] ?? "/placeholder-book.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedSlider;
