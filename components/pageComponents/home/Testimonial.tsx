'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import quote from "@/assets/images/quote.svg"
// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

const testimonials = [
    {
        name: "Anjali Menon",
        description: "Absolutely loved the collection! The books are handpicked and the quality is top-notch."
    },
    {
        name: "Rajeev Nair",
        description: "A wonderful experience browsing through their latest arrivals. Highly recommended!"
    },
    {
        name: "Sreelal Krishnan",
        description: "The featured books section is perfect for discovering hidden gems. I found my new favorite here!"
    },
    {
        name: "Shyam Sundar",
        description: "Fast delivery, excellent packaging, and a fantastic selection. Can't ask for more."
    },
    {
        name: "Nimna Vijay",
        description: "A delightful reading experience. The descriptions helped me choose exactly what I wanted."
    }
];

const Testimonial = () => {
    return (
        <section className="wrapper py-16">
            <h2 className="font-extrabold text-[30px] text-center">
                What Our Readers Say
            </h2>
            <p className='md:max-w-[70%] mx-auto text-center py-3 mb-7'>Every book finds its reader. Discover why our community keeps coming back for more unforgettable reads.</p>
            <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}

            >
                {testimonials.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-primary-border p-6 rounded-2xl grid items-center ">
                            <Image
                                src={quote}
                                alt="Quotes"
                                width={40}
                                height={40}

                            />
                            <p className="text-gray-600 italic mb-4 pt-5">
                                “{item.description}”
                            </p>
                            <h4 className="font-bold text-lg text-gray-900">
                                {item.name}
                            </h4>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Testimonial;
