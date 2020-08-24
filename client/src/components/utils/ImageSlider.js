import React from "react";
import { Carousel } from "antd";

function ImageSlider(props) {
  const path =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <div key={index}>
            <img
              style={{
                width: "100%",
                maxHeight: "150px",
                objectFit: "contain",
              }}
              src={`${path}/${image}`}
              alt="productImage"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
