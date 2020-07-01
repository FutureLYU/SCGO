import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "antd";

function CreateLongPicture(props) {
  const [showModal, setshowModal] = useState(false);
  const canvasRef = useRef();
  const width = props.width;
  const items = props.items;
  const height = items.reduce((x, y) => {
    return x.heights[0] + y.heights[0];
  });
  const position = 0;
  useEffect(() => {
    if (showModal) {
      function drawImage(image, height) {
        var mycv = canvasRef.current;
        var myctx = mycv.getContext("2d");
        myctx.drawImage(image, 0, position);
        position = position + height;
      }

      items.map((item, index) => {
        let height = item.heights[0];
        let newImage = new Image();
        newImage.src = `http://localhost:5000/${item.images[0]}`;
        if (newImage.complete) {
          drawImage(newImage, height);
        } else {
          newImage.onload = function () {
            drawImage(newImage, height);
          };
          newImage.onerror = function () {
            alert("failed to load picture");
          };
        }
      });
    }
  }, [showModal, canvasRef.current]);

  const handleModal = () => {
    setshowModal(!showModal);
  };

  return (
    <>
      <Button onClick={handleModal}>{props.title}</Button>

      <Modal
        forceRender={true}
        title="Successfully uploaded  Click to save your picture"
        visible={showModal}
        onOk={handleModal}
        onCancel={handleModal}
      >
        <canvas
          id="LongPicture"
          ref={canvasRef}
          width={width}
          height={height}
        />
      </Modal>
    </>
  );
}

export default CreateLongPicture;
