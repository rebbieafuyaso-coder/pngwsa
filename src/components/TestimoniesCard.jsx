import { Card } from "antd";
import { FaQuoteLeft } from "react-icons/fa6";
import { Testimonials } from "../data/Testimonials";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const TestimonialsCard = () => {
  return (
    <div className="testimonials-container py-8 md:py-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 overflow-hidden">
        <Swiper
          loop={true}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 1, spaceBetween: 20 },
            1024: { slidesPerView: 2, spaceBetween: 24 },
          }}
          className="testimonials-swiper"
        >
          {Testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <Card
                className="text-center p-3 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none rounded-2xl h-full"
                styles={{ body: { padding: 0 } }}
              >
                <div className="flex flex-col justify-center">
                  <FaQuoteLeft className="text-amber-300 text-xl sm:text-2xl md:text-3xl mx-auto mb-3 sm:mb-4" />

                  <p className="text-gray-700 text-xs sm:text-sm italic leading-relaxed px-1 sm:px-2">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex justify-center gap-1 text-amber-400 mt-3 sm:mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-sm sm:text-base md:text-lg" />
                    ))}
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-600 font-medium">
                    {testimonial.role}
                  </p>
                  {testimonial.university && (
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                      {testimonial.university}
                    </p>
                  )}
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .testimonials-swiper {
          padding-bottom: 45px;
          width: 100%;
          overflow: hidden;
        }

        .testimonials-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .testimonials-swiper .swiper-slide {
          height: auto;
          box-sizing: border-box;
        }

        .testimonials-swiper .swiper-slide .ant-card {
          width: 100%;
          height: 100%;
        }

        .testimonials-swiper .swiper-button-next,
        .testimonials-swiper .swiper-button-prev {
          color: #f59e0b;
          background: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .testimonials-swiper .swiper-button-next:hover,
        .testimonials-swiper .swiper-button-prev:hover {
          background: #f59e0b;
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .testimonials-swiper .swiper-button-next::after,
        .testimonials-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: bold;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #f59e0b;
        }

        @media (max-width: 480px) {
          .testimonials-swiper .swiper-button-next,
          .testimonials-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};