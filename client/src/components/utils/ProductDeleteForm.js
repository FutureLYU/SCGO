import React, { useEffect, useState } from 'react'
import { Form, Modal, Select } from "antd";
import { reasonsData } from "./Data";

const { Option } = Select;

function ProductDeleteForm(props) {
    const [ReasonValue, setReasonValue] = useState("已出售");
    const onReasonChange = (value) => { setReasonValue(value) };

    const handleOk = () => {
        const reason = {
            reason: ReasonValue
        }

        props.handleOk(reason);
        setReasonValue("");
    }

    const handleCancel = () => {
        props.handleCancel();
        setReasonValue("");
    }

    return (
        <div>
            <Modal
                title="Product"
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Form>
                    <label>下架原因:</label>&nbsp;
                    <Select
                        style={{ width: 200 }}
                        placeholder
                        onChange={onReasonChange}
                        value={ReasonValue}
                    >
                        {reasonsData.map((reason) => <Option value={reason.value}>{reason.value}</Option>)}
                    </Select>
                    <br /><br />
                </Form>
            </Modal>
        </div>
    )
}

export default ProductDeleteForm
