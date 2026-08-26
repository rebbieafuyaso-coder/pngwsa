import { useMemo, useState } from "react";

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
  Badge,
  Button,
  Statistic,
  Divider,
  Tooltip,
} from "antd";

import {
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  BankOutlined,
  LinkedinOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  TeamOutlined,
  ClearOutlined,
} from "@ant-design/icons";

import { motion } from "framer-motion";
import { FaGraduationCap, FaUsers, FaUniversity, FaLinkedin } from "react-icons/fa";

import { MemberProfiles } from "../data/MemberProfiles";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

const getUniqueUniversities = () => {
  const universities = MemberProfiles.map(
    (member) => member.university
  );

  return ["All", ...new Set(universities)];
};

const getUniqueGraduateLevels = () => {
  const levels = MemberProfiles.map(
    (member) => member.graduateLevel
  );

  return ["All", ...new Set(levels)];
};

const getGraduateLevelColor = (level) => {
  const colors = {
    Undergraduate: "blue",
    "Graduate / Master's": "green",
    "PhD / Doctorate": "purple",
    Postdoctoral: "magenta",
    "Professional / Working": "orange",
  };

  return colors[level] || "default";
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/* =========================================================
   COMPONENT
========================================================= */

const MembersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("All");
  const [filterGraduateLevel, setFilterGraduateLevel] =
    useState("All");

  const [sortBy, setSortBy] = useState("name");

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredMembers = useMemo(() => {
    let filtered = [...MemberProfiles];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((member) => {
        return (
          member.fullname?.toLowerCase().includes(term) ||
          member.university?.toLowerCase().includes(term) ||
          member.major?.toLowerCase().includes(term) ||
          member.graduateLevel?.toLowerCase().includes(term)
        );
      });
    }

    if (filterUniversity !== "All") {
      filtered = filtered.filter(
        (member) =>
          member.university === filterUniversity
      );
    }

    if (filterGraduateLevel !== "All") {
      filtered = filtered.filter(
        (member) =>
          member.graduateLevel === filterGraduateLevel
      );
    }

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) =>
          a.fullname.localeCompare(b.fullname)
        );
        break;

      case "name-desc":
        filtered.sort((a, b) =>
          b.fullname.localeCompare(a.fullname)
        );
        break;

      case "university":
        filtered.sort((a, b) =>
          a.university.localeCompare(b.university)
        );
        break;

      case "graduateLevel":
        filtered.sort((a, b) =>
          a.graduateLevel.localeCompare(
            b.graduateLevel
          )
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
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

      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1,
        }}
        className="relative z-10 mx-auto max-w-7xl"
      >

        {/* ===================================================
            HERO
        =================================================== */}

        <motion.div
          variants={fadeUp}
          className="mx-auto mb-12 max-w-3xl text-center"
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
            }}
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
            Meet the people who make our community
            special. Explore members by university,
            academic level, field of study, and more.
          </Paragraph>
        </motion.div>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <motion.div
          variants={fadeUp}
          className="mb-8"
        >
          <Row gutter={[16, 16]}>

            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="rounded-2xl shadow-sm"
              >
                <Statistic
                  title={
                    <span className="text-sm text-slate-500">
                      Total Members
                    </span>
                  }
                  value={MemberProfiles.length}
                  prefix={
                    <TeamOutlined className="text-amber-500" />
                  }
                />
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="rounded-2xl shadow-sm"
              >
                <Statistic
                  title={
                    <span className="text-sm text-slate-500">
                      Universities
                    </span>
                  }
                  value={
                    getUniqueUniversities().length - 1
                  }
                  prefix={
                    <BankOutlined className="text-amber-500" />
                  }
                />
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="rounded-2xl shadow-sm"
              >
                <Statistic
                  title={
                    <span className="text-sm text-slate-500">
                      Academic Levels
                    </span>
                  }
                  value={
                    getUniqueGraduateLevels().length - 1
                  }
                  prefix={
                    <FaGraduationCap className="text-amber-500" />
                  }
                />
              </Card>
            </Col>

          </Row>
        </motion.div>

        {/* ===================================================
            SEARCH / FILTER PANEL
        =================================================== */}

        <motion.div
          variants={fadeUp}
          className="mb-8"
        >
          <Card
            bordered={false}
            className="overflow-hidden rounded-2xl shadow-sm"
          >

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

              {/* SEARCH */}

              <Col xs={24} lg={8}>
                <Input
                  placeholder="Search members..."
                  prefix={
                    <SearchOutlined className="text-slate-400" />
                  }
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  allowClear
                  size="middle"
                  className="text-sm!"
                />
              </Col>

              {/* UNIVERSITY */}

              <Col xs={12} sm={8} lg={5}>
                <Select
                  value={filterUniversity}
                  onChange={setFilterUniversity}
                  size="middle"
                  className="w-full text-sm!"
                  suffixIcon={
                    <BankOutlined className="text-slate-400" />
                  }
                  dropdownStyle={{
                    fontSize: "13px",
                  }}
                >
                  {getUniqueUniversities().map(
                    (university) => (
                      <Option
                        key={university}
                        value={university}
                      >
                        <span className="text-sm">
                          {university}
                        </span>
                      </Option>
                    )
                  )}
                </Select>
              </Col>

              {/* GRADUATE LEVEL */}

              <Col xs={12} sm={8} lg={5}>
                <Select
                  value={filterGraduateLevel}
                  onChange={setFilterGraduateLevel}
                  size="middle"
                  className="w-full text-sm!"
                  suffixIcon={
                    <FaGraduationCap className="text-slate-400" />
                  }
                >
                  {getUniqueGraduateLevels().map(
                    (level) => (
                      <Option
                        key={level}
                        value={level}
                      >
                        <span className="text-sm">
                          {level}
                        </span>
                      </Option>
                    )
                  )}
                </Select>
              </Col>

              {/* SORT */}

              <Col xs={12} sm={8} lg={4}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  size="middle"
                  className="w-full text-sm!"
                  suffixIcon={
                    <SortAscendingOutlined className="text-slate-400" />
                  }
                >
                  <Option value="name">
                    <span className="text-sm">
                      Name (A-Z)
                    </span>
                  </Option>

                  <Option value="name-desc">
                    <span className="text-sm">
                      Name (Z-A)
                    </span>
                  </Option>

                  <Option value="university">
                    <span className="text-sm">
                      University
                    </span>
                  </Option>

                  <Option value="graduateLevel">
                    <span className="text-sm">
                      Graduate Level
                    </span>
                  </Option>
                </Select>
              </Col>

            </Row>
          </Card>
        </motion.div>

        {/* ===================================================
            RESULTS HEADER
        =================================================== */}

        <motion.div
          variants={fadeUp}
          className="mb-5 flex items-center justify-between"
        >
          <div>
            <Text className="text-sm! font-medium! text-slate-700!">
              {filteredMembers.length}{" "}
              {filteredMembers.length === 1
                ? "member"
                : "members"}
            </Text>
            <Text className="ml-1! text-xs! text-slate-400!">
              found
            </Text>
          </div>

          {hasFilters && (
            <Tag
              icon={<FilterOutlined />}
              color="orange"
              className="rounded-full! text-xs!"
            >
              Filters active
            </Tag>
          )}

        </motion.div>

        {/* ===================================================
            MEMBER CARDS
        =================================================== */}

        {filteredMembers.length > 0 ? (

          <Row gutter={[20, 20]}>

            {filteredMembers.map((member, index) => (

              <Col
                xs={24}
                sm={12}
                lg={8}
                xl={6}
                key={
                  member.id ||
                  member.email ||
                  index
                }
              >

                <motion.div
                  variants={cardAnimation}
                  whileHover={{
                    y: -8,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="h-full"
                >

                  <Card
                    bordered={false}
                    className="group h-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl"
                    bodyStyle={{
                      padding: "20px",
                    }}
                    actions={[
                      <Tooltip
                        title="View LinkedIn profile"
                        key="linkedin"
                      >
                        <Button
                          type="text"
                          href={
                            member.linkedIn
                              ? `https://linkedin.com/in/${member.linkedIn}`
                              : undefined
                          }
                          target="_blank"
                          disabled={!member.linkedIn}
                          icon={
                            <FaLinkedin />
                          }
                          className="text-xs! text-slate-500! hover:text-blue-600!"
                        >
                          LinkedIn
                        </Button>
                      </Tooltip>,
                    ]}
                  >

                    {/* =======================================
                        AVATAR HEADER
                    ======================================= */}

                    <div className="relative -mx-5 -mt-5 mb-5 overflow-hidden">

                      <div className="relative h-28 bg-linear-to-br from-amber-100 via-orange-50 to-white">

                        {/* Decorative circles */}

                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-orange-200/50"
                        />

                        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-amber-200/20" />

                      </div>

                      {/* Avatar */}
                      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
                          <Avatar
                            size={86}
                            src={member.profile}
                            icon={
                              !member.profile && (
                                <UserOutlined />
                              )
                            }
                            className="border-4 border-white bg-slate-100 text-xl font-semibold text-slate-500 shadow-lg"
                          >
                            {!member.profile &&
                              getInitials(
                                member.fullname
                              )}
                          </Avatar>
                      </div>

                    </div>

                    {/* Spacer for avatar */}

                    <div className="h-8" />

                    {/* =======================================
                        MEMBER INFO
                    ======================================= */}

                    <div className="text-center">

                      <Title
                        level={4}
                        className="mb-1! text-base! font-semibold! text-slate-800!"
                      >
                        {member.fullname}
                      </Title>

                      <Tag
                        color={getGraduateLevelColor(
                          member.graduateLevel
                        )}
                        className="rounded-full! px-3! text-[11px]!"
                      >
                        {member.graduateLevel}
                      </Tag>

                      <Divider className="my-4!" />

                      {/* University */}

                      <div className="mb-3 flex items-start gap-2 text-left">

                        <BankOutlined className="mt-1 shrink-0 text-amber-500" />

                        <Text
                          ellipsis={{
                            tooltip:
                              member.university,
                          }}
                          className="text-xs! text-slate-500!"
                        >
                          {member.university}
                        </Text>

                      </div>

                      {/* Major */}

                      <div className="flex items-start gap-2 text-left">

                        <FaGraduationCap className="mt-1 shrink-0 text-amber-500" />

                        <Text
                          ellipsis={{
                            tooltip:
                              member.major,
                          }}
                          className="text-xs! text-slate-500!"
                        >
                          {member.major}
                        </Text>

                      </div>

                    </div>

                  </Card>

                </motion.div>

              </Col>

            ))}

          </Row>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

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