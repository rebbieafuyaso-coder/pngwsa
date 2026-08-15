import { Avatar, Card, Space, Tag } from "antd";
import { 
  FaSchool, 
  FaEnvelope, 
  FaPhone, 
  FaLinkedin, 
  FaTwitter,
  FaBriefcase,
} from "react-icons/fa";

const ExecutiveCards = ({ 
  profilePic, 
  name, 
  school, 
  position, 
  email,
  phone,
  linkedIn,
  twitter,
  featured = false,
}) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determine badge color based on position
  const getPositionColor = (pos) => {
    const colors = {
      'President': 'gold',
      'Vice President': 'blue',
      'Secretary': 'purple',
      'Treasurer': 'green',
      'Executive': 'cyan',
    };
    return colors[pos] || 'default';
  };

  return (
    <Card
      hoverable
      className="executive-card h-full relative transition-all duration-300 hover:shadow-xl group"
      style={{
        background: '#FFFFFF',
        borderColor: featured ? '#F59E0B' : '#E5E7EB',
        borderTopWidth: featured ? '4px' : '1px',
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <Tag color="gold" className="font-medium px-2 py-0.5 text-xs">
            Featured
          </Tag>
        </div>
      )}

      {/* Profile Section */}
      <div className="text-center">
        <Space
          orientation="vertical"
          align="center"
          className="w-full"
        >
          {/* Avatar */}
          <Avatar
            size={110}
            src={profilePic}
            className="border-2 border-gray-200 shadow-md transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: '#D97706' }}
          >
            {!profilePic && getInitials()}
          </Avatar>

          {/* Name and Position */}
          <div className="mt-2">
            <h4 className="font-semibold text-lg text-gray-900">
              {name}
            </h4>
            <Tag 
              color={getPositionColor(position)} 
              className="font-medium px-3 py-0.5 text-xs mt-1"
            >
              {position}
            </Tag>
          </div>
        </Space>
      </div>

      {/* Details Section - Clean & Minimal */}
      <div className="mt-4 space-y-2 text-sm">
        {/* University */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaSchool className="text-amber-500 text-sm w-4 shrink-0" />
          <span className="truncate">{school}</span>
        </div>

        {/* Position */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaBriefcase className="text-amber-500 text-sm w-4 shrink-0" />
          <span className="truncate">{position}</span>
        </div>

        {/* Email */}
        {email && (
          <div className="flex items-center gap-2 text-gray-600">
            <FaEnvelope className="text-amber-500 text-sm w-4 shrink-0" />
            <a 
              href={`mailto:${email}`} 
              className="text-gray-600 hover:text-amber-600 transition-colors truncate"
            >
              {email}
            </a>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <FaPhone className="text-amber-500 text-sm w-4 shrink-0" />
            <a 
              href={`tel:${phone}`} 
              className="text-gray-600 hover:text-amber-600 transition-colors"
            >
              {phone}
            </a>
          </div>
        )}
      </div>

      {/* Social Links - Minimal */}
      {(linkedIn || twitter) && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center gap-3">
          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0A66C2] transition-all duration-300 hover:scale-110"
            >
              <FaLinkedin className="text-lg" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black transition-all duration-300 hover:scale-110"
            >
              <FaTwitter className="text-lg" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
            >
              <FaEnvelope className="text-lg" />
            </a>
          )}
        </div>
      )}

      <style jsx global>{`
        .executive-card .ant-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .executive-card .ant-card-body > *:last-child {
          margin-top: auto;
        }

        .executive-card .ant-avatar {
          flex-shrink: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .executive-card .ant-avatar {
            width: 80px !important;
            height: 80px !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default ExecutiveCards;