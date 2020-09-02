import React, { useState } from 'react'
import { Input, Modal, Select } from "antd";

const { Option } = Select;

function ContactAddForm(props) {
    const [Contact, setContact] = useState("");
    const [ContactChoice, setContactChoice] = useState("WeChat");
    const contactmeans = ["WeChat", "Snapchat", "Facebook", "What's App", "Email"];

    // Product Form Update
    const onContactChange = (event) => { setContact(event.currentTarget.value) };
    const onContactChoiceChange = (value) => { setContactChoice(value) };
    const setDefault = () => {
        setContact("");
        setContactChoice("WeChat");
    }

    const handleOk = () => {
        if (!Contact) {
            return alert("Fill one of the contact means!");
        }

        const contact = {
            contact: Contact,
            contactchoice: ContactChoice,
        }
        
        props.handleOk(contact);
        setDefault();
    }

    const handleCancel = () => {
        props.handleCancel();
        setDefault();
    }

    return (
        <div style={{ maxWidth: document.documentElement.clientWidth*0.95 }}>
            <Modal
                title="Add Contact"
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <p>Please provide your contact information:</p>
                <Select style={{ width: 120 }} onChange={onContactChoiceChange} value={ContactChoice}>
                    { contactmeans.map( contactmean => (
                        <Option key={contactmean} value={contactmean}>{contactmean}</Option>
                    ))}
                </Select>&nbsp;&nbsp;&nbsp;
                <Input style={{ width: 170}} onChange={onContactChange} value={Contact} />
            </Modal>
        </div>
    )
}

export default ContactAddForm
