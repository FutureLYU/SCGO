import React, { useState, useEffect } from "react";
import { Button, Col, Row, Card, Tag } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import Axios from "axios";
import CreateLongPicture from "../../utils/CreatLongPicture/CreateLongPicture";
import ProductEditForm from "../../utils/ProductEditForm";
import ContactAddForm from "../../utils/ContactAddForm";
import { categoryData, tagsData } from "../../utils/Data";

function UploadProductPage(props) {
  const [Items, setItems] = useState([]);
  const [FormValue, setFormValue] = useState({ visible: false });
  const [Edit, setEdit] = useState(false);
  const [EditIndex, setEditIndex] = useState(-1);
  const [showPicture, setshowPicture] = useState(false);
  const [CurrentItem, setCurrentItem] = useState({});
  const [ContactForm, setContactForm] = useState({ visible: false });

  useEffect(() => {
    if (props.user.userData) {
      if (props.user.userData.role === -1) {
        props.history.push("/403");
      }
    }
    Axios.get("/api/users/getUploadProduct").then((response) => {
      setItems(response.data.uploadProduct);
    });
  }, [props.user.userData]);

  const onAdd = (event) => {
    // set state of Form Value
    setFormValue({ ...FormValue, visible: true });
  };

  const clearItems = () => {
    setItems([]);
  };

  const onAddContact = () => {
    setContactForm({ ...ContactForm, visible: true });
  };

  const onSubmit = (newItems) => {
    // submit all items into database
    Axios.post("/api/product/uploadProduct", newItems).then((response) => {
      if (response.data.success) {
        // show success & long picture
        setshowPicture(true);
      } else {
        // add product name
        alert("Failed to upload Product!");
      }
    });

    // update upload product
    Axios.post("/api/users/updateUploadProduct", []).then((response) => {
      console.log("Update successfully");
    });
  };

  const onEdit = (index) => {
    // set edit
    setEdit(true);
    setEditIndex(index);
    setCurrentItem(Items[index]);
    setFormValue({ ...FormValue, visible: true });
  };

  const onDelete = (index) => {
    // delete
    let newItems = [...Items];
    newItems.splice(index, 1);
    setItems(newItems);

    // update upload product
    Axios.post("/api/users/updateUploadProduct", newItems).then((response) => {
      console.log("Update successfully");
    });
  };

  const handleOk = (newItem) => {
    let newItems = [...Items];
    if (Edit && EditIndex > -1) {
      newItems[EditIndex] = newItem;
      setItems(newItems);
    } else {
      newItems = [...newItems, newItem];
      setItems(newItems);
      setCurrentItem({});
    }

    // set all values to default
    setFormValue({ ...FormValue, visible: false });
    setEdit(false);
    setEditIndex(-1);

    // update upload product
    Axios.post("/api/users/updateUploadProduct", newItems).then((response) => {
      console.log("Update successfully");
    });
  };

  const handleCancel = () => {
    // close model
    setFormValue({ ...FormValue, visible: false });

    // set all values to default
    setEdit(false);
    setEditIndex(-1);
    setCurrentItem({});
  };

  const addContactOk = (contact) => {
    setContactForm({ ...ContactForm, visible: false });

    // add contact to all items
    let newItems = Items.map((item) => {
      return {
        ...item,
        wechat: contact.wechat,
        email: contact.email,
        contactchoice: contact.contactchoice,
      };
    });
    setItems(newItems);
    // use on submit
    onSubmit(newItems);
  };

  const addContactCancel = () => {
    setContactForm({ ...ContactForm, visible: false });
  };

  const getCategoryByKey = (key) => {
    let categoryname = "None";
    categoryData.map((item) => {
      if (item.key === parseInt(key)) {
        categoryname = item.value;
      }
      return
    });
    return categoryname;
  };

  const getTagByKey = (key) => {
    let tagname = "None";
    tagsData.map((tag) => {
      if (tag.key === parseInt(key)) {
        tagname = tag.value;
      }
      return
    });
    return tagname;
  };

  const renderItemCards = Items.map((item, index) => {
    return (
      <Col>
        <Card hoverable={false} sytle={{ width: "80%" }}>
          <Row gutter={16}>
            <Col lg={8} xs={24}>
              <ImageSlider images={item.images} />
            </Col>
            <Col lg={12} xs={24}>
              <p>Title: {item.title}</p>
              <p>Description: {item.description}</p>
              <p>Price: {item.price}</p>
              <p>
                交易方式:{" "}
                <Tag style={{ width: "100px", textAlign: "center" }}>
                  {getTagByKey(item.tag)}
                </Tag>
              </p>
              <p>
                物品种类:{" "}
                <Tag style={{ width: "100px", textAlign: "center" }}>
                  {getCategoryByKey(item.category)}
                </Tag>
              </p>
            </Col>
            <Col lg={4} xs={24}>
              <Button
                style={{ width: "100px", margin: "10px auto" }}
                onClick={() => onEdit(index)}
              >
                {" "}
                Edit{" "}
              </Button>
              <Button
                style={{ width: "100px", margin: "10px auto" }}
                onClick={() => onDelete(index)}
              >
                {" "}
                Delete{" "}
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    );
  });

  return (
    <div style={{ width: "80%", margin: "3rem auto" }}>
      {Items.length === 0 ? (
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
        <div style={{ width: "70%", margin: "3rem auto" }}>
          <Row gutter={[16, 16]}>{renderItemCards}</Row>
        </div>
      )}
      <br />
      <br />

      {Items.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button style={{ width: "100px", margin: "25px" }} onClick={onAdd}>
            Add
          </Button>

          <Button
            style={{ width: "100px", margin: "25px" }}
            onClick={onAddContact}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button style={{ width: "100px", margin: "auto" }} onClick={onAdd}>
            Add
          </Button>
        </div>
      )}

      <div>
        <ProductEditForm
          visible={FormValue.visible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          edit={Edit}
          currentItem={Edit ? CurrentItem : {}}
          user={props.user}
        />
      </div>
      <div>
        <ContactAddForm
          visible={ContactForm.visible}
          handleOk={addContactOk}
          handleCancel={addContactCancel}
          user={props.user}
        />
      </div>
      <div>
        <CreateLongPicture
          handleCancel={() => {
            setshowPicture(false);
            clearItems();
          }}
          visible={showPicture}
          items={Items}
          width={752}
          height={Items.reduce((total, cur) => {
            return total + cur.heights[0];
          }, 0)}
        />
      </div>
    </div>
  );
}

export default UploadProductPage;
