import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Button, message, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";

const { Title, Text, Paragraph } = Typography;

/* =========================================================
   SHARED STYLES
========================================================= */

const PANEL_BG = "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)";

const inputClass = "rounded-lg! py-2!";

/* =========================================================
   MAIN COMPONENT
========================================================= */

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // login | signup
  const [step, setStep] = useState("form"); // form | otp | success
  const [loading, setLoading] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      if (error) throw error;

      message.success("Welcome back!");
      // TODO: navigate to dashboard / members page
      window.location.href = "/members";
    } catch (err) {
      message.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SIGNUP (Step 1: create account, triggers confirmation email)
  ========================================================= */

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        options: {
          data: { fullname: values.fullname?.trim() || "" },
          emailRedirectTo: `${window.location.origin}/members`,
        },
      });
      if (error) throw error;

      setSignupEmail(values.email.trim().toLowerCase());
      setStep("otp");
      message.success("Confirmation code sent to your email");
    } catch (err) {
      message.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     OTP VERIFY
  ========================================================= */

  const handleVerify = async () => {
    if (otp.length < 6) {
      message.warning("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: signupEmail,
        token: otp,
        type: "signup",
      });
      if (error) throw error;

      setStep("success");
      message.success("Account verified!");
      setTimeout(() => {
        window.location.href = "/members";
      }, 1500);
    } catch (err) {
      message.error(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword = async () => {
    const email = loginForm.getFieldValue("email");
    if (!email) {
      message.warning("Enter your email first");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      if (error) throw error;
      message.success("Password reset link sent to your email");
    } catch (err) {
      message.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SWITCH MODE
  ========================================================= */

  const switchToSignup = () => {
    setMode("signup");
    setStep("form");
    loginForm.resetFields();
  };

  const switchToLogin = () => {
    setMode("login");
    setStep("form");
    signupForm.resetFields();
    setOtp("");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ minHeight: 600 }}
      >
        {/* =====================================================
            SLIDING INFORMATIONAL PANEL
        ===================================================== */}
        <motion.div
          animate={{ x: mode === "login" ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute top-0 left-0 z-20 hidden h-full w-1/2 flex-col items-center justify-center p-10 text-white md:flex"
          style={{ background: PANEL_BG }}
        >
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <img
                  src="/papua-new-guinea-wuhan-students-association-logo.png"
                  alt="PNG HSA"
                  className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-white/80 bg-white object-cover shadow-xl"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <Title level={2} className="text-white! mb-3!">
                  Welcome Back
                </Title>
                <Paragraph className="text-white/85! max-w-xs mx-auto mb-8">
                  Sign in to access the members directory, events, and
                  community resources.
                </Paragraph>
                <Button
                  size="large"
                  onClick={switchToSignup}
                  icon={<ArrowRightOutlined />}
                  className="border-white! bg-white/10! text-white! hover:bg-white/20! rounded-full! px-6! h-11!"
                >
                  Don't have an account? Sign Up
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="signup-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <img
                  src="/papua-new-guinea-wuhan-students-association-logo.png"
                  alt="PNG HSA"
                  className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-white/80 bg-white object-cover shadow-xl"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <Title level={2} className="text-white! mb-3!">
                  Welcome New Member
                </Title>
                <Paragraph className="text-white/85! max-w-xs mx-auto mb-8">
                  Join the Papua New Guinea Students Association community —
                  connect, collaborate, and grow.
                </Paragraph>
                <Button
                  size="large"
                  onClick={switchToLogin}
                  icon={<ArrowLeftOutlined />}
                  className="border-white! bg-white/10! text-white! hover:bg-white/20! rounded-full! px-6! h-11!"
                >
                  Already a member? Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* =====================================================
            FORM PANEL (Right when login, Left when signup)
        ===================================================== */}
        <motion.div
          animate={{ x: mode === "login" ? "0%" : "-100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute top-0 right-0 z-10 hidden h-full w-1/2 items-center justify-center p-10 md:flex"
        >
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              {/* ---------- LOGIN FORM ---------- */}
              {mode === "login" && (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  <Title level={3} className="mb-1!">
                    Sign In
                  </Title>
                  <Text type="secondary">
                    Welcome back — please enter your details
                  </Text>

                  <Form
                    form={loginForm}
                    layout="vertical"
                    onFinish={handleLogin}
                    className="mt-6"
                    requiredMark={false}
                    size="large"
                  >
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter a valid email" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-slate-400" />}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[{ required: true, message: "Please enter password" }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-slate-400" />}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </Form.Item>

                    <div className="mb-5 flex justify-end">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-orange-600 hover:text-orange-500 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                      className="h-11! rounded-lg! bg-orange-500! hover:bg-orange-400! border-none!"
                    >
                      Sign In
                    </Button>
                  </Form>
                </motion.div>
              )}

              {/* ---------- SIGNUP STEP: FORM ---------- */}
              {mode === "signup" && step === "form" && (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35 }}
                >
                  <Title level={3} className="mb-1!">
                    Create Account
                  </Title>
                  <Text type="secondary">
                    Join the PNG HSA community — it only takes a minute
                  </Text>

                  <Form
                    form={signupForm}
                    layout="vertical"
                    onFinish={handleSignup}
                    className="mt-6"
                    requiredMark={false}
                    size="large"
                  >
                    <Form.Item
                      name="fullname"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter full name" }]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-slate-400" />}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter a valid email" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-slate-400" />}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Please enter password" },
                        { min: 6, message: "Min 6 characters" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-slate-400" />}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirm"
                      label="Confirm Password"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Please confirm password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords don't match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-slate-400" />}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                      className="h-11! rounded-lg! bg-orange-500! hover:bg-orange-400! border-none! mt-2!"
                    >
                      Create Account
                    </Button>
                  </Form>
                </motion.div>
              )}

              {/* ---------- SIGNUP STEP: OTP ---------- */}
              {mode === "signup" && step === "otp" && (
                <motion.div
                  key="signup-otp"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <SafetyCertificateOutlined style={{ fontSize: 24 }} />
                  </div>
                  <Title level={3} className="mb-1!">
                    Verify Your Email
                  </Title>
                  <Text type="secondary">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-slate-700">
                      {signupEmail}
                    </span>
                  </Text>

                  <div className="mt-8">
                    <Input
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="000000"
                      maxLength={6}
                      size="large"
                      className="text-center! tracking-[0.5em]! text-2xl! font-semibold! rounded-lg!"
                    />

                    <Button
                      type="primary"
                      onClick={handleVerify}
                      loading={loading}
                      block
                      size="large"
                      className="mt-6! h-11! rounded-lg! bg-orange-500! hover:bg-orange-400! border-none!"
                    >
                      Verify
                    </Button>

                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="mt-4 text-sm text-slate-500 hover:text-orange-500 hover:underline"
                    >
                      Use a different email
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ---------- SIGNUP STEP: SUCCESS ---------- */}
              {mode === "signup" && step === "success" && (
                <motion.div
                  key="signup-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500"
                  >
                    <SafetyCertificateOutlined style={{ fontSize: 30 }} />
                  </motion.div>
                  <Title level={3} className="mb-2!">
                    You're all set!
                  </Title>
                  <Text type="secondary">
                    Redirecting you to the members area...
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* =====================================================
            MOBILE FALLBACK (no sliding panel)
        ===================================================== */}
        <div className="flex flex-col items-center justify-center p-6 md:hidden">
          <img
            src="/papua-new-guinea-wuhan-students-association-logo.png"
            alt="PNG HSA"
            className="mb-4 h-20 w-20 rounded-full border-4 border-orange-200 bg-white object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
          <Title level={3} className="text-center! mb-4!">
            {mode === "login" ? "Welcome Back" : "Welcome New Member"}
          </Title>

          {mode === "login" ? (
            <Form
              form={loginForm}
              layout="vertical"
              onFinish={handleLogin}
              className="w-full max-w-sm"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="you@example.com"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="••••••••"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="h-11! rounded-lg! bg-orange-500! border-none!"
              >
                Sign In
              </Button>
              <button
                type="button"
                onClick={switchToSignup}
                className="mt-4 w-full text-center text-sm text-orange-600 hover:underline"
              >
                Don't have an account? Sign Up
              </button>
            </Form>
          ) : (
            <div className="w-full max-w-sm">
              {step === "form" && (
                <Form
                  form={signupForm}
                  layout="vertical"
                  onFinish={handleSignup}
                  requiredMark={false}
                  size="large"
                >
                  <Form.Item
                    name="fullname"
                    rules={[{ required: true, message: "Please enter name" }]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-slate-400" />}
                      placeholder="Full name"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please enter email" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-slate-400" />}
                      placeholder="you@example.com"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please enter password" },
                      { min: 6, message: "Min 6 characters" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-slate-400" />}
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    dependencies={["password"]}
                    rules={[
                      { required: true, message: "Confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value)
                            return Promise.resolve();
                          return Promise.reject(
                            new Error("Passwords don't match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-slate-400" />}
                      placeholder="Confirm password"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    className="h-11! rounded-lg! bg-orange-500! border-none!"
                  >
                    Create Account
                  </Button>
                </Form>
              )}

              {step === "otp" && (
                <div className="text-center">
                  <Title level={4}>Verify Email</Title>
                  <Text type="secondary">Code sent to {signupEmail}</Text>
                  <Input
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    maxLength={6}
                    size="large"
                    className="mt-4! text-center! tracking-[0.5em]! text-2xl!"
                  />
                  <Button
                    type="primary"
                    onClick={handleVerify}
                    loading={loading}
                    block
                    size="large"
                    className="mt-4! h-11! rounded-lg! bg-orange-500! border-none!"
                  >
                    Verify
                  </Button>
                </div>
              )}

              {step === "success" && (
                <div className="text-center">
                  <Title level={4}>You're all set!</Title>
                  <Text type="secondary">Redirecting...</Text>
                </div>
              )}

              <button
                type="button"
                onClick={switchToLogin}
                className="mt-4 w-full text-center text-sm text-orange-600 hover:underline"
              >
                Already a member? Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;