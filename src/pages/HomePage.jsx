import { useEffect, useState } from "react";
import { Button, Card, Col, Descriptions, Form, Input, message, Row, Empty } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useForm } from "antd/es/form/Form";
import {
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  FaUsers,
  FaGraduationCap,
  FaGlobe,
  FaHeartbeat,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaStar,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaAward,
} from 'react-icons/fa';

import HomeHero from "../components/HomeHero";
import ProfileCards from "../components/ProfileCards";
import BlogProfile from "../components/BlogProfile";
import { alumniData } from "../data/alumniData";
import { TestimonialsCard } from "../components/TestimoniesCard";
import { supabase } from "../supabaseClient";

const { TextArea } = Input;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function Homepage() {
  const { form } = useForm();
  const navigate = useNavigate();

  /* =========================================================
     UPCOMING EVENTS
  ========================================================= */

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      setEventsLoading(true);

      const { data, error } = await supabase
        .from("events")
        .select("id, title, poster_url, event_date, location, summary, link, published, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      console.log("[HOMEPAGE] events fetch →", { error, count: data?.length, data });

      if (cancelled) return;

      if (error) {
        console.error("[HOMEPAGE] events error:", error);
        setUpcomingEvents([]);
      } else {
        setUpcomingEvents(data ?? []);
      }
      setEventsLoading(false);
    };

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     BLOGS
  ========================================================= */

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      setBlogsLoading(true);

      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, image_url, type, excerpt, link, published, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(4);

      console.log("[HOMEPAGE] blogs fetch →", { error, count: data?.length, data });

      if (cancelled) return;

      if (error) {
        console.error("[HOMEPAGE] blogs error:", error);
        setBlogs([]);
      } else {
        setBlogs(data ?? []);
      }
      setBlogsLoading(false);
    };

    fetchBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  // Debug render state
  console.log("[HOMEPAGE] render →", {
    eventsLoading,
    eventsCount: upcomingEvents.length,
    blogsLoading,
    blogsCount: blogs.length,
  });

  const quickStats = [
    { value: "120+", label: "Total Members", icon: FaUsers },
    { value: "12+", label: "Years of Service", icon: FaAward },
    { value: "9+", label: "Different Universities", icon: FaGraduationCap },
    { value: "10+", label: "Events Participated", icon: FaStar },
  ];

  return (
    <>
      <Helmet>
        <title>Home | PNG Hubei Students</title>
        <meta
          name="description"
          content="Welcome to Papua New Guinea Hubei Student Association where we strive to bring world class education to PNG students here in Hubei China"
        />
        <meta name="og:title" content="Official Website | PNG Hubei s Association" />
        <meta name="og:description" content="We strive to connect PNG students to Hubei niversities." />
        <link rel="canonical" href="https://www.pngwuhanstudents.netlify.app/" />
      </Helmet>

      <main className="overflow-hidden">
        <HomeHero />

        {/* Quick Stats Bar */}
        <section className="py-8 px-4 bg-linear-to-r from-amber-50 to-white border-y border-amber-100">
          <Row gutter={[16, 16]} justify="center">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Col xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <Icon className="text-amber-500 text-2xl mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 md:px-16 bg-gray-50">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Our Mission
              </h6>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Empowering PNG Students in Hubei
              </h2>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[40, 40]} align="middle" justify="center">
              <Col xs={24} lg={12}>
                <motion.div variants={fadeUp}>
                  <p className="text-base text-gray-700 leading-relaxed">
                    The Papua New Guinea Hubei Students Association (PNGHSA) is the
                    official representative body for Papua New Guinean students
                    studying in Hubei Province, China. The association is
                    dedicated to fostering unity, academic excellence, cultural
                    exchange, and mutual support among its members.
                  </p>
                  <br />
                  <p className="text-base text-gray-700 leading-relaxed">
                    Through academic, social, and cultural initiatives, PNGHSA
                    provides a platform for students to connect, share experiences,
                    and build meaningful relationships while pursuing their studies
                    abroad. We are committed to creating a supportive community that
                    empowers students to succeed both academically and personally.
                  </p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <h3 className="text-red-900 text-2xl font-medium text-center p-5">History</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    The association was founded in <strong>2014</strong> in <strong>Wuhan City, Hubei Province, China</strong> under the name <b>PNG Wuhan Students Association</b>.
                    It was founded with the sole purpose of uniting PNG students across Wuhan to help and support one another.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    The name was changed from PNG Wuhan Students Association to Hubei Students Association because of the growth and popularity it has gained over the years. From a simple gathering to now a full organization working with governments and organization alike, PNGHSA continues to stand as a beacon in Hubei Province, Wuhan City in China.
                  </p>
                  <Link className="text-base underline font-medium my-4" to={"/history"}>Read More</Link>
                </motion.div>
              </Col>

              <Col xs={24} lg={12}>
                <motion.div variants={fadeUp} className="flex justify-center">
                  <img
                    src="/papua-new-guinea-wuhan-students-association-logo.png"
                    alt="PNGHSA Logo"
                    className="rounded-full w-66 h-66 md:w-84 md:h-84 lg:w-90 lg:h-90 object-cover shadow-2xl border-4 border-amber-300"
                  />
                </motion.div>
              </Col>
            </Row>

            <motion.div variants={fadeUp} className="mt-12">
              <Row gutter={[16, 16]} justify="center">
                {[
                  { icon: FaUsers, label: "Fostering brotherhood and sisterhood among PNG students in Wuhan", color: "#DC2626" },
                  { icon: FaGraduationCap, label: "Supporting each other to achieve the highest academic standards", color: "#2563EB" },
                  { icon: FaGlobe, label: "Building bridges between Papua New Guinea and China", color: "#10B981" },
                  { icon: FaHeartbeat, label: "Preserving and sharing our rich Papua New Guinean heritage", color: "#F59E0B" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Col xs={24} sm={12} lg={5} key={index}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card
                          className="text-center! h-full! shadow-lg! hover:shadow-xl! transition-all duration-300 border-t-4! overflow-hidden!"
                          style={{ borderTopColor: item.color }}
                        >
                          <Icon size={40} className="mx-auto mb-3" style={{ color: item.color }} />
                          <p className="text-sm text-gray-700">{item.label}</p>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 md:px-16 bg-amber-50">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-4">
              <h6 className="inline-block bg-amber-200 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Testimonials
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What Our Members Say
              </h2>
              <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                Hear from our members about their experiences with the PNG WSA community
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row align="middle" justify="center" gutter={30} className="mx-auto">
              <TestimonialsCard />
            </Row>
          </motion.div>
        </section>

        {/* =========================================================
            UPCOMING EVENTS
        ========================================================= */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Events
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <p>Discover upcoming events that will be coming up. Events are either organized or attended by the PNGHSA</p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            {eventsLoading ? (
              <Row gutter={[24, 24]} justify="center">
                {[1, 2, 3].map((i) => (
                  <Col xs={24} md={8} key={i}>
                    <Card className="shadow-lg h-full" loading />
                  </Col>
                ))}
              </Row>
            ) : upcomingEvents.length > 0 ? (
              <Row gutter={[24, 24]} justify="center">
                {upcomingEvents.map((event) => (
                  <Col xs={24} md={8} key={event.id}>
                    <motion.div variants={fadeUp} className="h-full">
                      <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                        {event.poster_url ? (
                          <img
                            src={event.poster_url}
                            alt={event.title}
                            className="mb-4 h-44 w-full rounded-lg object-cover"
                          />
                        ) : (
                          <div className="mb-4 flex h-44 w-full items-center justify-center rounded-lg bg-amber-50 text-amber-300">
                            <FaCalendarAlt size={40} />
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          <div className="bg-amber-100 rounded-xl p-3 flex flex-col items-center min-w-15">
                            <span className="text-xs font-semibold text-amber-600 text-center leading-tight">
                              {event.event_date}
                            </span>
                          </div>

                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <FaCalendarAlt className="text-amber-500" />
                              <span>{event.event_date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaMapMarkerAlt className="text-amber-500" />
                              <span>{event.location || "Location TBA"}</span>
                            </div>
                            <Button
                              size="small"
                              className="mt-2! bg-amber-500! text-white! hover:bg-amber-600! border-none! rounded-full!"
                              onClick={() => navigate(`/events/${event.link}`)}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="rounded-2xl bg-white py-16 shadow-sm">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-slate-500">
                      No upcoming events right now. Check back soon!
                    </span>
                  }
                />
              </div>
            )}
          </motion.div>
        </section>

        {/* Alumni Section */}
        <section className="py-16 px-4 md:px-16 bg-gray-50">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Alumni Network
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Meet Our Alumni
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Meet our alumni, a network of accomplished graduates who continue
                to inspire through their achievements, leadership, and dedication.
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[24, 24]} justify="center">
              {alumniData.map((data) => (
                <Col xs={24} sm={12} lg={6} key={data.key}>
                  <motion.div variants={fadeUp}>
                    <ProfileCards
                      profilePic={data.profilePic}
                      name={data.name}
                      graduationYear={data.graduationYear}
                      university={data.university}
                      linkedIn={data.linkedIn}
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>

            <motion.div variants={fadeUp} className="text-center mt-8">
              <Link to="/members">
                <Button className="bg-amber-500 text-white hover:bg-amber-600 border-none rounded-full px-8">
                  View All Alumni <FaArrowRight className="inline ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* =========================================================
            NEWS & BLOGS
        ========================================================= */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                News & Blogs
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Stay Updated
              </h2>
              <p className="text-gray-600 mt-2">
                Stay up to date with latest news and events regarding PNG WSA.
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            {blogsLoading ? (
              <Row gutter={[24, 24]} justify="center">
                {[1, 2, 3, 4].map((i) => (
                  <Col xs={24} sm={12} lg={6} key={i}>
                    <Card className="shadow-lg h-full" loading />
                  </Col>
                ))}
              </Row>
            ) : blogs.length > 0 ? (
              <Row gutter={[24, 24]} justify="center">
                {blogs.map((data) => (
                  <Col xs={24} sm={12} lg={6} key={data.id}>
                    <motion.div variants={fadeUp}>
                      <BlogProfile
                        blogTitle={data.title}
                        type={data.type}
                        imgSource={data.image_url}
                        imgDesc={data.link}
                        blog={data.excerpt}
                        action={`/blogs/${data.link}`}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="rounded-2xl bg-white py-16 shadow-sm">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-slate-500">
                      No blog posts yet. Check back soon!
                    </span>
                  }
                />
              </div>
            )}

            <motion.div variants={fadeUp} className="text-center mt-8">
              <Link to="/blogs">
                <Button className="border-amber-500 text-amber-500 hover:bg-amber-50 rounded-full px-8">
                  Read All Blogs <FaArrowRight className="inline ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 md:px-16 bg-red-900/5">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Row gutter={[40, 40]} justify="center">
              <Col xs={24} lg={10}>
                <motion.div variants={fadeUp}>
                  <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                    Get in Touch
                  </h6>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Contact Us
                  </h1>
                  <p className="text-gray-700 mb-6">
                    We are committed to making sure we help you understand any
                    questions and information related to PNG WSA and more.
                  </p>

                  <Descriptions column={1} className="mt-5">
                    <Descriptions.Item label={<FaLinkedin className="text-blue-600 text-xl" />}>
                      <Link to="/coming-soon" className="text-gray-700 hover:text-amber-600">
                        Visit LinkedIn Profile
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label={<FaFacebook className="text-blue-600 text-xl" />}>
                      <Link to="/coming-soon" className="text-gray-700 hover:text-amber-600">
                        Visit Facebook Page
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label={<FaYoutube className="text-red-600 text-xl" />}>
                      <Link to="/coming-soon" className="text-gray-700 hover:text-amber-600">
                        Visit YouTube Channel
                      </Link>
                    </Descriptions.Item>
                  </Descriptions>
                </motion.div>
              </Col>

              <Col xs={24} lg={10}>
                <motion.div variants={fadeUp}>
                  <Form
                    className="bg-white p-6! md:p-10 rounded-xl shadow-lg"
                    form={form}
                    onFinish={() => message.warning("This feature is disabled for now.")}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Send Us a Message
                    </h3>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Your Name"
                        className="p-2! rounded-lg! border! border-gray-200!"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="Your Email"
                        className="p-2! rounded-lg! border! border-gray-200!"
                      />
                    </Form.Item>
                    <Form.Item
                      name="message"
                      rules={[{ required: true, message: "Please enter a message" }]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Your Message"
                        className="p-2 rounded-lg resize-none"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 border-none rounded-lg h-10 font-semibold"
                      >
                        Send Message
                      </Button>
                    </Form.Item>
                  </Form>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </section>
      </main>
    </>
  );
}