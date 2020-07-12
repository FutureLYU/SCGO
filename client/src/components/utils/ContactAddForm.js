import React, { useEffect, useState } from 'react'
import { Input, Modal, Radio} from "antd";

function ContactAddForm(props) {
    const [WeChat, setWeChat] = useState("");
    const [Email, setEmail] = useState("");
    const [ContactChoice, setContactChoice] = useState(0);

    useEffect(() => {
        if (props.user.userData) {
            setEmail(props.user.userData.email);
        }
        if (props.contact) {
            setWeChat(props.contact.wechat);
            setEmail(props.contact.email);
            setContactChoice(props.contact.contactchoice);
        }    
    }, [props.visible])

    // Product Form Update
    const onWeChatChange = (event) => { setWeChat(event.currentTarget.value) };
    const onEmailChange = (event) => { setEmail(event.currentTarget.value) };
    const onContactChange = (event) => { 
        setContactChoice(event.target.value) 
    };
    const setDefault = () => {
        setWeChat("");
        setEmail(props.user.userData.email);
        setContactChoice(0);
    }

    const handleOk = () => {
        if (!WeChat && !Email) {
            return alert("fill at least one of the contact way");
        }

        const contact = {
            wechat: WeChat,
            email: Email,
            contactchoice: ContactChoice
        }
        
        props.handleOk(contact);
        setDefault();
    }

    const handleCancel = () => {
        props.handleCancel();
        setDefault();
    }

    return (
        <div>
            <Modal
                title="Add Contact"
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Radio.Group onChange={onContactChange} value={ContactChoice}>
                    <Radio value={0}>
                        将买家信息通过邮箱告诉我<br />
                        Email: { 
                        ContactChoice === 0 ? 
                        <Input onChange={onEmailChange} value={Email} /> : 
                        <Input onChange={onEmailChange} value={Email} disabled /> 
                        }
                    </Radio><br /><br />
                    <Radio value={1}>
                        将我的信息直接展示给买家<br />
                        WeChat: { 
                        ContactChoice === 1 ? 
                        <Input onChange={onWeChatChange} value={WeChat} /> :
                        <Input onChange={onWeChatChange} value={WeChat} disabled />}
                    </Radio>
                </Radio.Group>
            </Modal>
        </div>
    )
}

export default ContactAddForm
