import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import Axios from 'axios';
function FileUpload(props) {

    const [Images, setImages] = useState([])
    const [Heights, setHeights] = useState([])
    const [Preview, setPreview] = useState(false)

    useEffect(() => {
        setImages(props.images);
        setHeights(props.heights);
        if (props.images && props.images.length > 0) { setPreview(true) }
    }, [props])

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        //save the Image we chose inside the Node Server 
        Axios.post('/api/product/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([response.data.image]);
                    setHeights([response.data.height]);
                    setPreview(true);
                    props.refreshFunction([response.data.image], [response.data.height]);
                } else {
                    alert('Failed to save the Image in Server')
                }
            })
    }


    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);

        let newImages = [...Images]
        let newHeights = [...Heights]
        newImages.splice(currentIndex, 1);
        newHeights.splice(currentIndex, 1);

        setImages(newImages);
        setHeights(newHeights);
        setPreview(false);
        props.refreshFunction(newImages, newHeights);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            { !Preview ?
                <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={800000000}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{
                            width: '200px', height: '160px', border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '2rem' }} />

                        </div>
                    )}
                </Dropzone> :
                <div style={{ display: 'flex', width: '200px', height: '160px'}}>
                    {Images.map((image, index) => (
                        <div onClick={() => onDelete(image)}>
                            <img 
                                style={{ minWidth: '200px', width: '200px', height: '160px', objectFit: 'contain' }} 
                                src={`http://3.15.2.141/${image}`} alt={`productImg-${index}`} 
                            />
                        </div>
                    ))}
                </div>
            }
            

            
        </div>
    )
}

export default FileUpload
