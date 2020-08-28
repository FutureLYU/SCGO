import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import Masonry from "react-masonry-component";
import { Icon, Card, Popover, Button } from "antd";
import ProductEditForm from "../../utils/ProductEditForm";
import ProductDeleteForm from "../../utils/ProductDeleteForm";

function UserPage(props) {
  const path =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  const [Products, setProducts] = useState([]);
  const [FormValue, setFormValue] = useState({ visible: false });
  const [CurrentItem, setCurrentItem] = useState({});
  const [DeleteFormValue, setDeleteFormValue] = useState({ visible: false });
  const [DeleteItem, setDeleteItem] = useState({});
  const [CardSize, setCardSize] = useState({ width: 0 });
  const isPC = (function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod",
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  })();

  const onResize = useCallback(() => {
    let boxwidth = document.documentElement.clientWidth * (isPC ? 0.75 : 0.95);
    let cardnum = isPC ? parseInt(boxwidth / 300) + 1 : 2;
    let cardwidth = parseInt((boxwidth - 15 * (cardnum - 1)) / cardnum);
    setCardSize({
      width: cardwidth,
    });
  }, [isPC]);

  useEffect(() => {
    let boxwidth = document.documentElement.clientWidth * (isPC ? 0.75 : 0.95);
    let cardnum = isPC ? parseInt(boxwidth / 300) + 1 : 2;
    let cardwidth = parseInt((boxwidth - 15 * (cardnum - 1)) / cardnum);
    setCardSize({
      width: cardwidth,
    });
  }, [isPC]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => {
    if (props.user.userData) {
      const variables = { userid: props.user.userData._id };
      getProducts(variables);
    }
  }, [props.user]);

  const handleDelete = (product) => {
    setDeleteItem(product);
    setDeleteFormValue({ ...DeleteFormValue, visible: true });
  };

  const handleEdit = (product) => {
    // Edit Form
    setCurrentItem(product);
    setFormValue({ ...FormValue, visible: true });
  };

  const handleEditOk = (newItem) => {
    // save
    let updateItem = {
      ...CurrentItem,
      ...newItem,
    };

    Axios.post("/api/product/updateProduct", updateItem).then((response) => {
      if (response.data.success) {
        const variables = { userid: props.user.userData._id };
        getProducts(variables);
      } else {
        alert("Fail to update product!");
      }
    });

    setFormValue({ ...FormValue, visible: false });
    setCurrentItem({});
  };

  const handleEditCancel = () => {
    setFormValue({ ...FormValue, visible: false });
    setCurrentItem({});
  };

  const handleDeleteOk = (reason) => {
    let deleteItem = { ...DeleteItem, ...reason };

    Axios.post("/api/users/deleteProduct", deleteItem).then((response) => {
      const variables = { userid: props.user.userData._id };
      getProducts(variables);
    });

    setDeleteItem({});
    setDeleteFormValue({ ...DeleteFormValue, visible: false });
  };

  const handleDeleteCancel = () => {
    setDeleteItem({});
    setDeleteFormValue({ ...DeleteFormValue, visible: false });
  };

  const content = (product) => {
    return (
      <div>
        <div>
          <Button type="link" onClick={() => handleDelete(product)}>
            下架删除
          </Button>
        </div>
        <div>
          <Button type="link" onClick={() => handleEdit(product)}>
            修改内容
          </Button>
        </div>
      </div>
    );
  };

  const getProducts = (variables) => {
    Axios.post("/api/product/getByUser", variables).then((response) => {
      if (response.data.success) {
        setProducts([...response.data.products]);
      } else {
        alert("failed to get items");
      }
    });
  };

  const renderCards = Products.map((product, index) => {
    return (
      <div
        key={index}
        style={{
          marginRight: "15px",
          marginBottom: "10px",
          display: "inline-block",
          width: CardSize.width + "px",
        }}
      >
        <Popover content={content(product)} title="Edit">
          <Card
            hoverable={true}
            cover={
              <a href={`/product/${product._id}`} target="_blank">
                <img
                  style={{ width: CardSize.width - 2 + "px" }}
                  src={`${path}/${product.images[0]}`}
                  alt=""
                />
              </a>
            }
          >
            <Card.Meta
              title={product.title}
              description={`$${product.price}`}
            />
          </Card>
        </Popover>
      </div>
    );
  });

  return (
    <div style={{ width: isPC ? "75%" : "95%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>
          我的物品 <Icon type="account-book" />
        </h1>
        {isPC ? <p></p> : <p>点击文字部分编辑</p>}
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
        <div style={{ width: "calc(100% + 30px)" }}>
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
      <div>
        <ProductEditForm
          visible={FormValue.visible}
          handleOk={handleEditOk}
          handleCancel={handleEditCancel}
          edit={true}
          currentItem={CurrentItem}
          user={props.user}
        />
      </div>
      <div>
        <ProductDeleteForm
          visible={DeleteFormValue.visible}
          handleOk={handleDeleteOk}
          handleCancel={handleDeleteCancel}
          user={props.user}
        />
      </div>
    </div>
  );
}

export default UserPage;
