import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  PictureOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuth } from "../auth/AuthContext";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const MENU_ITEMS = [
  { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/events", icon: <CalendarOutlined />, label: "Events" },
  { key: "/admin/blogs", icon: <FileTextOutlined />, label: "Blogs" },
  { key: "/admin/alumni", icon: <TeamOutlined />, label: "Alumni" },
  { key: "/admin/gallery", icon: <PictureOutlined />, label: "Gallery" },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const userMenu = {
    items: [
      {
        key: "signout",
        icon: <LogoutOutlined />,
        label: "Sign Out",
        onClick: handleSignOut,
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        className="shadow-md!"
        width={230}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <img
            src="/papua-new-guinea-wuhan-students-association-logo.png"
            alt="PNG HSA"
            className="h-9 w-9 shrink-0 rounded-full border-2 border-orange-200 bg-white object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                PNG HSA
              </div>
              <div className="text-[11px] text-slate-400 whitespace-nowrap">
                Admin Panel
              </div>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={MENU_ITEMS.map((item) => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
          className="border-none!"
        />
      </Sider>

      <Layout>
        <Header className="flex items-center justify-between bg-white! px-6! shadow-sm!">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-base!"
          />

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-medium text-slate-700">
                {user?.email?.split("@")[0] || "Admin"}
              </div>
              <Text type="secondary" className="text-[11px]!">
                Administrator
              </Text>
            </div>

            <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
              <Avatar
                size={36}
                className="cursor-pointer bg-orange-500"
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        <Content className="bg-slate-50! p-6!">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;