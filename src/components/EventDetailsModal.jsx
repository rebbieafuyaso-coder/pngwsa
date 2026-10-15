import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Card, Spin, Empty, Button } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../supabaseClient";

const EventDetailsModal = () => {
  const navigate = useNavigate();
  const { link } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* =========================================================
     FETCH EVENT BY SLUG
  ========================================================= */

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("link", link)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Failed to load event:", error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    if (link) fetchEvent();
  }, [link]);

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  /* =========================================================
     NOT FOUND STATE
  ========================================================= */

  if (notFound || !event) {
    return (
      <>
        <Helmet>
          <title>Event Not Found | PNG HSA</title>
        </Helmet>
        <div className="mx-auto max-w-2xl px-4 py-20">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="This event could not be found or is no longer available."
          >
            <Button
              type="primary"
              onClick={() => navigate("/")}
              className="rounded-lg! border-none! bg-amber-500! hover:bg-amber-600!"
            >
              Back to Home
            </Button>
          </Empty>
        </div>
      </>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <Helmet>
        <title>{`PNG HSA | ${event.title}`}</title>
        <meta name="description" content={event.summary || event.title} />
        <meta name="og:title" content={event.title} />
        <meta name="og:description" content={event.summary || ""} />
        {event.poster_url && <meta property="og:image" content={event.poster_url} />}
        <link
          rel="canonical"
          href={`https://www.pngwuhanstudents.netlify.app/events/${event.link}`}
        />
      </Helmet>

      <div className="p-4 mt-4 xl:max-w-6xl mx-auto">
        <h2 className="text-4xl mx-auto font-bold">Upcoming Events</h2>
        <p className="text-gray-500">
          See upcoming events and updates about PNG Wuhan Students Association
        </p>
      </div>

      <Row gutter={0} align="middle" justify="center" className="my-8!">
        <Col sm={20} md={20} lg={18} xl={12} span={22}>
          <p className="text-amber-500! font-bold! mb-4">
            <Link className="text-amber-500!" to="/">Home</Link> /{" "}
            <Link className="text-amber-500!" to="/events">Events</Link> /{" "}
            {event.title}
          </p>

          <Card>
            <Link
              className="text-amber-500!"
              to="/events"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Link>

            {event.poster_url && (
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-2xl mx-auto"
              />
            )}

            <h2 className="text-2xl font-bold text-center mt-4">
              {event.title}
            </h2>

            <p className="text-amber-700">{event.event_date}</p>

            {event.location && (
              <p className="text-gray-500 text-sm">{event.location}</p>
            )}

            <p className="p-4 whitespace-pre-line">{event.description}</p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EventDetailsModal;