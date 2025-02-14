import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TestimonialsCarousel({ testimonials }) {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={25}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      }}
    >
      {testimonials.map((testimonial, index) => (
        <SwiperSlide key={index}>
          <div
            className={`shadow-medium px-2 content-center relative rounded-lg  min-h-[20rem] pt-6 m-1 max-w-full ${index % 2 === 0 ? "bg-primary/20 text-primary-600 border-transparent" : "border-primary-600 border-5"}`}
            data-aos="fade-up"
          >
            <div>
              <div>{testimonial.text}</div>
              <div className="mt-4 text-center text-color">
                {testimonial.author}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
