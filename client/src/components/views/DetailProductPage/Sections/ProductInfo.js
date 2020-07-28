import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import { tagsData, categoryData } from '../../../utils/Data'

function ProductInfo(props) {

    const [Product, setProduct] = useState({})

    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail])

    const getTagByKey = (key) => {
        let tagname = "None";
        tagsData.map((tag) => {
            if (tag.key === key) {
                tagname = tag.value
            }
            return
        })
        return tagname
    }

    const getCategoryByKey = (key) => {
        let categoryname = "None";
        categoryData.map((category) => {
            if (category.key === key) {
                categoryname = category.value
            }
            return
        })
        return categoryname
    }

    return (
        <div>
            <Descriptions title="商品详情">
                <Descriptions.Item label="价格"> {Product.price}</Descriptions.Item>
                <Descriptions.Item label="商品类别"> {getCategoryByKey(Product.category)}</Descriptions.Item>
                <Descriptions.Item label="交易方式"> {getTagByKey(Product.tag)}</Descriptions.Item>
                <Descriptions.Item label="商品描述"> {Product.description}</Descriptions.Item>
            </Descriptions>
            <br /><br /><br />
        </div>
    )
}

export default ProductInfo
