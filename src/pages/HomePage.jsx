import { Button, Card, Col, Descriptions, Form, Input, message, Row, Avatar, Carousel } from "antd";
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
import { upcomingEvents } from "../data/BlogData";
import { BlogData } from "../data/data";
import { TestimonialsCard } from "../components/TestimoniesCard";

const { TextArea } = Input;

// Animation variants
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

  // Quick Stats for hero section
  const quickStats = [
    { value: "120+", label: "Total Members", icon: FaUsers },
    { value: "12+", label: "Years of Service", icon: FaAward },
    { value: "9+", label: "Partner Universities", icon: FaGraduationCap },
    { value: "10+", label: "Events Hosted", icon: FaStar },
  ];

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Official Website | PNG WSA</title>
        <meta
          name="description"
          content="Welcome to Papua New Guinea Wuhan Students Association where we strive to bring world class education to PNG students"
        />
        <meta name="og:title" content="Official Website | PNG Wuhan Students Association" />
        <meta name="og:description" content="We strive to connect PNG students to Wuhan's top universities." />
        <script type="application/ld+json">
          "@context": "https://schema.org",
          "@type": "Website",
          "name": "PNG Wuhan Students Association",
          "url": "https://www.pngwuhanstudents.netlify.app"
        </script>
      </Helmet>

      <main className="overflow-hidden">
        {/* Hero Section */}
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
                Empowering PNG Students in Wuhan
              </h2>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[40, 40]} align="middle" justify="center">
              <Col xs={24} lg={12}>
                <motion.div variants={fadeUp}>
                  <p className="text-base text-gray-700 leading-relaxed">
                    The Papua New Guinea Wuhan Students Association (PNGWSA) is the
                    official representative body for Papua New Guinean students
                    studying in Wuhan, Hubei Province, China. The association is
                    dedicated to fostering unity, academic excellence, cultural
                    exchange, and mutual support among its members.
                  </p>
                  <br />
                  <p className="text-base text-gray-700 leading-relaxed">
                    Through academic, social, and cultural initiatives, PNGWSA
                    provides a platform for students to connect, share experiences,
                    and build meaningful relationships while pursuing their studies
                    abroad. We are committed to creating a supportive community that
                    empowers students to succeed both academically and personally.
                  </p>
                </motion.div>
              </Col>

              <Col xs={24} lg={12}>
                <motion.div
                  variants={fadeUp}
                  className="flex justify-center"
                >
                  <img
                    src="/papua-new-guinea-wuhan-students-association-logo.png"
                    alt="PNGWSA Logo"
                    className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-2xl border-4 border-amber-300"
                  />
                </motion.div>
              </Col>
            </Row>

            {/* Values Cards */}
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
                    <Col xs={24} sm={12} lg={6} key={index}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="text-center! h-full! shadow-lg! hover:shadow-xl! transition-all duration-300 border-t-4! overflow-hidden!"
                          style={{ borderTopColor: item.color, }}
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
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-200 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Testimonials
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What Our Members Say
              </h2>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row align="middle" justify="center" gutter={30}
              className="mx-auto"
            >
              <TestimonialsCard />
            </Row>
          </motion.div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Events
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Upcoming Events
              </h2>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[24, 24]} justify="center">
              {upcomingEvents.map((event, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div variants={fadeUp}>
                    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 rounded-xl p-3 flex flex-col items-center min-w-15">
                          <span className="text-2xl font-bold text-amber-600">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-xs text-amber-500">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <FaCalendarAlt className="text-amber-500" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaMapMarkerAlt className="text-amber-500" />
                            <span>{event.location}</span>
                          </div>
                          <Button
                            size="small"
                            className="mt-2! bg-amber-500! text-white! hover:bg-amber-600! border-none! rounded-full!"
                            onClick={()=> {navigate(`/events/${event.link}`)}}
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

        {/* News & Blogs Section */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
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

            <Row gutter={[24, 24]} justify="center">
              {BlogData.slice(0, 4).map((data) => (
                <Col xs={24} sm={12} lg={6} key={data.key}>
                  <motion.div variants={fadeUp}>
                    <BlogProfile
                      blogTitle={data.title}
                      type={data.type}
                      imgSource={data.image}
                      imgDesc={data.link}
                      blog={data.excerpt}
                      action={`/blogs/${data.link}`}
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>

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
                    <Descriptions.Item
                      label={<FaLinkedin className="text-blue-600 text-xl" />}
                    >
                      <Link to="/coming-soon" className="text-gray-700 hover:text-amber-600">
                        Visit LinkedIn Profile
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<FaFacebook className="text-blue-600 text-xl" />}
                    >
                      <Link to="/coming-soon" className="text-gray-700 hover:text-amber-600">
                        Visit Facebook Page
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<FaYoutube className="text-red-600 text-xl" />}
                    >
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

      <style jsx global>{`
        .custom-dots .ant-carousel .slick-dots li button {
          background: #F59E0B !important;
        }
        .custom-dots .ant-carousel .slick-dots li.slick-active button {
          background: #D97706 !important;
        }
      `}</style>
    </>
  );
}