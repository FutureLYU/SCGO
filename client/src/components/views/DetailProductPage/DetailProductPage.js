import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Row, Col, Button, Modal } from "antd";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from "./Sections/ProductInfo";

function DetailProductPage(props) {
  const productId = props.match.params.productId;
  const [Product, setProduct] = useState({});
  const [ContactForm, setContactForm] = useState({ visible: false });

  useEffect(() => {
    Axios.get(`/api/product/products_by_id?id=${productId}&type=single`).then(
      (response) => {
        if (response.data.length === 0) {
          props.history.push("/404");
        } else {
          setProduct(response.data[0]);
        }
      }
    );
  }, [props, productId]);

  const showContact = () => {
    setContactForm({ ...ContactForm, visible: true });
  };
  const handleOk = () => {
    setContactForm({ ...ContactForm, visible: false });
  };
  const handleCancel = () => {
    setContactForm({ ...ContactForm, visible: false });
  };

  return (
    <div className="postPage" style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{Product.title}</h1>
      </div>
      <br />
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <ProductImage detail={Product} />
        </Col>
        <Col lg={12} xs={24}>
          <ProductInfo detail={Product} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="large"
              shape="round"
              type="danger"
              style={{ margin: "1em 1em" }}
              onClick={showContact}
            >
              Seller Info
            </Button>
            <a href={`/user/${Product.writer ? Product.writer._id : ""}`}>
              <Button
                size="large"
                shape="round"
                type="danger"
                style={{ margin: "1em 1em" }}
              >
                More Items
              </Button>
            </a>
          </div>
        </Col>
      </Row>

      <Modal
        title="Show Contact"
        visible={ContactForm.visible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        {
          <div>
            <p>
              You can contact seller's by {Product.contactchoice}: {Product.contact}
            </p>
          </div>
        }
      </Modal>
    </div>
  );
}

export default DetailProductPage;
