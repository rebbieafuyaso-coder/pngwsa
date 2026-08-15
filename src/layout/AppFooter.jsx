import { Col, Layout, Row, Button, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaArrowRight,
  FaGraduationCap,
  FaShieldAlt,
  FaHeart,
} from 'react-icons/fa';
import { useState } from 'react';

const { Footer } = Layout;

export default function AppFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      message.success('Successfully subscribed to our newsletter!');
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } else {
      message.warning('Please enter your email address.');
    }
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', url: '#', color: '#1877F2' },
    { icon: FaTwitter, label: 'Twitter', url: '#', color: '#000000' },
    { icon: FaInstagram, label: 'Instagram', url: '#', color: '#E4405F' },
    { icon: FaLinkedin, label: 'LinkedIn', url: '#', color: '#0A66C2' },
    { icon: FaYoutube, label: 'YouTube', url: '#', color: '#FF0000' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Members', path: '/members' },
    { label: 'News & Events', path: '/news-events' },
    { label: 'Contact', path: '/contact' },
  ];

  const memberLinks = [
    { label: 'Member Login', path: '/coming-soon' },
    { label: 'Sign Up', path: '/coming-soon' },
    { label: 'Retrieve Account', path: '/coming-soon' },
  ];

  const partnerLinks = [
    { label: 'PNG Embassy China', path: '/coming-soon' },
    { label: 'PNG STEM Program', path: '/coming-soon' },
    { label: 'University Applications', path: '/coming-soon' },
  ];

  return (
    <Footer className="bg-black! p-0! text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Row gutter={[32, 32]} justify="center">
          {/* Column 1: Brand & Description */}
          <Col xs={24} md={8} lg={7}>
            <div className="flex flex-col h-full">
              {/* Logo Area */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/papua-new-guinea-wuhan-students-association-logo.png"
                  alt="PNGWSA Logo"
                  className="w-12 h-12 object-contain bg-white/5 rounded-full p-1"
                />
                <div>
                  <p className="text-white font-bold text-lg leading-tight">
                    Papua New Guinea
                  </p>
                  <p className="text-amber-400 text-sm font-medium">
                    Wuhan Students Association
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Delivering PNG minds to world-class education in China. Building
                bridges between Papua New Guinea and China through education,
                culture, and community.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <FaMapMarkerAlt className="text-amber-400 flex-shrink-0" />
                  <span>Wuhan City, Hubei, China</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FaEnvelope className="text-amber-400 flex-shrink-0" />
                  <a
                    href="mailto:pngwuhanstudentsassociation@gmail.com"
                    className="hover:text-amber-400 transition-colors"
                  >
                    pngwuhanstudentsassociation@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <FaPhone className="text-amber-400 flex-shrink-0" />
                  <a
                    href="tel:+861234567890"
                    className="hover:text-amber-400 transition-colors"
                  >
                    +86 123 4567 890
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{ color: '#9CA3AF' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = social.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                      aria-label={social.label}
                    >
                      <Icon className="text-lg" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col xs={12} sm={8} md={4} lg={4}>
            <div className="h-full">
              <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4 relative">
                Quick Links
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-400 mt-1" />
              </p>
              <div className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </Col>

          {/* Column 3: Member Portal */}
          <Col xs={12} sm={8} md={4} lg={4}>
            <div className="h-full">
              <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4 relative">
                Member Portal
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-400 mt-1" />
              </p>
              <div className="flex flex-col gap-2">
                {memberLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </Col>

          {/* Column 4: Partners & Affiliates */}
          <Col xs={12} sm={8} md={4} lg={4}>
            <div className="h-full">
              <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4 relative">
                Partners & Affiliates
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-400 mt-1" />
              </p>
              <div className="flex flex-col gap-2">
                {partnerLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-amber-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </Col>

          {/* Column 5: Newsletter */}
          <Col xs={24} md={8} lg={5}>
            <div className="h-full">
              <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4 relative">
                Stay Connected
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-400 mt-1" />
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for updates on events, news, and
                opportunities.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-l-lg rounded-r-none border-gray-700 bg-white/5 text-white placeholder-gray-500 hover:bg-white/10 focus:bg-white/10 focus:border-amber-400"
                    required
                  />
                  <Button
                    htmlType="submit"
                    className="rounded-l-none rounded-r-lg bg-amber-500 hover:bg-amber-600 border-none text-white px-4"
                  >
                    <FaArrowRight />
                  </Button>
                </div>
                {subscribed && (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    ✓ Successfully subscribed!
                  </p>
                )}
              </form>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaShieldAlt className="text-amber-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaHeart className="text-amber-400" />
                  <span>Community</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaGraduationCap className="text-amber-400" />
                  <span>Education</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={12} className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                &copy; {currentYear} Papua New Guinea Wuhan Students Association.
                All rights reserved.
              </p>
            </Col>
            <Col xs={24} md={12} className="text-center md:text-right">
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
                <Link to="/coming-soon" className="text-gray-500 hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/coming-soon" className="text-gray-500 hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/coming-soon" className="text-gray-500 hover:text-amber-400 transition-colors">
                  Cookie Policy
                </Link>
                <span className="text-gray-600">|</span>
                <span className="text-gray-500 flex items-center gap-1">
                  <FaHeart className="text-amber-400 text-xs" />
                  Made with passion by{' '}
                  <a
                    href="#"
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Rebbie Afuyaso
                  </a>
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
        aria-label="Scroll to top"
      >
        <FaArrowRight className="transform rotate-[-90deg]" />
      </button>

      <style jsx global>{`
        /* Footer styles */
        .ant-layout-footer {
          background: #000000;
          padding: 0;
        }

        /* Input styling for newsletter */
        .ant-input-affix-wrapper {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .ant-input-affix-wrapper:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(251, 191, 36, 0.3) !important;
        }

        .ant-input-affix-wrapper-focused {
          border-color: #F59E0B !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
        }

        .ant-input {
          background: transparent !important;
          color: #D1D5DB !important;
        }

        .ant-input::placeholder {
          color: #6B7280 !important;
        }

        /* Smooth hover transitions */
        .footer-link {
          position: relative;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #F59E0B;
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        /* Scroll to top button animation */
        @keyframes bounce-up {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .scroll-top-btn {
          animation: bounce-up 2s ease-in-out infinite;
        }
      `}</style>
    </Footer>
  );
}