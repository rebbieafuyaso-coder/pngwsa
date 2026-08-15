import { useNavigate, useParams } from "react-router-dom";
import { upcomingEvents } from "../data/BlogData";
import { Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

const EventDetailsModal = ({}) => {
  const navigate = useNavigate();
  const { link } = useParams();
  const event = upcomingEvents.find((event) => event.link === String(link));
  return(
    <>
      <div className="p-4 mt-4 max-w-6xl mx-auto">
        <h2 className="text-4xl mx-auto font-bold">Upcoming Events</h2>
        <p className="text-gray-500">See upcoming events and updates about PNG Wuhan Students Association</p>
      </div>
    <Row gutter={0} align="middle" justify="center" className="my-8!">
      <Col span={12}>
      <p
      className="text-amber-500! font-bold! mb-4"
      ><Link className="text-amber-500!" to="/">Home</Link> / <Link className="text-amber-500!" to="/events">Events </Link> / {event.title}</p>
        <Card>
          <Link className="text-amber-500!" to="/events" onClick={() => {navigate(-1)}}><ArrowLeft /></Link>
          <img src={event.poster} alt={event.poster} className="w-2xl mx-auto"/>
          <h2 className="text-2xl font-bold text-center mt-4">{event.title}</h2>
          <p className="bg-amber-200 text-amber-700 font-bold max-w-fit! flex p-2 rounded-xl"><Calendar /> {event.date}</p>
          <p className="p-4">{event.description}</p>
        </Card>
      </Col>
    </Row>
    </>
  )
}

export default EventDetailsModal;