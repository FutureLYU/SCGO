import React, { useEffect } from "react";
import { Layout, Menu } from "antd";

function AdminPage(props) {
  const { Content, Sider } = Layout;
  useEffect(() => {
    if (props.user.userData) {
      if (!props.user.userData.isAdmin) {
        props.history.push("/403");
      }
    }
  }, [props.user.userData]);
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
          <Menu.Item key="2"><a href="/admin/user">用户审核</a></Menu.Item>
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
