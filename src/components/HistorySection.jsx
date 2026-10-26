import { Col, Row } from "antd";
import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";

// Animation variants (matching AboutPage)
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

const pioneers = [
  { role: "President", name: "Mr. Daniel Kereka" },
  { role: "Vice President", name: "Mrs. Caribean Parkop" },
  { role: "Secretary", name: "Mr. Pius Clement" },
  { role: "Treasurer", name: "Mr. Steven Matainaho" },
  { role: "Public Relations Officer", name: "Mr. Marcel Parkop" },
  { role: "Sports Coordinator", name: "Mr. Elizah Morea" },
];

export default function HistorySection() {
  return (
    <section className="py-16 px-4 md:px-16 bg-white">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Section Header */}
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
            Our History
          </h6>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            History of PNG Hubei Students Association
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
        </motion.div>

        <Row gutter={[40, 40]} align="middle">
          {/* Text Column */}
          <Col xs={24} lg={12}>
            <motion.p
              variants={fadeUp}
              className="text-gray-700 leading-relaxed"
            >
              The association was founded in <strong>2014</strong> in{" "}
              <strong>Wuhan City, Hubei Province, China</strong> under the name{" "}
              <b>PNG Wuhan Students Association</b>. It was founded with the
              sole purpose of uniting PNG students across Wuhan to help and
              support one another. It was founded by a group of PNG students who
              were studying in Wuhan at the time, and they wanted to create a
              platform for PNG students to connect and support each other. So
              they created the association and named it{" "}
              <b>PNG Wuhan Students Association</b>, because at that time it was
              only representing students in Wuhan City. The association was
              later renamed to <b>PNG Hubei Students Association</b> to reflect
              the fact that it now represents PNG students across the entire
              Hubei Province, not just Wuhan City.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-gray-700 leading-relaxed mt-4"
            >
              The first pioneer executives of PNG Wuhan Students Association
              were:
            </motion.p>

            <motion.ul
              variants={fadeUp}
              className="list-disc list-inside mt-2 space-y-1 text-gray-700"
            >
              {pioneers.map((p) => (
                <li key={p.role}>
                  <strong>{p.role}:</strong> {p.name}
                </li>
              ))}
            </motion.ul>

            <motion.p
              variants={fadeUp}
              className="text-gray-700 leading-relaxed mt-4"
            >
              Over the years, the association has grown significantly and has
              become a vital part of the PNG student community in Hubei
              Province.
            </motion.p>
          </Col>

          {/* Image Column */}
          <Col xs={24} lg={12}>
            <motion.div
              variants={fadeUp}
              className="overflow-hidden rounded-2xl shadow-2xl"
            >
              <img
                src="/rebbie-afuyaso-and-png-students-in-wut.jpg"
                alt="Rebbie Afuyaso and PNG Students"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </section>
  );
}