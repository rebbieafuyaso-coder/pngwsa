import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Row, Col, Card, Tag, Button, } from "antd";
import { 
  FaUsers, 
  FaGraduationCap, 
  FaStar, 
  FaTrophy,
  FaUserGraduate,
  FaArrowRight,
  FaAward,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

import HeroComponent from "../components/HeroComponent";
import GalleryCard from "../components/GalleryCard";
import { GalleryPreview, HeroData } from "../data/BlogData";

const { 
  academic, 
  events, 
  administrative, 
  community, 
  lifestyle, 
  cultural 
} = GalleryPreview;

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

export default function MembersPage() {
  // Member Statistics
  const memberStats = [
    { title: "Total Members", value: 120, icon: FaUsers, color: "#F59E0B" },
    { title: "Alumni Network", value: 45, icon: FaUserGraduate, color: "#3B82F6" },
    { title: "Universities", value: 9, icon: FaGraduationCap, color: "#10B981" },
    { title: "Events Taken Part In", value: 25, icon: FaTrophy, color: "#8B5CF6" },
  ];

  return (
    <>
      <Helmet>
        <title>Members | PNG WSA</title>
        <meta 
          name="description" 
          content="Members are the heart of PNG Wuhan Students Association. Serving the students with humility" 
        />
        <meta name="og:title" content="Members | PNG WSA" />
        <meta 
          name="og:description" 
          content="Members are the heart of PNG Wuhan Students Association. Serving the students with humility" 
        />
      </Helmet>

      <main className="overflow-hidden">
        {/* Hero Section */}
        {HeroData.members.map((data) => (
          <HeroComponent
            key={data.key}
            title={data.title}
            smallTitle={data.smallTitle}
            imgSource={data.imgSource}
            imgAlt={data.imgAlt}
            text={data.text}
            buttonText="Join Our Community"
            buttonAction="/contact"
          />
        ))}

        {/* Member Statistics */}
        <section className="py-12 px-4 bg-linear-to-r from-amber-50 to-white">
          <Row gutter={[16, 16]} justify="center">
            {memberStats.map((stat, index) => {
              return (
                <Col xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold" style={{ color: stat.color }}>
                      {stat.value}+
                    </div>
                    <div className="text-sm text-gray-500">{stat.title}</div>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </section>

        {/* Gallery Section */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Memories
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Member <span className="text-amber-500">Gallery</span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Collections of memories, achievements, and daily life all in one place
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[12, 12]} justify="center">
              {/* Academic Gallery - Featured */}
              <Col xs={24} sm={12} lg={12}>
                <motion.div variants={fadeUp}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <FaGraduationCap className="inline mr-2 text-amber-500" />
                    Academic Life
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {academic.slice(0, 4).map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </motion.div>
              </Col>

              {/* Events Gallery */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div variants={fadeUp}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <FaStar className="inline mr-2 text-amber-500" />
                    Events
                  </h4>
                  <div className="space-y-2">
                    {events.slice(0, 3).map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </motion.div>
              </Col>

              {/* Administrative Gallery */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div variants={fadeUp}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <FaUsers className="inline mr-2 text-amber-500" />
                    Administrative
                  </h4>
                  <div className="space-y-2">
                    {administrative.slice(0, 3).map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </motion.div>
              </Col>

              {/* Community Gallery */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div variants={fadeUp}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <FaHeart className="inline mr-2 text-amber-500" />
                    Community
                  </h4>
                  <div className="space-y-2">
                    {community.slice(0, 3).map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </motion.div>
              </Col>

              {/* Lifestyle Gallery */}
              <Col xs={24} sm={12} lg={12}>
                <motion.div variants={fadeUp}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-amber-500" />
                    Lifestyle
                  </h4>
                  <div className="space-y-2">
                    {lifestyle.slice(0, 3).map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </motion.div>
              </Col>

              {/* Cultural Gallery */}
              <Col xs={24} sm={12} lg={6}>
                <motion.div variants={fadeUp}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    <FaAward className="inline mr-2 text-amber-500" />
                    Cultural
                  </h4>
                  <div className="space-y-2">
                    {cultural.slice(0, 3).map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </section>

        {/* Featured Alumni Section */}
        <section className="py-16 px-4 md:px-16 bg-amber-50">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-200 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Alumni Spotlight
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured <span className="text-amber-500">Alumni</span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Our alumni are making waves in various fields across the globe
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>
            <p className="text-center font-bold">Directory Comming Soon</p>
            <motion.div variants={fadeUp} className="text-center mt-8">
              <Button 
                className="border-amber-500 text-amber-500 hover:bg-amber-50 rounded-full px-8 h-10 font-medium"
                onClick={() => window.location.href = '/alumni'}
              >
                View All Alumni
                <FaArrowRight className="inline ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Members Data Section */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Member Directory
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our loyal members are the heart of our association. Every event
                and activity is tailored to make sure they feel at home and
                enjoy their stay in Wuhan, China.
              </p>
            </motion.div>

            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={16} md={12} lg={8}>
                <motion.div variants={fadeUp}>
                  <Card className="text-center py-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-full w-fit mx-auto">
                      <FaUsers className="text-5xl text-amber-500" />
                      <span className="text-5xl font-light text-gray-400">+</span>
                      <FaGraduationCap className="text-5xl text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-4">
                      Member Directory Coming Soon
                    </h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                      We are currently collecting and organizing student data.
                      The full member directory will be available soon.
                    </p>
                    <Tag color="gold" className="mt-3">
                      <FaCalendarAlt className="inline mr-1" />
                      Expected: Q2 2026
                    </Tag>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </section>
      </main>
    </>
  );
}