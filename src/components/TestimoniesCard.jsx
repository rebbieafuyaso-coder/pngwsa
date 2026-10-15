import { Avatar, Card, Col } from "antd";
import { FaQuoteLeft } from "react-icons/fa6";
import { Testimonials } from "../data/Testimonials";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export const TestimonialsCard = () => {
  return (
    <div className="testimonials-container py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <Swiper
          loop={true}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          effect="slide"
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
          }}
          className="testimonials-swiper"
        >
          {Testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="mx-auto">
              <Card 
                className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none h-full flex flex-col min-h-8xl! align-middle justify-center max-w-2xl"
                style={{ borderRadius: '16px' }}
              >
                <div className="flex-1">
                  <FaQuoteLeft className="text-amber-300 text-3xl mx-auto mb-4" />
                  
                  <p className="text-gray-700 text-sm italic leading-relaxed px-2">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex justify-center gap-1 text-amber-400 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-lg" />
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">               
                  <h4 className="font-bold text-gray-900 text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-amber-600 font-medium">
                    {testimonial.role}
                  </p>
                  {testimonial.university && (
                    <p className="text-xs text-gray-500 mt-1">
                      {testimonial.university}
                    </p>
                  )}
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows Styling */}
        <style jsx>{`
          .testimonials-swiper {
            padding-bottom: 50px;
          }
          .testimonials-swiper .swiper-button-next,
          .testimonials-swiper .swiper-button-prev {
            color: #f59e0b;
            background: transparent;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            transition: all 0.3s ease;
            padding: 10px;
          }
          .testimonials-swiper .swiper-button-next:hover,
          .testimonials-swiper .swiper-button-prev:hover {
            background: #f59e0b;
            color: white;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          }
          .testimonials-swiper .swiper-button-next::after,
          .testimonials-swiper .swiper-button-prev::after {
            font-size: 18px;
            font-weight: bold;
          }
          .testimonials-swiper .swiper-pagination-bullet {
            background: #d1d5db;
            opacity: 1;
          }
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: #f59e0b;
          }
          .testimonials-swiper .swiper-pagination-bullet:hover {
            background: #f59e0b;
          }
        `}</style>
      </div>
    </div>
  );
};