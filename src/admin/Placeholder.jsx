import { Card, Typography, Empty } from "antd";

const { Title, Text } = Typography;

const Placeholder = ({ title }) => {
  return (
    <div>
      <Title level={3} className="mb-1!">
        {title}
      </Title>
      <Text type="secondary">Manage {title.toLowerCase()} content here.</Text>

      <Card bordered={false} className="mt-6 rounded-2xl shadow-sm">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-slate-500">
              This section is not built yet
            </span>
          }
        />
      </Card>
    </div>
  );
};

export default Placeholder;