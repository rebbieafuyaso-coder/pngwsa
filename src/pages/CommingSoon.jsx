import { Button, Col, Form, Input, Row, Card, Typography, message, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { 
  FaArrowDown, 
  FaRocket, 
  FaEnvelope, 
  FaCheckCircle,
  FaTools,
  FaBell,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const CommingSoon = () => {
  const [form] = useForm();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success("You've been subscribed! We'll notify you when this feature launches.");
      setSubscribed(true);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const features = [
    "Enhanced user experience",
    "New features & tools",
    "Faster performance",
    "Mobile-optimized design",
  ];

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
          <Row gutter={[40, 40]} align="middle" justify="center">
            {/* Left Column - Visual */}
            <Col xs={24} md={10} className="text-center">
              <motion.div
                animate={floatingAnimation}
                className="relative inline-block"
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-2xl scale-150" />
                
                {/* Main Icon */}
                <div className="relative w-40 h-40 mx-auto bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                  <FaTools className="text-6xl text-white" />
                </div>

                {/* Decorative dots */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-6 h-6 bg-blue-400/30 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-400/30 rounded-full"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute top-1/2 -right-6 w-4 h-4 bg-green-400/30 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
                />
              </motion.div>

              {/* Features */}
              <motion.div variants={fadeUp} className="mt-6">
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600"
                    >
                      <FaCheckCircle className="text-amber-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            </Col>

            {/* Right Column - Content */}
            <Col xs={24} md={14}>
              <motion.div variants={fadeUp}>
                {/* Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                    <FaClock className="text-amber-500" />
                    Under Development
                  </span>
                </div>

                <Title 
                  level={1} 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
                >
                  Coming <span className="text-amber-500">Soon!</span>
                </Title>

                <Paragraph className="text-gray-600 text-base leading-relaxed">
                  This feature is currently under development and will be available 
                  soon. We're working hard to bring you an amazing experience.
                </Paragraph>

                {/* Notification Form */}
                <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FaBell className="text-amber-500" />
                    <Text className="font-medium text-gray-700">
                      Get notified when we launch
                    </Text>
                  </div>

                  {subscribed ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-2" />
                      <Text className="font-semibold text-green-700 block">
                        You're subscribed!
                      </Text>
                      <Text className="text-sm text-green-600">
                        We'll notify you as soon as this feature goes live.
                      </Text>
                    </div>
                  ) : (
                    <Form
                      form={form}
                      onFinish={handleSubscribe}
                      layout="vertical"
                    >
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: "Please enter your email" },
                          { type: "email", message: "Please enter a valid email" }
                        ]}
                        className="mb-3"
                      >
                        <Input
                          size="large"
                          prefix={<FaEnvelope className="text-gray-400" />}
                          placeholder="Enter your email address"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className="w-full bg-amber-500 hover:bg-amber-600 border-none rounded-lg font-medium"
                      >
                        <FaArrowRight className="mr-2" />
                        Notify Me
                      </Button>
                    </Form>
                  )}
                </div>

                {/* Back to Home */}
                <div className="mt-4 text-center">
                  <Link 
                    to="/" 
                    className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Card>

        {/* Footer */}
        <motion.div 
          variants={fadeUp}
          className="text-center mt-6 text-xs text-gray-400"
        >
          <p>We're working hard to bring you something amazing. Stay tuned!</p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default CommingSoon;