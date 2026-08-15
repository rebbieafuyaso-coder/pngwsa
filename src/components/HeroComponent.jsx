import { Col, Row } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaChevronDown,
  FaCalendarAlt,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";

const HeroComponent = ({ 
  imgSource, 
  imgAlt, 
  title, 
  smallTitle, 
  text,
  buttonText,
  buttonAction,
  stats = [],
  overlayOpacity = 0.85,
  titleColor = "text-amber-400",
  textColor = "text-gray-200",
}) => {
  const navigate = useNavigate();

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: "easeOut" } 
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const handleButtonClick = () => {
    if (typeof buttonAction === 'string') {
      navigate(buttonAction);
    } else if (typeof buttonAction === 'function') {
      buttonAction();
    }
  };

  return (
    <div className="min-h-[80vh] overflow-hidden relative bg-transparent text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={imgSource} 
          alt={imgAlt} 
          className="w-full h-full object-cover" 
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              rgba(0,0,0,${overlayOpacity}) 0%, 
              rgba(0,0,0,${overlayOpacity * 0.8}) 40%, 
              rgba(0,0,0,${overlayOpacity * 0.4}) 100%
            )`
          }}
        />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-amber-400/5 blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Content */}
      <Row 
        gutter={16}
        justify="center"
        align="middle"
        className="min-h-[80vh] relative z-10"
      >
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="px-4 md:px-0"
          >
            {/* Small Title / Badge */}
            {smallTitle && (
              <motion.div variants={fadeUp} className="mb-4">
                <span className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-amber-300 text-xs uppercase tracking-wider font-semibold border border-amber-400/20">
                  <FaCalendarAlt className="text-amber-400 text-xs" />
                  {smallTitle}
                </span>
              </motion.div>
            )}

            {/* Main Title */}
            {title && (
              <motion.h1 
                variants={fadeUp}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${titleColor}`}
              >
                {title}
              </motion.h1>
            )}

            {/* Description Text */}
            {text && (
              <motion.p 
                variants={fadeUp}
                className={`text-base md:text-lg mt-4 leading-relaxed ${textColor}`}
              >
                {text}
              </motion.p>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <motion.div 
                variants={fadeUp}
                className="flex flex-wrap gap-6 md:gap-8 mt-6 pt-6 border-t border-white/10"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      {Icon && <Icon className="text-amber-400 text-lg" />}
                      <div>
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* CTA Button */}
            {buttonText && (
              <motion.div variants={fadeUp} className="mt-6">
                <button
                  onClick={handleButtonClick}
                  className="group relative px-8 py-3.5 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                    color: "#1a1a2e",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {buttonText}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="text-sm" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>
              </motion.div>
            )}

            {/* Trust Badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-6">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FaUsers className="text-amber-400" />
                Trusted by 100+ students
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FaGraduationCap className="text-amber-400" />
                10+ partner universities
              </span>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Scroll</span>
          <FaChevronDown className="text-gray-400 text-sm" />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroComponent;