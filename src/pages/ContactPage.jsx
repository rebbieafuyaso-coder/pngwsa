import { Helmet } from "react-helmet-async";
import { Card, Col, Row, Form, Input, Button, message, Typography, Divider, Avatar, Space, Descriptions } from "antd";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaLinkedin, 
  FaFacebook, 
  FaYoutube,
  FaUser,
  FaComment,
  FaArrowRight,
  FaGlobe,
  FaWhatsapp,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success("Message sent successfully! We'll get back to you soon.");
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | PNG WSA</title>
        <meta 
          name="description" 
          content="Get in touch with Papua New Guinea Wuhan Students Association. Reach out for inquiries, collaborations, or support." 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h6 className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
              Get in Touch
            </h6>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Contact <span className="text-amber-500">PNGWSA</span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Have questions, feedback, or want to collaborate? We'd love to hear from you.
            </p>
          </motion.div>

          <Row gutter={[32, 32]}>
            {/* Left Column - Contact Form */}
            <Col xs={24} lg={14}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <Card className="shadow-lg rounded-xl border-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Send Us a Message
                  </h2>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-2"
                  >
                    <Row gutter={[16, 0]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="name"
                          label="Your Name"
                          rules={[{ required: true, message: "Please enter your name" }]}
                        >
                          <Input 
                            prefix={<FaUser className="text-gray-400" />} 
                            placeholder="John Doe" 
                            className="rounded-lg"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="email"
                          label="Email Address"
                          rules={[
                            { required: true, message: "Please enter your email" },
                            { type: "email", message: "Please enter a valid email" }
                          ]}
                        >
                          <Input 
                            prefix={<FaEnvelope className="text-gray-400" />} 
                            placeholder="john@example.com" 
                            className="rounded-lg"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="subject"
                      label="Subject"
                      rules={[{ required: true, message: "Please enter a subject" }]}
                    >
                      <Input 
                        placeholder="How can we help?" 
                        className="rounded-lg"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="message"
                      label="Message"
                      rules={[{ required: true, message: "Please enter your message" }]}
                    >
                      <TextArea 
                        rows={6} 
                        placeholder="Write your message here..." 
                        className="rounded-lg resize-none"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className="w-full bg-amber-500 hover:bg-amber-600 border-none rounded-lg font-medium"
                      >
                        <FaEnvelope className="mr-2" />
                        Send Message
                        <FaArrowRight className="ml-2" />
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </motion.div>
            </Col>

            {/* Right Column - Contact Info + Developer */}
            <Col xs={24} lg={10}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Contact Information */}
                <Card className="shadow-lg rounded-xl border-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-amber-500" />
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-700 block">Address</Text>
                        <Text className="text-gray-500 text-sm">Wuhan City, Hubei, China</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <FaEnvelope className="text-amber-500" />
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-700 block">Email</Text>
                        <a href="mailto:pngwuhanstudentsassociation@gmail.com" className="text-amber-500 text-sm hover:underline">
                          pngwuhanstudentsassociation@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-amber-500" />
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-700 block">Phone</Text>
                        <a href="tel:+861234567890" className="text-gray-500 text-sm hover:text-amber-500 transition-colors">
                          +86 123 4567 890
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <FaClock className="text-amber-500" />
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-700 block">Office Hours</Text>
                        <Text className="text-gray-500 text-sm">Monday - Friday: 9:00 AM - 5:00 PM</Text>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Developer Spotlight Card */}
                <Card className="shadow-lg rounded-xl border-0 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100/50">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Avatar
                        size={80}
                        className="border-4 border-white shadow-xl"
                        style={{ backgroundColor: '#D97706' }}
                      >
                        <span className="text-2xl font-bold text-white">RA</span>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mt-3">
                      Rebbie Afuyaso
                    </h3>
                    <Text className="text-amber-600 text-sm font-medium block">
                      Lead Developer &amp; Webmaster
                    </Text>
                    
                    <Divider className="my-3" />
                    
                    <Text className="text-gray-600 text-sm block">
                      Built and maintained this website. For technical issues or 
                      collaboration opportunities, feel free to reach out.
                    </Text>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <a
                        href="mailto:rebbie@pngwsa.com"
                        className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg"
                        aria-label="Email"
                      >
                        <FaEnvelope className="text-sm" />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg"
                        aria-label="WhatsApp"
                      >
                        <FaWhatsapp className="text-sm" />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin className="text-sm" />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-[#24292E] text-white flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg"
                        aria-label="GitHub"
                      >
                        <FaGithub className="text-sm" />
                      </a>
                      <a
                        href="#"
                        className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="text-sm" />
                      </a>
                    </div>

                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <Text className="text-xs text-gray-400 block">
                        <FaGlobe className="inline mr-1" />
                        Available for collaboration &amp; support
                      </Text>
                    </div>
                  </div>
                </Card>

                {/* Social Links */}
                <Card className="shadow-lg rounded-xl border-0">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Follow PNGWSA
                  </h3>
                  <div className="flex justify-center gap-4">
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#0A66C2] transition-all duration-300 hover:scale-110"
                    >
                      <FaLinkedin className="text-2xl" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#1877F2] transition-all duration-300 hover:scale-110"
                    >
                      <FaFacebook className="text-2xl" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF0000] transition-all duration-300 hover:scale-110"
                    >
                      <FaYoutube className="text-2xl" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </main>
    </>
  );
}