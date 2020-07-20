import React from "react";
import { Result, Button } from "antd";
function Exception404(props) {
  const handleClick = () => {
    props.history.push("/");
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist..您查找的商品可能已下架"
      extra={
        <Button onClick={handleClick} type="primary">
          Back Home
        </Button>
      }
    />
  );
}

export default Exception404;
