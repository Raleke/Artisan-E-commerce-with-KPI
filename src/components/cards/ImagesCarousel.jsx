import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Define TypeScript interface for image items (if using TypeScript)
// interface ImageItem {
//   src: string;
//   alt: string;
//   title: string;
// }

const ImageCarousel = ({
  images,
  autoplayDelay = 3000,
  height = "h-64",
  containerClasses = "w-full max-w-2xl mx-auto",
  showTitles = true,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        className="rounded-lg shadow-xl"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className={`relative ${height}  w-full`}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              {showTitles && image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-lg font-semibold text-center md:text-left">
                    {image.title}
                  </h3>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
