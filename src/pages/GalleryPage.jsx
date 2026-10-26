import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Row, Col, Card, Empty, Skeleton, Image } from "antd";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const GalleryPage = () => {
  const [sections, setSections] = useState([]);
  const [itemsBySection, setItemsBySection] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      const [sectionsRes, itemsRes] = await Promise.all([
        supabase.from("gallery_sections").select("*").order("display_order"),
        supabase
          .from("gallery")
          .select("*")
          .eq("published", true)
          .order("display_order"),
      ]);

      if (sectionsRes.error) console.error(sectionsRes.error);
      if (itemsRes.error) console.error(itemsRes.error);

      const grouped = {};
      (itemsRes.data ?? []).forEach((item) => {
        if (!grouped[item.section_id]) grouped[item.section_id] = [];
        grouped[item.section_id].push(item);
      });

      setSections(sectionsRes.data ?? []);
      setItemsBySection(grouped);
      setLoading(false);
    };

    fetchGallery();
  }, []);

  return (
    <>
      <Helmet>
        <title>Gallery | PNG HSA</title>
        <meta name="description" content="Moments from the PNG Hubei Students Association" />
        <link rel="canonical" href="https://www.pngwuhanstudents.netlify.app/gallery" />
      </Helmet>

      <main className="overflow-hidden">
        {/* Page header */}
        <section className="py-16 px-4 md:px-16 bg-linear-to-r from-amber-50 to-white">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              Gallery
            </h6>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Moments That <span className="text-amber-500">Matter</span>
            </h1>
            <p className="text-gray-600 mt-4">
              A collection of memories, milestones, and everyday life from our
              community in Hubei.
            </p>
            <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </motion.div>
        </section>

        {/* Sections */}
        {loading ? (
          <div className="py-16 px-4 md:px-16">
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4].map((i) => (
                <Col xs={24} sm={12} lg={8} key={i}>
                  <Card className="rounded-2xl shadow-sm">
                    <Skeleton.Image active className="w-full!" />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : sections.length === 0 ? (
          <div className="py-20 text-center">
            <Empty description="No gallery content yet" />
          </div>
        ) : (
          sections.map((section) => {
            const items = itemsBySection[section.id] ?? [];
            if (items.length === 0) return null;

            return (
              <section
                key={section.id}
                className="py-14 px-4 md:px-16 border-t border-gray-100"
              >
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <motion.div variants={fadeUp} className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-gray-500 mt-2 max-w-2xl">
                        {section.description}
                      </p>
                    )}
                    <div className="w-16 h-1 bg-amber-500 mt-3 rounded-full mx-auto md:mx-0" />
                  </motion.div>

                  <Row gutter={[16, 16]}>
                    {items.map((item) => (
                      <Col xs={24} sm={12} lg={8} key={item.id}>
                        <motion.div variants={fadeUp}>
                          <Image
                            src={item.image_url}
                            alt={item.title || "Gallery image"}
                            className="rounded-2xl"
                            wrapperClassName="w-full!"
                            style={{ width: "100%", height: 260, objectFit: "cover" }}
                            preview={{ mask: "View" }}
                          />
                          {/* Always-visible caption */}
                          <div className="mt-3">
                            {item.title && (
                              <h3 className="text-sm font-semibold text-gray-800">
                                {item.title}
                              </h3>
                            )}
                            {item.caption && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {item.caption}
                              </p>
                            )}
                            {(item.event || item.taken_date) && (
                              <p className="text-[11px] text-gray-400 mt-1">
                                {[item.event, item.taken_date].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </motion.div>
              </section>
            );
          })
        )}
      </main>
    </>
  );
};

export default GalleryPage;