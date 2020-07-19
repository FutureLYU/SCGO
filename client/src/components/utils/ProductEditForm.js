import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Select, Radio } from "antd";
import FileUpload from './FileUpload';
import { placesData, categoryData, meansData } from "./Data";

const { TextArea } = Input;
const { Option } = Select;

function ProductEditForm(props) {
    const [TitleValue, setTitleValue] = useState("");
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [PriceValue, setPriceValue] = useState(0);
    const [Means, setMeans] = useState(0)
    const [PlaceValue, setPlaceValue] = useState(-1);
    const [Category, setCategory] = useState(0)
    const [Images, setImages] = useState([]);
    const [Heights, setHeights] = useState([]);

    useEffect(() => {
        if (props.edit) {
            setTitleValue(props.currentItem.title);
            setDescriptionValue(props.currentItem.description);
            setPriceValue(props.currentItem.price);
            setMeans(props.currentItem.means)
            setPlaceValue(props.currentItem.places);
            setCategory(props.currentItem.category)
            setImages(props.currentItem.images);
            setHeights(props.currentItem.heights);
        }
        
    }, [props.visible])

    // Product Form Update
    const onTitleChange = (event) => {
        if (event.currentTarget.value.length < 16) {
            setTitleValue(event.currentTarget.value) 
        }
    };
    const onDescriptionChange = (event) => { setDescriptionValue(event.currentTarget.value) };
    const onPriceChange = (event) => { setPriceValue(event.currentTarget.value) };
    const onMeansChange = (event) => { setMeans(event.target.value) };
    const onPlaceChange = (value) => { setPlaceValue(value) };
    const onCategoryChange = (value) => { setCategory(value) };
    const updateImages = (newImages, newHeights) => {
        setImages(newImages);
        setHeights(newHeights);
    };

    const setDefault = () => {
        setTitleValue("");
        setDescriptionValue("");
        setPriceValue(0);
        setMeans(0);
        setPlaceValue(-1);
        setCategory(0);
        setImages([]);
        setHeights([]);
    }

    const getTagValue = (means, places) => {
        return means === 0 ? places : means + 5
    }

    const handleOk = () => {
        if (!TitleValue || !DescriptionValue || !PriceValue || !Images.length) {
            return alert("fill all the fields first!");
        }

        if (Means === 0 && PlaceValue === -1) {
            return alert("至少选择一个自取地点！")
        }

        const currentItem = {
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            heights: Heights,
            means: Means,
            places: PlaceValue,
            tag: getTagValue(Means, PlaceValue),
            category: Category
        }

        props.handleOk(currentItem);
        setDefault();
    }

    const handleCancel = () => {
        props.handleCancel();
        setDefault();
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
                    <FileUpload
                        refreshFunction={updateImages}
                        images={Images}
                        heights={Heights}
                    />
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

                    <label>交易方式:</label>&nbsp;
                    <Radio.Group onChange={onMeansChange} value={Means}>
                        {meansData.map((mean) => <Radio value={mean.key}>{mean.value}</Radio>)}
                    </Radio.Group>
                    <br /><br />

                    <label>自取地点:</label>&nbsp;
                    <Select
                        style={{ width: 200 }}
                        placeholder
                        optionFilterProp="children"
                        onChange={onPlaceChange}
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={PlaceValue != -1? PlaceValue:null}
                        disabled={Means}
                    >
                        {placesData.map((place) => <Option value={place.key}>{place.value}</Option>)}
                    </Select>
                    <br /><br />

                    <label>物品种类:</label>&nbsp;
                    <Select style={{ width: 200 }} onChange={onCategoryChange} value={Category}>
                        {categoryData.map(item => (
                            <Option key={item.key} value={item.key}>{item.value} </Option>
                        ))}
                    </Select>
                    <br /><br />
                </Form>
            </Modal>
        </div>
    )
}

export default ProductEditForm
