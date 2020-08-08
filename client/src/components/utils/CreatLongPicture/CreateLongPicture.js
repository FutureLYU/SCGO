import React, { useEffect, useRef } from "react";
import { Modal } from "antd";

function CreateLongPicture(props) {
  const canvasRef = useRef();

  useEffect(() => {
    if (props.visible) {
      var position = 0;
      function drawCanvas(image, text, height) {
        var mycv = canvasRef.current;
        var myctx = mycv.getContext("2d");
        myctx.drawImage(image, 0, position);
        myctx.font = "40px Arial";
        myctx.fillStyle = "red";
        myctx.textAlign = "center";
        myctx.fillText(text, 351, position + 30, 700);
        position = position + height;
      }

      props.items.map((item) => {
        const text = item.title + ` $${item.price}`;
        let height = item.heights[0];
        let newImage = new Image();
        newImage.setAttribute("crossOrigin", "Anonymous");
        newImage.src = `http://3.15.2.141/${item.images[0]}`;
        if (newImage.complete) {
          drawCanvas(newImage, text, height);
        } else {
          newImage.onload = function () {
            drawCanvas(newImage, text, height);
          };
          newImage.onerror = function () {
            alert("failed to load picture");
          };
        }
        return null;
      });
    }
  }, [props]);

  const handleCancel = () => {
    props.handleCancel();
  };
  function downLoadImage(canvas, name) {
    var a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 1.0);
    a.download = name;
    a.click();
  }

  const handleSave = () => {
    let currentCanvas = canvasRef.current;
    downLoadImage(currentCanvas, `SCGO_LongPicture_${Date.now()}`);
  };

  return (
    <>
      <Modal
        forceRender={true}
        title="Successfully uploaded ! Click save to download your picture"
        visible={props.visible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="save"
        cancelText="skip"
        width={800}
      >
        <canvas
          id="LongPicture"
          ref={canvasRef}
          width={props.width}
          height={props.height}
        />
      </Modal>
    </>
  );
}

export default CreateLongPicture;
