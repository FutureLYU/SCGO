import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Tag } from "antd";
import FileUpload from './FileUpload';

const { TextArea } = Input;

function ContactAddForm(props) {
    const [WeChat, setWeChat] = useState("")
    const [Email, setEmail] = useState("")
    const [Phone, setPhone] = useState("")

    useEffect(() => {
        if (props.contact) {
            setWeChat(props.contact.wechat);
            setEmail(props.contact.email);
            setPhone(props.contact.phone);
        }    
    }, [props.visible])

    // Product Form Update
    const onWeChatChange = (event) => { setWeChat(event.currentTarget.value) };
    const onEmailChange = (event) => { setEmail(event.currentTarget.value) };
    const onPhoneChange = (event) => { setPhone(event.currentTarget.value) };
    const setDefault = () => {
        setWeChat("");
        setEmail("");
        setPhone("");
    }

    const handleOk = () => {
        if (!WeChat && !Email && !Phone) {
            return alert("fill at least one of the contact way");
        }

        const contact = {
            wechat: WeChat,
            email: Email,
            phone: Phone
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
                <Form>
                    <label>WeChat: </label>
                    <Input onChange={onWeChatChange} value={WeChat} />
                    <br /><br />
                    <label>Email: </label>
                    <Input onChange={onEmailChange} value={Email} />
                    <br /><br />
                    <label>Phone: </label>
                    <Input onChange={onPhoneChange} value={Phone} />
                    <br /><br />
                </Form>
            </Modal>
        </div>
    )
}

export default ContactAddForm
