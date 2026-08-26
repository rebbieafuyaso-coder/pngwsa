import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout className="min-h-screen">

      <AppHeader />

      <Content>
        <Outlet />
      </Content>

      <AppFooter />

    </Layout>
  );
}