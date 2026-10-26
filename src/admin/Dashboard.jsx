import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Typography, Skeleton } from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  PictureOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet-async";

const { Title, Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const STATS = [
  {
    key: "members",
    title: "Members",
    table: "members",
    icon: <UserOutlined />,
    color: "bg-sky-500",
  },
  {
    key: "executives",
    title: "Executives",
    table: "executives",
    icon: <CrownOutlined />,
    color: "bg-amber-500",
  },
  {
    key: "events",
    title: "Events",
    table: "events",
    icon: <CalendarOutlined />,
    color: "bg-blue-500",
  },
  {
    key: "blogs",
    title: "Blogs",
    table: "blogs",
    icon: <FileTextOutlined />,
    color: "bg-green-500",
  },
  {
    key: "alumni",
    title: "Alumni",
    table: "alumni",
    icon: <TeamOutlined />,
    color: "bg-purple-500",
  },
  {
    key: "gallery",
    title: "Gallery Items",
    table: "gallery",
    icon: <PictureOutlined />,
    color: "bg-orange-500",
  },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);

      const results = await Promise.all(
        STATS.map(async (stat) => {
          const { count, error } = await supabase
            .from(stat.table)
            .select("*", { count: "exact", head: true });

          if (error) {
            console.warn(`Count failed for ${stat.table}:`, error.message);
            return [stat.key, 0];
          }
          return [stat.key, count ?? 0];
        })
      );

      setCounts(Object.fromEntries(results));
      setLoading(false);
    };

    fetchCounts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard Admin | PNG HSA</title>
        <meta name="description" content="Admin Dashboard" />
      </Helmet>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="w-full"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-4 sm:mb-6 px-1">
          <Title level={3} className="mb-1! text-xl sm:text-2xl md:text-3xl">
            Dashboard
          </Title>
          <Text type="secondary" className="text-xs sm:text-sm">
            Overview of your content across the association.
          </Text>
        </motion.div>

        {/* Stat cards grid */}
        <Row gutter={[12, 12]} className="sm:!mx-0">
          {STATS.map((stat) => (
            <Col xs={12} sm={12} md={8} lg={8} xl={8} key={stat.key}>
              <motion.div variants={fadeUp} className="h-full">
                <Card
                  bordered={false}
                  className="rounded-xl sm:rounded-2xl shadow-sm transition-shadow hover:shadow-md h-full"
                  styles={{ body: { padding: "14px" } }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {loading ? (
                        <Skeleton.Input
                          active
                          size="small"
                          style={{ width: "80%", minWidth: 60 }}
                        />
                      ) : (
                        <Statistic
                          title={
                            <span className="text-xs sm:text-sm text-slate-500 block truncate">
                              {stat.title}
                            </span>
                          }
                          value={counts[stat.key] ?? 0}
                          valueStyle={{
                            fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                            lineHeight: 1.2,
                          }}
                        />
                      )}
                    </div>
                    <div
                      className={`flex shrink-0 h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl text-white text-sm sm:text-base ${stat.color}`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Getting Started */}
        <motion.div variants={fadeUp} className="mt-4 sm:mt-6">
          <Card
            bordered={false}
            className="rounded-xl sm:rounded-2xl shadow-sm"
            title={
              <span className="text-sm sm:text-base">Getting Started</span>
            }
            styles={{ body: { padding: "16px" } }}
          >
            <ul className="list-disc space-y-2 pl-4 sm:pl-5 text-xs sm:text-sm text-slate-600">
              <li>
                Use the sidebar to manage members, executives, events, blogs,
                alumni, and gallery.
              </li>
              <li>Each section has its own form — build them one at a time.</li>
              <li>All content is stored in Supabase tables you create.</li>
            </ul>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;