import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import Masonry from "react-masonry-component";
import { Icon, Card } from "antd";

function UserPage(props) {
  const [Products, setProducts] = useState([]);
  const [CardSize, setCardSize] = useState({ width: 0 })
  const userid = props.match.params.userid;
  const isPC = function(){
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];  
    var flag = true;  
    for (var v = 0; v < Agents.length; v++) {  
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
    }  
    return flag;
  }();

  const onResize = useCallback(()=>{
    let boxwidth = document.documentElement.clientWidth * (isPC? 0.75:0.95);
    let cardnum = isPC? parseInt(boxwidth / 300)+1: 2;
    let cardwidth = parseInt((boxwidth-15*(cardnum-1))/cardnum);
    setCardSize({
      width: cardwidth,
    })
  },[isPC])

  useEffect(() => {
    let boxwidth = document.documentElement.clientWidth * (isPC? 0.75:0.95);
    let cardnum = isPC? parseInt(boxwidth / 300)+1: 2;
    let cardwidth = parseInt((boxwidth-15*(cardnum-1))/cardnum);
    setCardSize({
      width: cardwidth,
    })
  }, [isPC])

  useEffect(()=>{
    window.addEventListener('resize', onResize);
    return (()=>{
      window.removeEventListener('resize', onResize) 
    })
  },[onResize])

  useEffect(() => {
    if (userid) {
      const variables = { userid: userid };
      Axios.post("/api/product/getByUser", variables).then((response) => {
        if (response.data.success) {
          setProducts([...response.data.products]);
        } else {
          alert("failed to get items");
        }
      });
    }
  }, [userid]);

  const renderCards = Products.map((product, index) => {
    return (
      // <Col lg={6} md={8} xs={24}>
      <div
        style={{
          marginRight: "15px",
          marginBottom: "10px",
          display: "inline-block",
          width: CardSize.width + "px"
        }}
      >
        <a href={`/product/${product._id}`}>
          <Card
            hoverable={true}
            cover={
              <img
                style={{ width: CardSize.width-2+"px" }}
                src={`http://3.15.2.141/${product.images[0]}`}
                alt=""
              />       
            }
          >
            <Card.Meta title={product.title} description={`$${product.price}`} />
          </Card>
        </a>
      </div>
    );
  });

  return (
    <div style={{ width: isPC? "75%":"95%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>
          卖家的物品 <Icon type="account-book" />
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
        <div style={{ width: 'calc(100% + 15px)' }} >
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
    </div>
  );
}

export default UserPage;
