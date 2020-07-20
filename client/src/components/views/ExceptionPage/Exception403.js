import React from "react";
import { Result, Button } from "antd";
function Exception403(props) {
  const handleClick = () => {
    props.history.push("/");
  };
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page.您的账户可能已被封禁"
      extra={
        <Button onClick={handleClick} type="primary">
          Back Home
        </Button>
      }
    />
  );
}

export default Exception403;
