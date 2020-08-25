import React, { useEffect, useRef } from "react";
import { Modal, Button } from "antd";

const QRCode = require("qrcode.react");

function CreateLongPicture(props) {
  const path =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  const canvasRef = useRef();
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

  useEffect(() => {
    if (props.visible) {
      var position = 300;
      var count = props.items.length + 1;
      var mycv = canvasRef.current;
      var myctx = mycv.getContext("2d");
      myctx.fillStyle = "#FFFFFF";
      myctx.fillRect(0, 0, mycv.width, mycv.height);

      function drawCanvas(image, text, height) {
        var mycv = canvasRef.current;
        var myctx = mycv.getContext("2d");
        myctx.drawImage(image, 0, position + 90);
        myctx.font = "40px Arial";
        myctx.fillStyle = "black";
        myctx.textAlign = "center";
        myctx.fillText(text, 371, position + 75, 720);
        position = position + height + 90;
      }

      function drawQRCode(image, productheight) {
        var mycv = canvasRef.current;
        var myctx = mycv.getContext("2d");
        myctx.drawImage(image, 30, productheight + 30);
        myctx.font = "20px Arial";
        myctx.fillStyle = "black";
        myctx.textAlign = "center";
        myctx.fillText("扫码查看更多信息", 110, productheight + 210, 200);
        myctx.textAlign = "left";
        myctx.font = "30px Arial";
        myctx.fillStyle = "#006400";
        myctx.fillText(
          "SCused - 免费二手物品交易网站", 
          250,
          productheight + 130,
          450)
      }

      function showPreivew(count) {
        if (count === 0) {
          let canvasImg = document.getElementById("TemplateLongPicture");
          let picpreview = new Image();
          picpreview.src = canvasImg.toDataURL("image/png");

          let imglink = document.getElementById("previewimg");
          imglink.src = picpreview.src;
          imglink.download = `SCGO_LongPicture_${Date.now()}`;
          imglink.style.objectFit = "contain";
          imglink.style.width = "100%";
        }
      }

      props.items.forEach((item) => {
        const text = item.title + ` $${item.price}`;
        let height = item.heights[0];
        let newImage = new Image();
        newImage.setAttribute("crossOrigin", "Anonymous");
        newImage.src = `${path}/${item.images[0]}`;
        if (newImage.complete) {
          drawCanvas(newImage, text, height);
          count--;
          showPreivew(count);
        } else {
          newImage.onload = function () {
            drawCanvas(newImage, text, height);
            count--;
            showPreivew(count);
          };
          newImage.onerror = function () {
            alert("failed to load picture");
          };
        }
      });

      let qrImage = new Image();
      let qrsrc = document.getElementById("qrcode");
      qrImage.src = qrsrc.toDataURL("image/png");
      if (qrImage.complete) {
        drawQRCode(qrImage, 0);
        count--;
        showPreivew(count);
      } else {
        qrImage.onload = function () {
          drawQRCode(qrImage, 0);
          count--;
          showPreivew(count);
        };
        qrImage.onerror = function () {
          alert("failed to load QR code");
        };
      }
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
    <div
      style={{
        width: 600,
        maxWidth: document.documentElement.clientWidth * 0.95,
      }}
    >
      {isPC ? (
        <Modal
          forceRender={true}
          title="Successfully uploaded ! Click save to download your picture"
          visible={props.visible}
          onOk={handleSave}
          onCancel={handleCancel}
          okText="save"
          cancelText="skip"
        >
          <template>
            <QRCode
              id="qrcode"
              value={
                props.user.userData
                  ? `${path}/user/${props.user.userData._id}`
                  : `${path}/`
              }
              size={isPC ? 80 : 52}
              fgColor="#000000"
            />
            <canvas
              id="TemplateLongPicture"
              ref={canvasRef}
              width={props.width}
              height={props.height + 300}
            />
          </template>
          <div id="picpreview" style={{ width: "95%", margin: "auto" }}>
            <img id="previewimg" alt="Product Images" />
          </div>
        </Modal>
      ) : (
        <Modal
          forceRender={true}
          title="Successfully uploaded ! 长按保存"
          visible={props.visible}
          footer={[
            <Button key="back" onClick={handleCancel}>
              ok
            </Button>,
          ]}
        >
          <template>
            <QRCode
              id="qrcode"
              value={
                props.user.userData
                  ? `${path}/user/${props.user.userData._id}`
                  : `${path}/`
              }
              size={isPC ? 80 : 52}
              fgColor="#000000"
            />
            <canvas
              id="TemplateLongPicture"
              ref={canvasRef}
              width={props.width}
              height={props.height + 300}
            />
          </template>
          <div id="picpreview" style={{ width: "95%", margin: "auto" }}>
            <img id="previewimg" alt="Product Images" />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CreateLongPicture;
