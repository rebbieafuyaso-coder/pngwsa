import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Row, Col, Card, Button, Empty, Skeleton } from "antd";
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
import { HeroData } from "../data/BlogData";
import MembersSection from "./MembersSection";
import { supabase } from "../supabaseClient";

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

// Optional: map section slugs to icons so cards feel consistent
const SECTION_ICONS = {
  academic: FaGraduationCap,
  events: FaStar,
  administrative: FaUsers,
  community: FaHeart,
  lifestyle: FaMapMarkerAlt,
  cultural: FaAward,
};

export default function MembersPage() {
  /* =========================================================
     GALLERY SECTION PREVIEWS (from Supabase)
  ========================================================= */

  const [gallerySections, setGallerySections] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchGallerySections = async () => {
      setGalleryLoading(true);

      const { data: sections, error: secErr } = await supabase
        .from("gallery_sections")
        .select("*")
        .order("display_order");

      if (secErr) {
        console.error("gallery sections:", secErr);
        setGallerySections([]);
        setGalleryLoading(false);
        return;
      }

      // For each section, grab a cover image + count of published items
      const withMeta = await Promise.all(
        (sections ?? []).map(async (section) => {
          const { data: coverData } = await supabase
            .from("gallery")
            .select("image_url")
            .eq("section_id", section.id)
            .eq("published", true)
            .order("display_order")
            .limit(1);

          const { count } = await supabase
            .from("gallery")
            .select("*", { count: "exact", head: true })
            .eq("section_id", section.id)
            .eq("published", true);

          return {
            ...section,
            cover: coverData?.[0]?.image_url ?? null,
            count: count ?? 0,
          };
        })
      );

      // Only show sections that actually have photos
      setGallerySections(withMeta.filter((s) => s.count > 0));
      setGalleryLoading(false);
    };

    fetchGallerySections();
  }, []);

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
        <title>Members | PNG HSA</title>
        <meta
          name="description"
          content="Members are the heart of PNG Wuhan Students Association. Serving the students with humility"
        />
        <meta name="og:title" content="Members | PNG WSA" />
        <meta
          name="og:description"
          content="Members are the heart of PNG Wuhan Students Association. Serving the students with humility"
        />
        <link
          rel="canonical"
          href="https://www.pngwuhanstudents.netlify.app/members"
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
            {memberStats.map((stat, index) => (
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
            ))}
          </Row>
        </section>

        {/* =========================================================
            GALLERY PREVIEW (from Supabase)
        ========================================================= */}
        <section className="py-16 px-4 md:px-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Memories
              </h6>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Member <span className="text-amber-500">Gallery</span>
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Collections of memories, achievements, and daily life all in one
                place. Click a section to explore the full story.
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
            </motion.div>

            {galleryLoading ? (
              <Row gutter={[20, 20]} justify="center">
                {[1, 2, 3].map((i) => (
                  <Col xs={24} sm={12} lg={8} key={i}>
                    <Card className="rounded-2xl shadow-sm" loading />
                  </Col>
                ))}
              </Row>
            ) : gallerySections.length === 0 ? (
              <div className="py-16 text-center">
                <Empty description="Gallery is being updated. Check back soon!" />
              </div>
            ) : (
              <Row gutter={[20, 20]} justify="center">
                {gallerySections.map((section) => {
                  const Icon = SECTION_ICONS[section.slug] || FaAward;
                  return (
                    <Col xs={24} sm={12} lg={8} key={section.id}>
                      <motion.div variants={fadeUp} className="h-full">
                        <Link to={`/gallery/${section.slug}`}>
                          <Card
                            hoverable
                            className="group h-full overflow-hidden rounded-2xl border-none shadow-md transition-shadow duration-300 hover:shadow-xl"
                            styles={{ body: { padding: 0 } }}
                          >
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                              {section.cover ? (
                                <img
                                  src={section.cover}
                                  alt={section.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                  <Icon size={40} />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                <h3 className="flex items-center gap-2 text-lg font-bold">
                                  <Icon className="text-amber-300" />
                                  {section.title}
                                </h3>
                                <p className="text-xs text-white/80 mt-1">
                                  {section.count}{" "}
                                  {section.count === 1 ? "photo" : "photos"}
                                </p>
                              </div>
                            </div>

                            <div className="p-5">
                              {section.description && (
                                <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                                  {section.description}
                                </p>
                              )}
                              <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 transition-all group-hover:gap-3">
                                View Gallery <FaArrowRight />
                              </span>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            )}

            {/* Link to full gallery page if you add one later */}
            {gallerySections.length > 0 && (
              <motion.div variants={fadeUp} className="mt-10 text-center">
                <Link to="/gallery">
                  <Button className="rounded-full! border-amber-500! px-8! text-amber-500! hover:bg-amber-50!">
                    View Full Gallery <FaArrowRight className="ml-2 inline" />
                  </Button>
                </Link>
              </motion.div>
            )}
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
            <p className="text-center font-bold">Directory Coming Soon</p>
            <motion.div variants={fadeUp} className="text-center mt-8"></motion.div>
          </motion.div>
        </section>

        {/* Members Data Section */}
        <section className="py-16 px-4 md:px-16">
          <MembersSection />
        </section>
      </main>
    </>
  );
}