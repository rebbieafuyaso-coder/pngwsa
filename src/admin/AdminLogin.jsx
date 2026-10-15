import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, Input, Button, Typography, message, Checkbox } from "antd";
import {
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet-async";

const { Title, Text, Paragraph } = Typography;

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error) throw error;

      message.success("Welcome back, admin");
      navigate("/admin/dashboard");
    } catch (err) {
      message.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PNG HSA | Admin Login</title>
        <meta name="description" content="Log in as admin for PNGHSA." />
      </Helmet>
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-amber-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-orange-500/10 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* =====================================================
          CARD
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/40 md:grid-cols-2"
      >
        {/* =================================================
            LEFT BRAND PANEL
        ================================================= */}

        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-amber-500 via-orange-500 to-orange-600 p-8 text-white md:flex">
          {/* Decorative circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/15"
          />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <motion.div variants={stagger} initial="hidden" animate="visible" className="relative">
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <img
                src="/papua-new-guinea-wuhan-students-association-logo.png"
                alt="PNG HSA"
                className="h-11 w-11 rounded-full border-2 border-white/70 bg-white object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div>
                <div className="text-sm font-semibold tracking-wide">PNG HSA</div>
                <div className="text-[11px] text-white/70">Admin Portal</div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12">
              <Title level={2} className="text-white! mb-3! font-semibold!">
                Welcome back.
              </Title>
              <Paragraph className="text-white/80! max-w-xs leading-relaxed">
                Manage events, blogs, alumni, and gallery content from one
                clean dashboard.
              </Paragraph>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative flex items-center gap-2 text-xs text-white/70"
          >
            <SafetyCertificateOutlined />
            <span>Secure, encrypted session</span>
          </motion.div>
        </div>

        {/* =================================================
            RIGHT FORM PANEL
        ================================================= */}

        <div className="relative flex flex-col justify-center bg-white p-8 sm:p-10">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25 md:hidden">
                <SafetyCertificateOutlined style={{ fontSize: 22 }} />
              </div>
              <Title level={3} className="mb-1! font-semibold!">
                Sign in
              </Title>
              <Text type="secondary" className="text-sm!">
                Enter your credentials to continue
              </Text>
            </motion.div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              requiredMark={false}
              size="large"
              autoComplete="off"
            >
              <motion.div variants={fadeUp}>
                <Form.Item
                  label={<span className="text-xs font-medium text-slate-600">Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-slate-400" />}
                    placeholder="admin@example.com"
                    className="rounded-lg! border-slate-200! py-2.5! hover:border-orange-400! focus:border-orange-500!"
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Form.Item
                  label={<span className="text-xs font-medium text-slate-600">Password</span>}
                  name="password"
                  rules={[{ required: true, message: "Please enter your password" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400" />}
                    placeholder="••••••••"
                    className="rounded-lg! border-slate-200! py-2.5! hover:border-orange-400! focus:border-orange-500!"
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-xs! text-slate-600!">
                    Keep me signed in
                  </Checkbox>
                </Form.Item>
                <span className="cursor-default text-xs text-slate-400">
                  Forgot password?
                </span>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  icon={!loading && <ArrowRightOutlined />}
                  iconPosition="end"
                  className="h-12! rounded-lg! border-none! bg-linear-to-r! from-amber-500! to-orange-500! text-sm! font-semibold! tracking-wide! shadow-lg! shadow-orange-500/25! hover:from-amber-400! hover:to-orange-400!"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </Form>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] uppercase tracking-widest text-slate-400">
                Restricted
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-center text-[11px] leading-relaxed text-slate-400"
            >
              Access is limited to authorized personnel. All activity is
              logged for security purposes.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>      
    </>
  );
};

export default AdminLogin;