import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Icon, Col, Card, Row, Tag } from "antd";
import CheckBox from "./Sections/CheckBox";
import { category, tags } from "./Sections/Datas";
import SearchFeature from "./Sections/SearchFeature";
import Masonry from "react-masonry-component";
import InfiniteScroll from "react-infinite-scroll-component";

const { Meta } = Card;

function LandingPage(props) {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [SearchTerms, setSearchTerms] = useState("");
  const [HasMore, setHasMore] = useState(true);
  const [Filters, setFilters] = useState({
    category: [],
    tag: [],
  });

  const getTagByKey = (key) => {
    let tagname = "None";
    tags.map((tag) => {
      if (tag._id === key) {
        tagname = tag.name;
      }
    });
    return tagname;
  };

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

  function onLoadMore() {
    console.log("loadmore");
    let skip = Skip + Limit;
    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
      filters: Filters,
      searchTerm: SearchTerms,
    };
    getProducts(variables);
    setSkip(skip);
  }

  const showFilteredResults = (filters) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    getProducts(variables);
    setSkip(0);
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    newFilters[category] = filters;
    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerms = (newSearchTerm) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerms(newSearchTerm);

    getProducts(variables);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "75%",
        margin: "3rem auto",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>
          {" "}
          Let's Sell &amp; Buy <Icon type="rocket" />{" "}
        </h2>
      </div>

      {/* Filter  */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <CheckBox
            key={1}
            defaultActiveKey={["0"]}
            list={tags}
            handleFilters={(filters) => handleFilters(filters, "tag")}
            filtername="交易方式"
            category="tag"
          />
        </Col>
        <Col lg={12} xs={24}>
          <CheckBox
            key={2}
            defaultActiveKey={["0"]}
            list={category}
            handleFilters={(filters) => handleFilters(filters, "category")}
            filtername="物品种类"
            category="category"
          />
        </Col>
      </Row>

      {/* Search  */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerms} />
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
          <h2>
            暂未相关物品，您可以重新选择筛选/搜索内容或点击
            <a onClick={() => props.history.go(0)}>Home</a>返回
          </h2>
        </div>
      ) : (
        <div style={{ width: "102%", overflowX: "hidden", overflowY: "auto" }}>
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
              {Products.map((product, index) => (
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
                    <Meta
                      title={product.title}
                      description={
                        <div>
                          {`$${product.price}`}
                          <Tag style={{ float: "right" }}>
                            {getTagByKey(product.tag)}
                          </Tag>
                        </div>
                      }
                    />
                  </Card>
                </div>
              ))}
            </Masonry>
          </InfiniteScroll>
        </div>
      )}
      <br />
      <br />
    </div>
  );
}

export default LandingPage;
