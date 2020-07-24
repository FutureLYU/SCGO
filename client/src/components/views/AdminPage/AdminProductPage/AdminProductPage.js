import React, { useEffect, useState } from "react";
import { Layout, Menu, Icon, Card } from "antd";
import Axios from "axios";
import Masonry from "react-masonry-component";
import InfiniteScroll from "react-infinite-scroll-component";

function AdminProductPage(props) {
  const { Content, Sider } = Layout;
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [HasMore, setHasMore] = useState(true);
  function onLoadMore() {
    console.log("loadmore");
    let skip = Skip + Limit;
    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getProducts(variables);
    setSkip(skip);
  }

  useEffect(() => {
    if (props.user.userData) {
      if (!props.user.userData.isAdmin) {
        props.history.push("/403");
      }
    }
  }, [props.user.userData]);

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(variables);
  }, []);

  const getProducts = (variables) => {
    Axios.post("/api/product/getProducts", variables).then((response) => {
      if (response.data.success) {
        setHasMore(response.data.postSize < Limit ? false : true);
        if (variables.loadMore) {
          setProducts([...Products, ...response.data.products]);
        } else {
          setProducts(response.data.products);
        }
      } else {
        alert("Failed to fectch product datas");
      }
    });
  };

  const handleProductClick = () => {
    props.history.push("/admin/product");
  };
  const handleUserClick = () => {
    props.history.push("/admin/user");
  };

  const renderCards = Products.map((product, index) => {
    return (
      // <Col lg={6} md={8} xs={24}>
      <div
        style={{
          marginRight: "15px",
          marginBottom: "10px",
          display: "inline-block",
        }}
      >
        <Card
          style={{ width: "270px" }}
          hoverable={true}
          cover={
            <a href={`/product/${product._id}`}>
              <img
                style={{ width: "270px", height: `${752 / 270}%` }}
                src={`http://localhost:5000/${product.images[0]}`}
              />
            </a>
          }
        >
          <Card.Meta title={product.title} description={product.writer._id} />
        </Card>
      </div>
      // </Col>
    );
  });
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
            物品审核
          </Menu.Item>
          <Menu.Item onClick={handleUserClick} key="2">
            用户审核
          </Menu.Item>
        </Menu>
      </Sider>
      <Content
        className="site-layout-background"
        style={{
          paddingLeft: 240,
          margin: 0,
          minHeight: 1200,
        }}
      >
        <div style={{ width: "90%", margin: "3rem auto" }}>
          <div style={{ textAlign: "center" }}>
            <h1>
              最新物品 <Icon type="account-book" />
            </h1>
          </div>

          {Products.length === 0 ? (
            <div
              style={{
                display: "flex",
                height: "300px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>No post yet...</h2>
            </div>
          ) : (
            <div
              style={{ width: "108%", overflowX: "hidden", overflowY: "auto" }}
            >
              <InfiniteScroll
                dataLength={Products.length} //This is important field to render the next data
                next={() => onLoadMore()}
                hasMore={HasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                <Masonry
                  className={"my-gallery-class"} // default ''
                  options={{ transitionDuration: 2 }} // default {}
                  disableImagesLoaded={false} // default false
                  updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                >
                  {renderCards}
                </Masonry>
              </InfiniteScroll>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default AdminProductPage;
