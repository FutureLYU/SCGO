import React from 'react'
import { Card, Avatar} from 'antd';

const { Meta } = Card;

function ContactUsPage() {
    return (
        <div
            style={{
                height: "100%",
                width: "50%",
                margin: "2rem auto",
                overflow: "hidden",
                background: "white"
            }}
        >
            <h1>Contact Us</h1>
            <Card style={{ width: "100%", height: "160px", marginTop: 16 }} bordered={false}>
                <Meta
                    avatar={
                        <Avatar size={100} src="http://localhost:5000/pic/default-thumb.png" />
                    }
                    title="SCGO Group"
                    description="Email: haimeiyoujian@scgo.org"
                />
            </Card>
            <hr />
            <h1>Contributor</h1>
            <Card style={{ width: "100%", height: "160px", marginTop: 16 }} bordered={false}>
                <Meta
                    avatar={
                        <Avatar size={100} src="http://localhost:5000/pic/default-thumb.png" />
                    }
                    title="Hanxi"
                    description="Email: haimeiyoujian@scgo.org"
                />
            </Card>
            <Card style={{ width: "100%", height: "160px", marginTop: 16 }} bordered={false}>
                <Meta
                    avatar={
                        <Avatar size={100} src="http://localhost:5000/pic/default-thumb.png" />
                    }
                    title="Harold"
                    description="Email: haimeiyoujian@scgo.org"
                />
            </Card>
            
        </div>
    )
}

export default ContactUsPage
