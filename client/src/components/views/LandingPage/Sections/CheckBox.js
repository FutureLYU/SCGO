import React, { useState } from 'react'
import { Checkbox, Collapse, Row, Col } from 'antd';

const { Panel } = Collapse


function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {

        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
        //update this checked information into Parent Component 

    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <Col lg={8} xs={24} key={index}>
            <React.Fragment key={index}> 
                <Checkbox
                    key={index}
                    onChange={() => handleToggle(value._id)}
                    type="checkbox"
                    checked={Checked.indexOf(value._id) === -1 ? false : true}
                />&nbsp;&nbsp;
                <span style={{fontSize:"10px"}}>{value.name}</span>
            </React.Fragment>
        </Col>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={props.defaultActiveKey} >
                <Panel header={props.filtername} key={props.keyvalue}>
                    <Row gutter={[4, 4]}>
                        {renderCheckboxLists()}
                    </Row>
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
