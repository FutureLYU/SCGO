import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { Icon, Col, Card, Row, Tag } from "antd";
import CheckBox from "./Sections/CheckBox";
import { category, tags } from "./Sections/Datas";
import SearchFeature from "./Sections/SearchFeature";
import Masonry from "react-masonry-component";

const { Meta } = Card;

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(8);
  const [SearchTerms, setSearchTerms] = useState("");
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

    function getScrollTop() {
      var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop =
        bodyScrollTop - documentScrollTop > 0
          ? bodyScrollTop
          : documentScrollTop;
      return scrollTop;
    }
    function getScrollHeight() {
      var scrollHeight = 0;
      if (document.body) {
        var bSH = document.body.scrollHeight;
      }
      if (document.documentElement) {
        var dSH = document.documentElement.scrollHeight;
      }
      scrollHeight = bSH - dSH > 0 ? bSH : dSH;
      return scrollHeight;
    }
    function getWindowHeight() {
      var windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    }
    window.addEventListener("scroll", () => {
      const isBottom =
        getScrollTop() + getWindowHeight() + 20 > getScrollHeight();
      if (isBottom) {
        onLoadMore();
      }
    });
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  const getProducts = (variables) => {
    Axios.post("/api/product/getProducts", variables).then((response) => {
      if (response.data.success) {
        if (variables.loadMore) {
          setProducts([...Products, ...response.data.products]);
        } else {
          setProducts(response.data.products);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("Failed to fectch product datas");
      }
    });
  };

  const onLoadMore = () => {
    console.log(PostSize, Limit, Products);
    if (PostSize >= Limit) {
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
  };
  const renderCards = Products.map((product, index) => {
    return (
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
                <Tag style={{ float: "right" }}>{getTagByKey(product.tag)}</Tag>
              </div>
            }
          />
        </Card>
      </div>
    );
  });

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
    <div style={{ height: "100%", width: "75%", margin: "3rem auto" }}>
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
          <h2>No post yet...</h2>
        </div>
      ) : (
        <div>
          <Masonry
            className={"my-gallery-class"} // default ''
            options={{ transitionDuration: 2 }} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          >
            {renderCards}
          </Masonry>
        </div>
      )}
      <br />
      <br />

      {/*console.log(Products)*/}
      {/*PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onLoadMore}>Load More</button>
        </div>
      )*/}
    </div>
  );
}

export default LandingPage;
