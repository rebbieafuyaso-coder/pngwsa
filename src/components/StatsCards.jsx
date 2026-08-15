import { Card, Statistic, Typography } from "antd"

const StatsCards = ({title, value, icon, text}) => {
  return(
    <Card
    className="border-0!"
    >
      <Statistic
      title={title}
      value={value}
      prefix={icon}
      />
      <Typography.Text type="secondary">{text}</Typography.Text>
    </Card>
  )
}

export default StatsCards;