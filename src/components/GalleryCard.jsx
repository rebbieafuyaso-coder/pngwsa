import { Card } from 'antd';
const { Meta } = Card;

const GalleryCard = ({ image }) => {
  return (
      <Card
      hoverable
      className="group relative h-130! w-full overflow-hidden rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg"
      cover={
        <div className="relative h-100 aspect-square overflow-hidden bg-red-500">
          <img
            src={image.url}
            alt={image.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="translate-y-4 space-y-2 transition-transform duration-300 group-hover:translate-y-0">
              <h3 className="text-lg font-semibold text-white">{image.title}</h3>
              <p className="text-sm text-gray-200">{image.description}</p>
            </div>
          </div>
        </div>
      }
    >
      <Meta
        title={image.category}
        description={`${image.event} · ${image.date}`}
      />
    </Card>
  );
};

export default GalleryCard;