import { useEffect, useMemo, useState } from "react";

import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Tag,
  Avatar,
  Empty,
  Typography,
  Button,
  Statistic,
  Divider,
  Tooltip,
  Skeleton,
  message,
} from "antd";

import {
  SearchOutlined,
  UserOutlined,
  BankOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  TeamOutlined,
  ClearOutlined,
} from "@ant-design/icons";

import { motion } from "framer-motion";
import { FaGraduationCap, FaUsers, FaLinkedin } from "react-icons/fa";

import { supabase } from "../supabaseClient";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* =========================================================
   HELPERS
========================================================= */

const getGraduateLevelColor = (level) => {
  const colors = {
    undergraduate: "blue",
    graduate: "green",
    phd: "purple",
    postdoc: "magenta",
    professional: "orange",
  };
  return colors[level?.toLowerCase()] || "default";
};

const formatGraduateLevel = (level) => {
  const labels = {
    undergraduate: "Undergraduate",
    graduate: "Graduate / Master's",
    phd: "PhD / Doctorate",
    postdoc: "Postdoctoral",
    professional: "Professional",
  };
  return labels[level?.toLowerCase()] || level || "—";
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/* =========================================================
   COMPONENT
========================================================= */

const MembersSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("All");
  const [filterGraduateLevel, setFilterGraduateLevel] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  /* =========================================================
     FETCH FROM SUPABASE
  ========================================================= */

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch members:", error);
        message.error("Failed to load members");
        setMembers([]);
      } else {
        setMembers(data ?? []);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  /* =========================================================
     DERIVED: UNIQUE FILTER VALUES
  ========================================================= */

  const uniqueUniversities = useMemo(() => {
    const set = new Set(
      members.map((m) => m.university).filter(Boolean)
    );
    return ["All", ...Array.from(set).sort()];
  }, [members]);

  const uniqueGraduateLevels = useMemo(() => {
    const set = new Set(
      members.map((m) => m.graduate_level).filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [members]);

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((member) =>
        [
          member.fullname,
          member.university,
          member.course,
          member.graduate_level,
          member.city,
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term))
      );
    }

    if (filterUniversity !== "All") {
      filtered = filtered.filter(
        (m) => m.university === filterUniversity
      );
    }

    if (filterGraduateLevel !== "All") {
      filtered = filtered.filter(
        (m) => m.graduate_level === filterGraduateLevel
      );
    }

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) =>
          (a.fullname || "").localeCompare(b.fullname || "")
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          (b.fullname || "").localeCompare(a.fullname || "")
        );
        break;
      case "university":
        filtered.sort((a, b) =>
          (a.university || "").localeCompare(b.university || "")
        );
        break;
      case "graduateLevel":
        filtered.sort((a, b) =>
          (a.graduate_level || "").localeCompare(b.graduate_level || "")
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [
    members,
    searchTerm,
    filterUniversity,
    filterGraduateLevel,
    sortBy,
  ]);

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearchTerm("");
    setFilterUniversity("All");
    setFilterGraduateLevel("All");
    setSortBy("name");
  };

  const hasFilters =
    searchTerm ||
    filterUniversity !== "All" ||
    filterGraduateLevel !== "All" ||
    sortBy !== "name";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 px-4 md:px-8 lg:px-16">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 mx-auto max-w-7xl"
      >
        {/* ================= HERO ================= */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20"
          >
            <FaUsers size={24} />
          </motion.div>

          <Title
            level={1}
            className="mb-3! text-4xl! font-bold! tracking-tight! text-slate-900! md:text-5xl! font-sans!"
          >
            Member Directory
          </Title>

          <Paragraph className="mx-auto max-w-2xl text-base font-display! leading-7 text-slate-500 md:text-lg">
            Meet the people who make our community special. Explore members
            by university, academic level, field of study, and more.
          </Paragraph>
        </motion.div>

        {/* ================= STATISTICS ================= */}
        <motion.div variants={fadeUp} className="mb-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card bordered={false} className="rounded-2xl shadow-sm">
                <Statistic
                  title={<span className="text-sm text-slate-500">Total Members</span>}
                  value={members.length}
                  prefix={<TeamOutlined className="text-amber-500" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} className="rounded-2xl shadow-sm">
                <Statistic
                  title={<span className="text-sm text-slate-500">Universities</span>}
                  value={Math.max(uniqueUniversities.length - 1, 0)}
                  prefix={<BankOutlined className="text-amber-500" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} className="rounded-2xl shadow-sm">
                <Statistic
                  title={<span className="text-sm text-slate-500">Academic Levels</span>}
                  value={Math.max(uniqueGraduateLevels.length - 1, 0)}
                  prefix={<FaGraduationCap className="text-amber-500" />}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* ================= SEARCH / FILTER PANEL ================= */}
        <motion.div variants={fadeUp} className="mb-8">
          <Card bordered={false} className="overflow-hidden rounded-2xl shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <Text className="text-base! font-semibold! text-slate-800!">
                  Find a Member
                </Text>
                <div className="mt-1">
                  <Text className="!text-xs! text-slate-400!">
                    Search and filter the directory
                  </Text>
                </div>
              </div>

              {hasFilters && (
                <Button
                  type="text"
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={clearFilters}
                  className="text-xs! text-slate-500! hover:text-orange-500!"
                >
                  Clear
                </Button>
              )}
            </div>

            <Row gutter={[12, 12]}>
              <Col xs={24} lg={8}>
                <Input
                  placeholder="Search members..."
                  prefix={<SearchOutlined className="text-slate-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  size="middle"
                  className="text-sm!"
                />
              </Col>

              <Col xs={12} sm={8} lg={5}>
                <Select
                  value={filterUniversity}
                  onChange={setFilterUniversity}
                  size="middle"
                  className="w-full text-sm!"
                  suffixIcon={<BankOutlined className="text-slate-400" />}
                >
                  {uniqueUniversities.map((university) => (
                    <Option key={university} value={university}>
                      <span className="text-sm">{university}</span>
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={12} sm={8} lg={5}>
                <Select
                  value={filterGraduateLevel}
                  onChange={setFilterGraduateLevel}
                  size="middle"
                  className="w-full text-sm!"
                  suffixIcon={<FaGraduationCap className="text-slate-400" />}
                >
                  {uniqueGraduateLevels.map((level) => (
                    <Option key={level} value={level}>
                      <span className="text-sm">{formatGraduateLevel(level)}</span>
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={12} sm={8} lg={4}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  size="middle"
                  className="w-full text-sm!"
                  suffixIcon={<SortAscendingOutlined className="text-slate-400" />}
                >
                  <Option value="name">Name (A-Z)</Option>
                  <Option value="name-desc">Name (Z-A)</Option>
                  <Option value="university">University</Option>
                  <Option value="graduateLevel">Graduate Level</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* ================= RESULTS HEADER ================= */}
        <motion.div
          variants={fadeUp}
          className="mb-5 flex items-center justify-between"
        >
          <div>
            <Text className="text-sm! font-medium! text-slate-700!">
              {loading
                ? "Loading..."
                : `${filteredMembers.length} ${
                    filteredMembers.length === 1 ? "member" : "members"
                  }`}
            </Text>
            {!loading && (
              <Text className="ml-1! text-xs! text-slate-400!">found</Text>
            )}
          </div>

          {hasFilters && (
            <Tag icon={<FilterOutlined />} color="orange" className="rounded-full! text-xs!">
              Filters active
            </Tag>
          )}
        </motion.div>

        {/* ================= MEMBER CARDS ================= */}
        {loading ? (
          <Row gutter={[20, 20]}>
            {[1, 2, 3, 4].map((i) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={i}>
                <Card className="rounded-2xl shadow-sm">
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : filteredMembers.length > 0 ? (
          <Row gutter={[20, 20]}>
            {filteredMembers.map((member, index) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={member.id || index}>
                <motion.div
                  variants={cardAnimation}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <Card
                    bordered={false}
                    className="group h-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl"
                    bodyStyle={{ padding: "20px" }}
                    actions={[
                      <Tooltip title="View LinkedIn profile" key="linkedin">
                        <Button
                          type="text"
                          href={
                            member.linkedin_url
                              ? member.linkedin_url
                              : undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!member.linkedin_url}
                          icon={<FaLinkedin />}
                          className="text-xs! text-slate-500! hover:text-blue-600!"
                        >
                          LinkedIn
                        </Button>
                      </Tooltip>,
                    ]}
                  >
                    {/* Avatar header */}
                    <div className="relative -mx-5 -mt-5 mb-5 overflow-hidden">
                      <div className="relative h-28 bg-linear-to-br from-amber-100 via-orange-50 to-white">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-orange-200/50"
                        />
                        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-amber-200/20" />
                      </div>

                      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <Avatar
                          size={86}
                          src={member.avatar_url || undefined}
                          icon={!member.avatar_url && <UserOutlined />}
                          className="border-4 border-white bg-slate-100 text-xl font-semibold text-slate-500 shadow-lg"
                        >
                          {!member.avatar_url && getInitials(member.fullname)}
                        </Avatar>
                      </div>
                    </div>

                    <div className="h-8" />

                    {/* Member info */}
                    <div className="text-center">
                      <Title
                        level={4}
                        className="mb-1! text-base! font-semibold! text-slate-800!"
                      >
                        {member.fullname}
                      </Title>

                      {member.graduate_level && (
                        <Tag
                          color={getGraduateLevelColor(member.graduate_level)}
                          className="rounded-full! px-3! text-[11px]!"
                        >
                          {formatGraduateLevel(member.graduate_level)}
                        </Tag>
                      )}

                      <Divider className="my-4!" />

                      <div className="mb-3 flex items-start gap-2 text-left">
                        <BankOutlined className="mt-1 shrink-0 text-amber-500" />
                        <Text
                          ellipsis={{ tooltip: member.university }}
                          className="text-xs! text-slate-500!"
                        >
                          {member.university || "—"}
                        </Text>
                      </div>

                      <div className="flex items-start gap-2 text-left">
                        <FaGraduationCap className="mt-1 shrink-0 text-amber-500" />
                        <Text
                          ellipsis={{ tooltip: member.course }}
                          className="text-xs! text-slate-500!"
                        >
                          {member.course || "—"}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          /* Empty state */
          <motion.div
            variants={fadeUp}
            className="rounded-2xl bg-white py-20 text-center shadow-sm"
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text className="block text-sm! font-medium! text-slate-700!">
                    No members found
                  </Text>
                  <Text className="text-xs! text-slate-400!">
                    Try adjusting your search or filters.
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                icon={<ClearOutlined />}
                onClick={clearFilters}
                className="mt-2! rounded-lg! bg-slate-900!"
              >
                Clear Filters
              </Button>
            </Empty>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default MembersSection;