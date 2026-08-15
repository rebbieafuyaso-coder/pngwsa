import { Card, Typography, Button, Space, } from "antd";
import { 
  FaHome, 
  FaArrowLeft, 
  FaSearch, 
  FaEnvelope,
  FaQuestionCircle,
  FaRocket,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

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

  const quickLinks = [
    { label: "Home", path: "/", icon: FaHome },
    { label: "About", path: "/about", icon: FaQuestionCircle },
    { label: "Members", path: "/members", icon: FaSearch },
    { label: "Contact", path: "/contact", icon: FaEnvelope },
  ];

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 bg-linear-to-br from-gray-50 to-gray-100">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Card 
          className="border-0 shadow-2xl rounded-2xl overflow-hidden"
          styles={{
            body: { padding: 40 }
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Content */}
            <motion.div variants={fadeUp} className="order-2 md:order-1">
              {/* Error Code */}
              <div className="mb-2">
                <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold">
                  404 Error
                </span>
              </div>

              <Title 
                level={1} 
                className="font-bold text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                404
              </Title>

              <Title 
                level={3} 
                className="text-amber-500 font-semibold mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Oops! Page Not Found
              </Title>

              <Paragraph className="text-gray-600 text-base leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
                It might have been removed, renamed, or temporarily unavailable.
              </Paragraph>

              {/* Search path display */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaSearch className="text-amber-400" />
                  <span className="font-mono">
                    {window.location.pathname}
                  </span>
                  <span className="text-red-400 text-xs font-semibold ml-auto">
                    Not Found
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <Space wrap className="mt-2">
                <Button
                  type="primary"
                  icon={<FaHome />}
                  className="bg-amber-500 hover:bg-amber-600 border-none rounded-lg h-10 font-medium"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>

                <Button
                  icon={<FaArrowLeft />}
                  className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg h-10 font-medium"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </Space>

              {/* Quick Links */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
                  Quick Links
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        to={link.path}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-amber-50 rounded-lg text-sm text-gray-600 hover:text-amber-600 transition-all duration-200"
                      >
                        <Icon className="text-amber-400 text-xs" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div 
              variants={fadeUp} 
              className="order-1 md:order-2 flex flex-col items-center justify-center"
            >
              <motion.div
                animate={floatingAnimation}
                className="relative"
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-2xl scale-150" />
                
                {/* 404 Text Graphic */}
                <div className="relative">
                  <div className="text-8xl md:text-9xl font-black text-gray-900 opacity-5 select-none">
                    404
                  </div>
                  
                  {/* Main Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-linear-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl">
                      <FaRocket className="text-5xl text-white" />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-400/20 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-amber-400/20 rounded-full animate-pulse delay-700" />
                  <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-400/20 rounded-full animate-pulse delay-500" />
                </div>
              </motion.div>

              {/* Subtitle below graphic */}
              <motion.p 
                variants={fadeUp}
                className="text-center text-gray-400 text-sm mt-4 font-light"
              >
                It seems you've taken a wrong turn
              </motion.p>
            </motion.div>
          </div>
        </Card>

        {/* Footer note */}
        <motion.div 
          variants={fadeUp}
          className="text-center mt-6 text-xs text-gray-400"
        >
          <p>
            Need help? <a href="/contact" className="text-amber-500 hover:text-amber-600 hover:underline">Contact Support</a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default NotFound;