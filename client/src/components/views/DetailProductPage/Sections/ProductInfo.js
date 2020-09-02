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
                tagname = tag.value;
            }
            return null;
        })
        return tagname;
    }

    const getCategoryByKey = (key) => {
        let categoryname = "None";
        categoryData.map((category) => {
            if (category.key === key) {
                categoryname = category.value;
            }
            return null;
        })
        return categoryname;
    }

    return (
        <div>
            <Descriptions title="Product Information">
                <Descriptions.Item label="Price"> {Product.price}</Descriptions.Item>
                <Descriptions.Item label="Category"> {getCategoryByKey(Product.category)}</Descriptions.Item>
                <Descriptions.Item label="Transaction"> {getTagByKey(Product.tag)}</Descriptions.Item>
                <Descriptions.Item label="Description"> {Product.description}</Descriptions.Item>
            </Descriptions>
            <br /><br /><br />
        </div>
    )
}

export default ProductInfo
