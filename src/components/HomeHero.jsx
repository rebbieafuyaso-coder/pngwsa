import { Col, Row } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";

const PrimaryBtn = ({ label, action }) => {
  return (
    <motion.button
      onClick={action}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative px-8 py-3 rounded-full font-semibold text-sm overflow-hidden shadow-lg flex items-center gap-2"
      style={{
        background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
        color: "#1a1a2e",
      }}
    >
      {label}
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <FaArrowRight className="text-xs" />
      </motion.span>
    </motion.button>
  );
};

const HomeHero = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  return (
    <section className="min-h-screen overflow-hidden relative bg-transparent text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/pngwsa-members.jpg"
          alt="PNGWSA members"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40" />
      </div>

      {/* Content */}
      <Row
        className="min-h-screen relative z-10"
        align="middle"
        justify="center"
      >
        <Col xs={24} lg={14} xl={12}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="px-6 md:px-0"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-block bg-yellow-400/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-yellow-200 text-xs uppercase tracking-wider border border-yellow-400/20">
                Established in Wuhan, China
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Papua New Guinea</span>
                <br />
                <span className="text-yellow-400">Wuhan Students Association</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-gray-300 max-w-xl py-6 leading-relaxed"
            >
              Connecting, empowering, and supporting PNG students pursuing
              excellence in Wuhan's top universities.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <PrimaryBtn label="Learn More" action={() => navigate("/about")} />
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll</span>
          <FaChevronDown className="text-gray-500 text-sm" />
        </div>
      </motion.div>
    </section>
  );
};

export default HomeHero;