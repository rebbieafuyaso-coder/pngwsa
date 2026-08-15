import { Card, Avatar, Tag } from "antd";
import { 
  FaGraduationCap, 
  FaUniversity, 
  FaLinkedin, 
  FaBriefcase,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";

const ProfileCards = ({ 
  name, 
  graduationYear, 
  linkedIn, 
  university, 
  profilePic,
  currentJob,
  currentEmployer,
  currentLocation,
  featured = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-xl"
      style={{
        background: '#FFFFFF',
        borderColor: featured ? '#F59E0B' : '#E5E7EB',
        borderTopWidth: featured ? '3px' : '1px',
        height: 300,
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <Tag color="gold" className="absolute top-3 right-3 z-10 text-xs">
          Featured
        </Tag>
      )}

      {/* Profile Header */}
      <div className="text-center mb-4">
        <Avatar
          size={90}
          src={!imageError ? profilePic : null}
          className="border-2 border-gray-200 shadow-md"
          style={{ backgroundColor: '#D97706' }}
        >
          {getInitials()}
        </Avatar>
        <h4 className="font-semibold text-base text-gray-900 mt-2">
          {name}
        </h4>
        {graduationYear && (
          <p className="text-xs mt-0.5 font-sans text-gray-400">
            {graduationYear}
          </p>
        )}
      </div>

      {/* Details - Label above content */}
      <div className="space-y-2 text-sm">
        {/* University */}
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
            <FaUniversity className="inline mr-1 text-amber-400" />
            University
          </p>
          <p className="text-gray-700 font-medium">{university}</p>
        </div>

        {/* Current Job */}
        {currentJob && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              <FaBriefcase className="inline mr-1 text-amber-400" />
              Position
            </p>
            <p className="text-gray-700">{currentJob}</p>
          </div>
        )}

        {/* Current Employer */}
        {currentEmployer && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              Employer
            </p>
            <p className="text-gray-700">{currentEmployer}</p>
          </div>
        )}

        {/* Location */}
        {currentLocation && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              <FaMapMarkerAlt className="inline mr-1 text-amber-400" />
              Location
            </p>
            <p className="text-gray-700">{currentLocation}</p>
          </div>
        )}

        {/* LinkedIn */}
        {linkedIn && (
          <div className="pt-2 border-t border-gray-100 absolute bottom-3">
            <a
              href={linkedIn.startsWith('http') ? linkedIn : `https://www.linkedin.com${linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-500 hover:text-amber-600 transition-colors text-sm"
            >
              <FaLinkedin className="text-base" />
              <span>View Profile</span>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCards;