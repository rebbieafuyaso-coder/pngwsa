import { Avatar, Card, Col } from "antd"
import { FaQuoteLeft } from "react-icons/fa6"
import { Testimonials } from "../data/Testimonials";
import { FaStar } from "react-icons/fa"

export const TestimonialsCard = (e) => {
  return (
    <div>
      {Testimonials.map((testimonial) => (
      <Col key={testimonial.id} span={24}>
        <Card className="text-center p-6 shadow-lg border-none max-w-2xl gap-1 flex">
          <FaQuoteLeft className="text-amber-300 text-2xl mx-auto mb-3" />
          <p className="text-gray-700 text-sm italic leading-relaxed max-w-2xl mx-auto">
            "{testimonial.quote}"
          </p>
          <div className="flex justify-center gap-1 text-amber-400 mt-3">
            {[...Array(testimonial.rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <h4 className="font-bold text-gray-900 mt-3">
            {testimonial.name}
          </h4>
          <p className="text-sm text-amber-600">
            {testimonial.role}
          </p>
        </Card>
      </Col>
    ))}
    </div>
  )
}