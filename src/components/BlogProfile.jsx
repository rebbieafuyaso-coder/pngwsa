import { Button, Card, Tag } from "antd";
import { 
  FaArrowRight, 
  FaCalendarAlt, 
  FaUser, 
  FaClock,
  FaBookmark,
  FaShareAlt,
  FaEye,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BlogProfile = ({ 
  imgSource, 
  imgDesc, 
  blogTitle, 
  blog, 
  action, 
  type,
  date,
  author,
  readTime,
  featured = false,
  views,
  likes,
  comments,
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    if (typeof action === 'string') {
      navigate(action);
    } else if (typeof action === 'function') {
      action();
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'News': 'blue',
      'Event': 'green',
      'Announcement': 'gold',
      'Update': 'purple',
      'Story': 'pink',
      'Interview': 'cyan',
      'Opinion': 'orange',
    };
    return colors[type] || 'default';
  };

  return (
    <Card
      className={`blog-card h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl group ${
        featured ? 'border-t-4 border-t-amber-500' : ''
      }`}
      cover={
        <div className="relative overflow-hidden h-52">
          <img
            src={imgSource}
            alt={imgDesc || blogTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3">
              <Tag color="gold" className="font-semibold px-3 py-1">
                <FaBookmark className="mr-1" />
                Featured
              </Tag>
            </div>
          )}

          {/* Category Badge */}
          {type && (
            <div className="absolute bottom-3 left-3">
              <Tag 
                color={getTypeColor(type)} 
                className="font-medium px-3 py-1 backdrop-blur-sm bg-white/90"
              >
                {type}
              </Tag>
            </div>
          )}

          {/* Read Time Badge */}
          {readTime && (
            <div className="absolute bottom-3 right-3">
              <Tag className="bg-black/70 text-white border-none px-3 py-1 backdrop-blur-sm">
                <FaClock className="mr-1 text-amber-400" />
                {readTime} min read
              </Tag>
            </div>
          )}
        </div>
      }
      actions={[
        <Button 
          type="text" 
          icon={<FaShareAlt />} 
          className="hover:text-green-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            // Share functionality
            if (navigator.share) {
              navigator.share({
                title: blogTitle,
                text: blog,
                url: window.location.href,
              });
            }
          }}
        />,
      ]}
      hoverable
    >
      <div className="flex-1 flex flex-col">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          {date && (
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-amber-400" />
              {date}
            </span>
          )}
          {author && (
            <>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1">
                <FaUser className="text-amber-400" />
                {author}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {blogTitle}
        </h4>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 flex-1 line-clamp-3 leading-relaxed">
          {blog}
        </p>

        {/* Read More Button */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <Button
            type="primary"
            className="bg-amber-500 hover:bg-amber-600 border-none rounded-full px-6 font-medium group/btn transition-all duration-300"
            onClick={handleReadMore}
          >
            <span className="flex items-center gap-2">
              Read More
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
          </Button>
          
          <span className="text-xs text-gray-400 hover:text-amber-500 transition-colors cursor-pointer">
            <FaBookmark className="text-lg" />
          </span>
        </div>
      </div>

      <style jsx global>{`
        .blog-card .ant-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .blog-card .ant-card-cover {
          flex-shrink: 0;
        }

        .blog-card .ant-card-actions {
          border-top: none;
          background: transparent;
          padding: 0 16px 8px;
        }

        .blog-card .ant-card-actions > li {
          margin: 0;
        }

        .blog-card .ant-card-actions > li > .ant-btn {
          color: #9CA3AF;
          font-size: 13px;
        }

        .blog-card .ant-card-actions > li > .ant-btn:hover {
          color: #F59E0B;
        }

        /* Line clamp utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Card>
  );
};

export default BlogProfile;