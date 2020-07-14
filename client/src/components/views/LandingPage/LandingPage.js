import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Icon, Col, Card, Row, Tag } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { category, tags } from "./Sections/Datas";
import SearchFeature from "./Sections/SearchFeature";
import Masonry from "react-masonry-component";

const { Meta } = Card;

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState();
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
    <div style={{ width: "75%", margin: "3rem auto" }}>
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
      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
