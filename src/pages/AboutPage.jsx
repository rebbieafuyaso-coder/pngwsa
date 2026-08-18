import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Card, Col, Row, Avatar, Tag, Button } from "antd";
import {
  FaQuoteLeft,
  FaGraduationCap,
  FaUsers,
  FaHandshake,
  FaStar,
  FaAward,
  FaGlobe,
  FaRocket,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import HeroComponent from "../components/HeroComponent";
import { executiveProfile, HeroData, MissionCards } from "../data/BlogData";
import ExecutiveCards from "../components/ExecutiveCards";

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

export default function AboutPage() {

  // Alumni Data
  const alumni = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      position: "Research Scientist",
      company: "Stanford University",
      year: "2018",
      school: "Wuhan University",
      image: "SJ",
    },
    {
      id: 2,
      name: "David Wang",
      position: "Software Engineer",
      company: "Google",
      year: "2019",
      school: "Huazhong University of Science & Technology",
      image: "DW",
    },
    {
      id: 3,
      name: "Maria Garcia",
      position: "International Relations",
      company: "PNG Embassy",
      year: "2020",
      school: "Wuhan University",
      image: "MG",
    },
    {
      id: 4,
      name: "James Okafor",
      position: "Entrepreneur",
      company: "TechStart Inc.",
      year: "2021",
      school: "Wuhan University of Technology",
      image: "JO",
    },
  ];

  // Featured Projects
  const projects = [
    {
      id: 1,
      title: "STEM Scholarship Initiative",
      description:
        "Partnering with Chinese universities to provide STEM scholarships for PNG students.",
      icon: FaGraduationCap,
      color: "#F59E0B",
      status: "Ongoing",
    },
    {
      id: 2,
      title: "Cultural Exchange Program",
      description:
        "Bridging cultures through events, workshops, and community engagement.",
      icon: FaGlobe,
      color: "#3B82F6",
      status: "Active",
    },
    {
      id: 3,
      title: "PNGWSA Mentorship Program",
      description:
        "Connecting new students with experienced mentors for academic and personal growth.",
      icon: FaHandshake,
      color: "#10B981",
      status: "Active",
    },
    {
      id: 4,
      title: "Annual Leadership Summit",
      description:
        "Developing future leaders through workshops, panels, and networking.",
      icon: FaRocket,
      color: "#8B5CF6",
      status: "Upcoming",
    },
  ];

  // Impact Stats
  const stats = [
    { value: "120+", label: "Active Members", icon: FaUsers },
    { value: "9+", label: "Universities", icon: FaGraduationCap },
    { value: "12+", label: "Years of Growth", icon: FaAward },
    { value: "10+", label: "Events Hosted", icon: FaStar },
  ];

  return (
    <>
      <Helmet>
        <title>About | PNG WSA</title>
        <meta
          name="description"
          content="Know more about Us, Meet our teams and Get to know about our core mission, values and objectives."
        />
        <meta name="og:title" content="About | PNG WSA" />
        <meta
          name="og:description"
          content="Know more about us, meet our teams and Get to know more about our core mission, values and objectives"
        />
      </Helmet>

      <main className="overflow-hidden">
        {/* Hero Section */}
        {HeroData.about.map((data) => (
          <HeroComponent
            key={data.key}
            imgSource={data.imgSource}
            imgAlt={data.imgAlt}
            smallTitle={data.smallTitle}
            title={data.title}
            text={data.text}
          />
        ))}

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
                About Us
              </h6>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Who We Are
              </h2>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[40, 40]}>
              <Col xs={24} lg={12}>
                <motion.p
                  variants={fadeUp}
                  className="text-gray-700 leading-relaxed"
                >
                  The PNG Wuhan Students Association is a student-led organization
                  made up of Papua New Guinean students studying in Wuhan, China.
                  Established to support and unite PNG students, the association
                  is run entirely by students and is dedicated to promoting the
                  welfare, academic success, and personal development of its
                  members.
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-gray-700 leading-relaxed mt-4"
                >
                  Our mission is to create a supportive and inclusive environment
                  that helps students adapt to life and study in China. We provide
                  guidance, mentorship, and assistance to students throughout
                  their academic journey, ensuring they have access to the
                  resources and support needed to succeed.
                </motion.p>
              </Col>
              <Col xs={24} lg={12}>
                <motion.p
                  variants={fadeUp}
                  className="text-gray-700 leading-relaxed"
                >
                  The association actively advocates for the welfare of PNG
                  students, organizes educational and cultural activities, and
                  fosters a strong sense of community among members. We also work
                  closely with the Papua New Guinea Embassy in China, Chinese
                  universities, private individuals, and government scholarship
                  programs to create opportunities for our students.
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-gray-700 leading-relaxed mt-4"
                >
                  Whether you're a current student, prospective applicant, or
                  partner organization, we welcome you to connect with us and be
                  part of our growing community.
                </motion.p>
              </Col>
            </Row>

            {/* Featured Quote */}
            <motion.div
              variants={fadeUp}
              className="mt-8 max-w-6xl mx-auto p-6 md:p-8 bg-amber-50 rounded-2xl border-l-4 border-amber-500 shadow-2xl"
            >
              <FaQuoteLeft className="text-amber-400 text-3xl mb-3" />
              <p className="text-lg md:text-xl text-gray-700">
                "Founded in 2011, the PNG Wuhan Students Association has grown to
                support over 120+ students across Wuhan's top universities since it's establishment."
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 md:px-16 bg-linear-to-r from-amber-500 to-amber-600">
          <Row gutter={[20, 20]} justify="center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Col xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center text-white"
                  >
                    <Icon className="text-3xl md:text-4xl mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-sm md:text-base opacity-90">
                      {stat.label}
                    </div>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </section>

        {/* Mission Cards */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
            >
              Our Mission & Values
            </motion.h2>

            <Row gutter={[30, 30]} justify="center">
              {MissionCards.map((data) => (
                <Col xs={24} sm={12} lg={6} key={data.key}>
                  <motion.div variants={fadeUp}>
                    <Card
                      hoverable
                      className="h-80 border-t-4! border-t-amber-500! border-gray-200! shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <h4 className="text-center text-red-900 font-bold text-lg">
                        {data.title}
                      </h4>
                      <div className="border border-red-900 text-red-900 w-fit mx-auto p-5 rounded-full my-2 text-2xl">
                        {data.icon}
                      </div>
                      <p className="text-gray-600 text-center">{data.text}</p>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* Executive Profiles */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Our Team
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Executive Profiles
              </h2>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            <Row gutter={[30, 30]} justify="center">
              {executiveProfile.map((profile) => (
                <Col xs={24} sm={12} lg={6} key={profile.key}>
                  <motion.div variants={fadeUp}>
                    <ExecutiveCards
                      profilePic={profile.profilePic}
                      name={profile.name}
                      school={profile.school}
                      position={profile.position}
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>


        {/* CTA Section */}
        <section className="py-16 px-4 md:px-16 bg-linear-to-r from-amber-500 to-amber-600">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-6">
              Whether you're a current student, prospective applicant, or partner
              organization, we welcome you to connect with us.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="large"
                className="bg-white text-amber-600 hover:bg-gray-100 font-semibold rounded-full px-8"
              >
                Get Involved
              </Button>
              <Button
                size="large"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full px-8"
              >
                <FaEnvelope className="inline mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}