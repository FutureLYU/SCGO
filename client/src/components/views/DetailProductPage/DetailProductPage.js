import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col, Button, Modal, Input } from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { useDispatch } from 'react-redux';

function DetailProductPage(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.productId
    const [Product, setProduct] = useState([])
    const [ContactForm, setContactForm] = useState({ visible: false })
    const [WeChat, setWeChat] = useState("")

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })

    }, [])


    const onWeChatChange = (event) => { setWeChat(event.currentTarget.value) };
    const showContact = () => { setContactForm({ ...ContactForm, visible: true }) };

    const handleOk = () => {
        // send value & show success?
        if (Product.contactchoice === 0 && WeChat === "") {
            return alert("请输入您的联系方式！")
        }

        if (Product.contactchoice === 0 && WeChat != "") {
            // 发送邮件给卖家
        }

        setContactForm({
            ...ContactForm,
            visible: false
        })
    }

    const handleCancel = () => {
        setContactForm({
            ...ContactForm,
            visible: false
        })
    }

    return (
        <div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                <Col lg={12} xs={24}>
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} xs={24}>
                    <ProductInfo detail={Product} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button size="large" shape="round" type="danger"
                            onClick={showContact}
                        >
                            联系卖家
                        </Button>
                    </div>
                </Col>
            </Row>

            <Modal
                title="Show Contact"
                visible={ContactForm.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                { Product.contactchoice === 0 ?
                <div>
                    <p>卖家暂未提供联系方式，您可以在下方输入您的联系方式，系统将自动发送给卖家。</p>
                    <Input onChange={onWeChatChange} value={WeChat} />
                </div> :
                <div>
                    <p>卖家的微信号为{Product.wechat}，您可以添加微信联系卖家。</p>
                </div>
                }
            </Modal>
        </div>
    )
}

export default DetailProductPage
