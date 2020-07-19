import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col, Button, Modal, Input } from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { useDispatch } from 'react-redux';

function DetailProductPage(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})
    const [ContactForm, setContactForm] = useState({ visible: false })

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0]);
            })

    }, [])

    const showContact = () => { setContactForm({ ...ContactForm, visible: true }) };
    const handleOk = () => { setContactForm({ ...ContactForm, visible: false }) };
    const handleCancel = () => { setContactForm({ ...ContactForm, visible: false }) };

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
                        <Button size="large" shape="round" type="danger" style={{ margin: '1em 1em' }}
                            onClick={showContact}
                        >
                            点击联系卖家
                        </Button>
                        <a href={`/user/${Product.writer ? Product.writer._id:''}`}>
                            <Button size="large" shape="round" type="danger" style={{ margin: '1em 1em' }}
                                onClick={showContact}
                            >
                                查看卖家商品
                            </Button>
                        </a>
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
                    <p>卖家的微信号为{Product.wechat}，您可以添加微信联系卖家。</p>
                </div> :
                <div>
                    <p>卖家的其他联系方式为{Product.email}，您可以通过该联系方式联系卖家。</p>
                </div>
                }
            </Modal>
        </div>
    )
}

export default DetailProductPage
