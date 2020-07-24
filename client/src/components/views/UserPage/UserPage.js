import React, { useEffect, useState } from "react";
import Axios from "axios";
import Masonry from "react-masonry-component";
import { Icon, Card, Popover } from "antd";
import ProductEditForm from '../../utils/ProductEditForm';
import ProductDeleteForm from '../../utils/ProductDeleteForm';
import { useDispatch } from 'react-redux';

function UserPage(props) {
  const [Products, setProducts] = useState([]);
  const [FormValue, setFormValue] = useState({ visible: false });
  const [CurrentItem, setCurrentItem] = useState({})
  const [DeleteFormValue, setDeleteFormValue] = useState({ visible: false })
  const [DeleteItem, setDeleteItem] = useState({});

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
      ...newItem
    }

    Axios.post('/api/product/updateProduct', updateItem)
      .then((response) => {
        if (response.data.success) {
          const variables = { userid: props.user.userData._id };
          getProducts(variables);  
        } else {
          alert("Fail to update product!")
        }
      })

    setFormValue({ ...FormValue, visible: false });
    setCurrentItem({});
    
  }

  const handleEditCancel = () => {
    setFormValue({ ...FormValue, visible: false });
    setCurrentItem({});
  }

  const handleDeleteOk = (reason) => {
    let deleteItem = { ...DeleteItem, ...reason };

    // delete from db & add to history
    // dispatch(onDeleteItem(deleteItem))
    //   .then((response) => {
    //     // do something
    //   })
    Axios.post('/api/users/deleteProduct', deleteItem)
      .then((response) => {
        const variables = { userid: props.user.userData._id };
        getProducts(variables);
      })
    
    setDeleteItem({});
    setDeleteFormValue({ ...DeleteFormValue, visible: false });
  }

  const handleDeleteCancel = () => {
    setDeleteItem({});
    setDeleteFormValue({ ...DeleteFormValue, visible: false });
  }

  const content = (product) => {
    return (
      <div>
        <div>
          <a onClick={()=>handleDelete(product)}>下架删除</a>
        </div>
        <div>
          <a onClick={()=>handleEdit(product)}>修改内容</a>
        </div>
      </div>
    )
  }

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
      // <Col lg={6} md={8} xs={24}>
      <div
        style={{
          marginRight: "15px",
          marginBottom: "10px",
          display: "inline-block",
        }}
      >
        <Popover content={content(product)} title="Edit">
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
            <Card.Meta
              title={product.title}
              description={`$${product.price}`}
            />
          </Card>
        </Popover>
      </div>
      // </Col>
    );
  });

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>
          我的物品 <Icon type="account-book" />
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
