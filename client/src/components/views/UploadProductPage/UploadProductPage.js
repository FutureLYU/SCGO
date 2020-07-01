import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon, Col, Row, Card, Modal, Tag } from 'antd';
import FileUpload from '../../utils/FileUpload';
import ImageSlider from '../../utils/ImageSlider';
import Axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { CheckableTag } = Tag;

function UploadProductPage(props) {

    const tagsData = ['Lorenzo', 'Gateway'];
    const [Items, setItems] = useState([])
    const [FormValue, setFormValue] = useState({ visible: false })
    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [TagValue, setTagValue] = useState([])
    const [Images, setImages] = useState([])
    const [Heights, setHeights] = useState([])
    const [Edit, setEdit] = useState(false)
    const [EditIndex, setEditIndex] = useState(-1)


    useEffect(() => {
        Axios.get('/api/users/getUploadProduct')
            .then(response => {
                setItems(response.data.uploadProduct);
            })
    }, [])

    // Product Form Update
    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const onPriceChange = (event) => {
        setPriceValue(event.currentTarget.value)
    }

    const onTagChange = (tag, checked) => {
        const selectedTags = [...TagValue];
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        setTagValue(nextSelectedTags);
      }

    const updateImages = (newImages, newHeights) => {
        setImages(newImages);
        setHeights(newHeights);
    }

    // Button actions
    const onAdd = (event) => {
        // set state of Form Value
        setFormValue({...FormValue, visible: true});
    }

    const onSubmit = (event) => {
        event.preventDefault();

        // submit all items into database
        Axios.post('/api/product/uploadProduct', Items)
            .then(response => {
                if (response.data.success) {
                    // show success & long picture
                    alert('Successfully uploaded')
                } else {
                    // add product name
                    alert('Failed to upload Product!')
                }
            })
        setItems([])

        // update upload product
        Axios.post('/api/users/updateUploadProduct', [])
            .then(response => {
                console.log("Update successfully")
            })
    }

    const onEdit = (index) => {
        // set edit
        setEdit(true)
        setEditIndex(index)

        let currentItem = Items[index]
        setTitleValue(currentItem.title);
        setDescriptionValue(currentItem.description);
        setPriceValue(currentItem.price);
        setTagValue(currentItem.tags);
        setImages(currentItem.images);
        setHeights(currentItem.heights)

        setFormValue({...FormValue, visible: true});
    }

    const onDelete = (index) => {
        // delete
        let newItems = [...Items]
        newItems.splice(index, 1)
        setItems(newItems)

        // update upload product
        Axios.post('/api/users/updateUploadProduct', newItems)
            .then(response => {
                console.log("Update successfully")
            })
    }

    const handleOk = (event) => {
        if (!TitleValue || !DescriptionValue || !PriceValue ||
            !Images.length) {
            return alert('fill all the fields first!')
        }

        if (Images.length != Heights.length) {
            alert('System error: cannot provide long picture because height cannot be acquired')
        }

        // save value into Items
        const newItem = {
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            heights: Heights,
            tags: TagValue,
        }
        let newItems = [...Items]
        if (Edit && EditIndex > -1) {
            newItems[EditIndex] = newItem
            setItems(newItems)
        } else {
            newItems = [...newItems, newItem]
            setItems(newItems);
        }
        
        // set all values to default
        setFormValue({...FormValue, visible: false});
        setTitleValue("");
        setDescriptionValue("");
        setPriceValue(0);
        setTagValue([]);
        setImages([]);
        setHeights([]);
        setEdit(false);
        setEditIndex(-1);

        // update upload product
        Axios.post('/api/users/updateUploadProduct', newItems)
            .then(response => {
                console.log("Update successfully")
            })
    }

    const handleCancel = (event) => {
        // close model
        setFormValue({...FormValue, visible: false});

        // set all values to default
        setTitleValue("");
        setDescriptionValue("");
        setPriceValue(0);
        setTagValue([]);
        setImages([]);
        setHeights([]);
        setEdit(false);
        setEditIndex(-1);
    }

    const renderProductForm = () => {
        return (
            <Form>
                <FileUpload refreshFunction={updateImages} images={Images} heights={Heights} />
                <br /><br />

                <label>Title:</label>
                <Input onChange={onTitleChange} value={TitleValue} />
                <br /><br />

                <label>Description:</label>
                <TextArea onChange={onDescriptionChange} value={DescriptionValue} />
                <br /><br />

                <label>Price($):</label>
                <Input onChange={onPriceChange} value={PriceValue} type="number" />
                <br /><br />

                <label>Tag: </label><br />
                {tagsData.map(tag => (
                    <CheckableTag
                        key={tag}
                        checked={TagValue.indexOf(tag) > -1}
                        onChange={checked => onTagChange(tag, checked)}
                    >
                        {tag}
                    </CheckableTag>
                ))}
                <br /><br />
            </Form>
        )
    }

    const renderItemCards = Items.map((item, index) => {
        return <Col>
            <Card hoverable={false} sytle={{width:'80%'}}>
                <Row gutter={16}>
                    <Col lg={8} xs={24}>
                        <ImageSlider images={item.images} />
                    </Col>
                    <Col lg={12} xs={24}>
                        <p>Title: {item.title}</p>
                        <p>Description: {item.description}</p>
                        <p>Price: {item.price}</p>
                        <p>Tag: {item.tags.map(tag => <Tag>{tag}</Tag>)}</p>
                    </Col>
                    <Col lg={4} xs={24}>
                        <Button style={{width: '100px', margin: '10px auto'}} onClick={()=> onEdit(index)}> Edit </Button>
                        <Button style={{width: '100px', margin: '10px auto'}} onClick={()=> onDelete(index)}> Delete </Button>
                    </Col>
                </Row>
            </Card>
        </Col>
    })

    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            {Items.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div> :
                <div style={{ width: '70%', margin: '3rem auto' }}>
                    <Row gutter={[16, 16]}>
                        {renderItemCards}
                    </Row>
                </div>
            }
            <br /><br />

            {Items.length > 0 ?
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button style={{ width: '100px', margin: '25px' }} onClick={onAdd}>Add</Button>
                    <Button style={{ width: '100px', margin: '25px' }} onClick={onSubmit}>Submit</Button>
                </div> :
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button style={{ width: '100px', margin: 'auto' }} onClick={onAdd}>Add</Button>
                </div> 
            }

            <div>
                <Modal 
                    title="New Product"
                    visible={FormValue.visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    destroyOnClose={true}
                >
                    {renderProductForm()}
                </Modal>
            </div>
        </div>
    )
}

export default UploadProductPage
