import React, { useEffect } from "react";
import { Layout, Menu } from "antd";

function AdminPage(props) {
  const { Content, Sider } = Layout;
  useEffect(() => {
    if (props.user.userData) {
      if (!props.user.userData.isAdmin) {
        props.history.push("/403");
      }
      props.history.push("/admin/product");
    }
  }, [props]);

  const handleProductClick = () => {
    props.history.push("/admin/product");
  };
  const handleUserClick = () => {
    props.history.push("/admin/user");
  };
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
          <Menu.Item onClick={handleProductClick} key="1">
            Products
          </Menu.Item>
          <Menu.Item onClick={handleUserClick} key="2">
            Users
          </Menu.Item>
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
