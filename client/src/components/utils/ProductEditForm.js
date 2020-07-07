import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Tag } from "antd";
import FileUpload from './FileUpload';

const { TextArea } = Input;
const { CheckableTag } = Tag;

const placesData = ["Lorenzo", "Gateway", "K-town", "Downtown", "West of USC", "USC", "Delivery", "Others"];
const categoryData = [
    { key: 1, value: "Commodity" }, 
    { key: 2, value: "Electronics"}, 
    { key: 3, value: "Furniture"}, 
    { key: 4, value: "Food & Drinks"}, 
    { key: 5, value: "Clothes / Bags / Shoes"},
    { key: 6, value: "Makeup / Skin Care Products"},
    { key: 7, value: "Others"}
]

function ProductEditForm(props) {
    const [TitleValue, setTitleValue] = useState("");
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [PriceValue, setPriceValue] = useState(0);
    const [PlaceValue, setPlaceValue] = useState([]);
    const [Category, setCategory] = useState(1)
    const [Images, setImages] = useState([]);
    const [Heights, setHeights] = useState([]);

    useEffect(() => {
        if (props.edit) {
            setTitleValue(props.currentItem.title);
            setDescriptionValue(props.currentItem.description);
            setPriceValue(props.currentItem.price);
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
    const onPlaceChange = (place, checked) => {
        const selectedPlaces = [...PlaceValue];
        const nextSelectedPlaces = checked ? [...selectedPlaces, place]:selectedPlaces.filter((t) => t !== place);
        setPlaceValue(nextSelectedPlaces);
    };
    const onCategoryChange = (event) => { setCategory(event.currentTarget.value) }
    const updateImages = (newImages, newHeights) => {
        setImages(newImages);
        setHeights(newHeights);
    };

    const setDefault = () => {
        setTitleValue("");
        setDescriptionValue("");
        setPriceValue(0);
        setPlaceValue([]);
        setCategory(1);
        setImages([]);
        setHeights([]);
    }

    const handleOk = () => {
        if (!TitleValue || !DescriptionValue || !PriceValue || !Images.length) {
            return alert("fill all the fields first!");
        }

        const currentItem = {
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            heights: Heights,
            places: PlaceValue,
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
            
                    <label>Place of Transaction: </label><br />
                    {placesData.map((place) => (
                        <CheckableTag
                            key={place}
                            checked={PlaceValue.indexOf(place) > -1}
                            onChange={(checked) => onPlaceChange(place, checked)}
                        >
                            {place}
                        </CheckableTag>
                    ))}
                    <br /><br />
                    <label>Category: </label><br />
                    <select onChange={onCategoryChange} value={Category}>
                        {categoryData.map(item => (
                            <option key={item.key} value={item.key}>{item.value} </option>
                        ))}
                    </select>
                    <br /><br />
                </Form>
            </Modal>
        </div>
    )
}

export default ProductEditForm
