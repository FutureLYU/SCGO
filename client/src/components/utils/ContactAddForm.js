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
    }, [props])

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
        if ((ContactChoice === 0 && !WeChat) || (ContactChoice===1 && !Email)) {
            return alert("fill one of the contact way");
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
                        希望买家直接通过微信联系我<br />
                        微信: { 
                        ContactChoice === 0 ? 
                        <Input onChange={onWeChatChange} value={WeChat} /> : 
                        <Input onChange={onWeChatChange} value={WeChat} disabled /> 
                        }
                    </Radio><br /><br />
                    <Radio value={1}>
                        希望买家通过其他方式联系我<br />
                        其他: { 
                        ContactChoice === 1 ? 
                        <Input onChange={onEmailChange} value={Email} /> :
                        <Input onChange={onEmailChange} value={Email} disabled />}
                    </Radio>
                </Radio.Group>
            </Modal>
        </div>
    )
}

export default ContactAddForm
