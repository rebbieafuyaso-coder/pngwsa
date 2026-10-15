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

/* =========================================================
   STAT CARD CONFIG
   `table` is the Supabase table the count comes from.
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);

      // Count rows in each table in parallel
      const results = await Promise.all(
        STATS.map(async (stat) => {
          const { count, error } = await supabase
            .from(stat.table)
            .select("*", { count: "exact", head: true });

          if (error) {
            // Tables that don't exist yet just show 0
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
        <title>PNG HSA | Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard" />
      </Helmet>
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp} className="mb-6">
        <Title level={3} className="mb-1!">
          Dashboard
        </Title>
        <Text type="secondary">
          Overview of your content across the association.
        </Text>
      </motion.div>

      <Row gutter={[16, 16]}>
        {STATS.map((stat) => (
          <Col xs={24} sm={12} lg={8} key={stat.key}>
            <motion.div variants={fadeUp}>
              <Card
                bordered={false}
                className="rounded-2xl shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  {loading ? (
                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                  ) : (
                    <Statistic
                      title={
                        <span className="text-sm text-slate-500">
                          {stat.title}
                        </span>
                      }
                      value={counts[stat.key] ?? 0}
                    />
                  )}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div variants={fadeUp} className="mt-6">
        <Card
          bordered={false}
          className="rounded-2xl shadow-sm"
          title="Getting Started"
        >
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Use the sidebar to manage members, executives, events, blogs, alumni, and gallery.</li>
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