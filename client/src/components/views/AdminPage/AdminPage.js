import React from "react";
import { Layout, Menu } from "antd";
function AdminPage() {
  const { Content, Sider } = Layout;
  const { SubMenu } = Menu;
  return (
    <Layout>
      <Sider
        width={200}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
        className="site-layout-background"
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1">物品审核</Menu.Item>
          <Menu.Item key="2">用户审核</Menu.Item>
        </Menu>
      </Sider>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 1200,
        }}
      >
        Content
      </Content>
    </Layout>
  );
}

export default AdminPage;
