import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from 'antd';
import { 
  HomeOutlined, 
  InfoCircleOutlined, 
  PhoneOutlined, 
  TeamOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  const navLinks = [
    {
      key: 1,
      icon: <HomeOutlined />,
      name: "Home",
      path: "/",
    },
    {
      key: 2,
      icon: <InfoCircleOutlined />,
      name: "About",
      path: "/about",
    },
    {
      key: 3,
      icon: <TeamOutlined />,
      name: "Members",
      path: "/members",
    },
    {
      key: 5,
      icon: <PhoneOutlined />,
      name: "Contact Us",
      path: "/contact",
    },
  ];

  return (
    <Header className={`flex! bg-black! justify-center w-full sticky top-0 z-50 h-25! transition-transform duration-300 ${ showNav ? "translate-y-0" : "-translate-y-full"}`} >
      <nav className="min-w-[90%]! flex gap-4 justify-between items-center">
        {/* Logo */}
        <div className="flex items-center font-sans gap-3">
          <img 
            src="/papua-new-guinea-wuhan-students-association-logo.png" 
            alt="PNGWSA Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <p className="text-base font-semibold text-white">Papua New Guinea</p>
            <p className="text-xs text-gray-400">Wuhan Students Association</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              className="text-white! decoration-none text-sm hover:text-yellow-400 transition duration-300 flex items-center gap-2"
              key={link.key} 
              to={link.path}
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </nav>

      {/* Mobile Menu - Minimal dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-t border-white/10">
          <div className="flex flex-col p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all duration-200 text-sm"
              >
                <span className="text-yellow-400">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Header>
  );
};

export default AppHeader;