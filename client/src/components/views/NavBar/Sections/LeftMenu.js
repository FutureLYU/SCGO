import React from 'react';
import { Menu } from 'antd';

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="contact">
        <a href="/contactus">Contact Us</a>
      </Menu.Item>
    
    </Menu>
  )
}

export default LeftMenu