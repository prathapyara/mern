import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Alert, Container, CloseButton, Table, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export const AdminEditProductPageComponent = ({ categories, fetchProduct, updateProduct, saveAttributeCategory, uploadImagesApiRequest, deleteImageCall, uploadImagesCloudinaryApiRequest }) => {
    const [validated, setValidated] = useState(false);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const [updateProductResponseState, setUpdateProductResponse] = useState({ message: "", error: "" });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAttrKey, setSelectedAttrKey] = useState(null);
    const [productAttributes, setProductAttributes] = useState([]);
    const [newAttributeValue, setNewAttributeValue] = useState(false);
    const [newAttributeKey, setNewAttributeKey] = useState(false);
    const [productImages, setProductImages] = useState([])
    const [isUploading, setIsUploading] = useState("");
    const [imageUploaded, setImageUploaded] = useState(false);
    const createNewAttrKey = useRef(null);
    const createNewAttrVal = useRef(null);

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;

        const formInputs = {
            name: form.name.value,
            description: form.description.value,
            count: form.countinstock.value,
            price: form.price.value,
            category: form.category.value,
            attrs: productAttributes,
            images: productImages,
        }
        if (event.currentTarget.checkValidity() === true) {
            updateProduct(formInputs, id).then((data) => {
                if (data.message === "Product got updated successfully") {
                    navigate("/admin/products");
                }
            }).catch(err => setUpdateProductResponse({ error: err.response.data.message ? err.response.data.message : err.response.data }));
        }
        setValidated(true);
    };

    useEffect(() => {

        fetchProduct(id).then((product) => {
            setProduct(product.product);
            setSelectedCategory(product.product.category);
            setProductAttributes(product.product.attrs);
            setProductImages(product.product.images);
        }).catch(err => console.log(err));
    }, [id, imageUploaded]);

    const attributeValueSelected = (e) => {
        if (e.target.value !== "choose_key_value") {
            console.log(selectedAttrKey);
            setAttributesWrappper(selectedAttrKey, e.target.value);
        }
    }

    const setAttributesWrappper = (newkey, value) => {
        setProductAttributes((attr) => {
            if (attr.length !== 0) {
                var keyExistsInOldTable = false;
                let modifiedTable = attr.map((item) => {
                    if (item.key === newkey) {
                        item.value = value;
                        keyExistsInOldTable = true;
                        return item;
                    } else {
                        return item;
                    }
                })

                if (keyExistsInOldTable) {
                    return [...modifiedTable];
                } else {
                    return [...modifiedTable, { key: newkey, value: value }];
                }
            } else {
                return [{ key: newkey, value: value }]
            }
        })
    }

    const deleteAttribute = (item) => {

        const updatedAttributes = productAttributes.filter((currentitem) => {
            return currentitem.key !== item.key
        });
        setProductAttributes(updatedAttributes);
    }

    const deleteImage = (item) => {

        deleteImageCall(item.path, id);
        const updatedImage = productImages.filter((currentImage) => {
            return item.path !== currentImage.path;
        });
        setProductImages(updatedImage);
    }

    const checkKeyDown = (e) => {
        if (e.code === "Enter") e.preventDefault();
    }

    const newAttrKeyHandler = (e) => {
        if (e.keyCode && e.keyCode === 13 && newAttributeValue && newAttributeKey) {
            addNewAttributeManually(e);
        } else {
            e.preventDefault();
        }
    }

    const newAttrValueHandler = (e) => {
        e.preventDefault();
        if (e.keyCode && e.keyCode === 13 && newAttributeKey && newAttributeValue) {
            addNewAttributeManually(e);
        }
    }

    const addNewAttributeManually = (e) => {
        setAttributesWrappper(newAttributeKey, newAttributeValue);
        dispatch(saveAttributeCategory(newAttributeKey, newAttributeValue, selectedCategory));
        e.target.value = "";
        createNewAttrKey.current.value = "";
        createNewAttrVal.current.value = "";
        setNewAttributeKey(false);
        setNewAttributeValue(false);
    }

    const uploadHandler = (e) => {
        if (process.env.NODE_ENV==="production") {
            setIsUploading("upload files in progres...")
            uploadImagesApiRequest(e.target.files, id).then((data) => {
                setIsUploading("upload file completed")
                setImageUploaded(!imageUploaded);
            }).catch((er) => setIsUploading(er.response.data.message ? er.response.data.message : er.response.data))
        } else {
            uploadImagesCloudinaryApiRequest(e.target.files, id)
            setIsUploading("upload file complete, wait for the result take effect, refresh the page if neccassry");
            setTimeout(()=>{
                setImageUploaded(!imageUploaded);
            },5000)
        }
    }

    if (product === null) {
        return <div>loading....</div>
    }

    // if (!Array.isArray(categories)) {
    //     return <div>Loading categories...</div>;
    // }

    return (
        <>
            <Container>
                <Row className="justify-content-center align-items-start mt-4">
                    <Col md={1} className='m-1'>
                        <LinkContainer to="/admin/products">
                            <Button variant='info'>
                                Go Back
                            </Button>
                        </LinkContainer>

                    </Col>

                    <Col md={6} >
                        <h1>Edit product</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="name"
                                    defaultValue={product.name}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter product name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicDecription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    required
                                    as="textarea" rows={3}
                                    name="description"
                                    defaultValue={product.description}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter Description</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCountInStock">
                                <Form.Label>Count in stock</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="countinstock"
                                    defaultValue={product.count}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter count in stock</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Price $</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="price"
                                    defaultValue={product.price}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter count in stock</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>Category </Form.Label>
                                <Form.Select required name='category' onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="choose_category">Choose category</option>
                                    {
                                        categories.map((category, _idx) => {
                                            return product.category === category.name ? (
                                                <>
                                                    <option selected value={category.name} key={_idx + 1} >{category.name}</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value={category.name} key={_idx + 1} >{category.name}</option>
                                                </>
                                            )
                                        })
                                    }

                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicCreateNewCategroy">
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Choose attribute and set value</Form.Label>
                                        <Form.Select onChange={(e) => setSelectedAttrKey(e.target.value)}>
                                            <option value="choose_key">choose  key</option>
                                            {
                                                categories.map((category) => {

                                                    if (selectedCategory === category.name) {
                                                        return (
                                                            category.attrs.map((attr) => {
                                                                return <option value={attr.key}>{attr.key}</option>
                                                            })
                                                        )
                                                    }
                                                })
                                            }
                                        </Form.Select>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Attribute Value</Form.Label>
                                        <Form.Select onChange={attributeValueSelected}>
                                            {
                                                selectedAttrKey ? (<option value="choose_key_value">choose Key Value</option>) : <><option><span>please select the key first</span></option></>
                                            }
                                            {
                                                categories.map((category) => {

                                                    if (selectedCategory === category.name) {
                                                        return (
                                                            category.attrs.map((attr) => {
                                                                return (attr.key === selectedAttrKey) ? (attr.value.map((attrValue) => {
                                                                    return (<option value={attrValue}>{attrValue}</option>)
                                                                })) : null
                                                            })
                                                        )
                                                    }
                                                })
                                            }
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>Attribute</th>
                                                <th>Value</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                productAttributes ? productAttributes.map((item, _idx) => {
                                                    return (
                                                        <>
                                                            <tr key={_idx + 1}>
                                                                <td>{item.key}</td>
                                                                <td>{item.value}</td>
                                                                <td onClick={() => deleteAttribute(item)}><CloseButton /></td>
                                                            </tr>
                                                        </>
                                                    )
                                                }) : null
                                            }
                                        </tbody>
                                    </Table>

                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Create new attribute</Form.Label>
                                        <Form.Control
                                            ref={createNewAttrKey}
                                            disabled={selectedCategory === "choose_category"}
                                            placeholder='first choose or create category'
                                            required={newAttributeValue}
                                            name="newAttrValue"
                                            type='text'
                                            onKeyUp={newAttrKeyHandler}
                                            onChange={(e) => setNewAttributeKey(e.target.value)}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Attribute value</Form.Label>
                                        <Form.Control
                                            ref={createNewAttrVal}
                                            disabled={selectedCategory === "choose_category" || newAttributeKey === "" ? true : false}
                                            placeholder='attribute value'
                                            required={newAttributeKey}
                                            name="AttrValue"
                                            type='text'
                                            onKeyUp={newAttrValueHandler}
                                            onChange={(e) => setNewAttributeValue(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Alert variant='primary' show={newAttributeKey && newAttributeValue}>
                                After typing attribute key and value press enter on one of the field
                            </Alert>
                            <Form.Group className="mb-3" controlId="formBasicImages">
                                <Form.Label>Images</Form.Label>
                                <Row>
                                    {
                                        productImages && productImages.map((image, _idx) => (
                                            <Col key={_idx} style={{ position: "relative" }} xs={3}>
                                                <Image
                                                    crossOrigin='anonymous'
                                                    fluid className="ml-2"
                                                    src={image.path ? image.path : null} />
                                                <i onClick={() => deleteImage(image)} style={{ position: "absolute", cursor: "pointer", left: "5px", top: "-12px", transform: "scale(1.5)" }} className="bi bi-x-lg text-danger"></i>
                                            </Col>
                                        ))
                                    }

                                </Row>

                                <Form.Control
                                    required type='file' multiple style={{ padding: "5px" }} onChange={uploadHandler} />
                                {isUploading}
                            </Form.Group>
                            <Button type="submit" >{/*<Spinner animation="border" role="status" size='sm' aria-hidden="true">
                                </Spinner>*/}UPDATE</Button>
                            {
                                updateProductResponseState.error ? (<div>{updateProductResponseState}</div>) : null
                            }
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}


