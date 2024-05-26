import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Alert, Container, CloseButton, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';

export const AdminCreateProductPageComponent = ({ createProduct, uploadImageApiCall, uploadImagesCloudinaryApiRequest, categories, insertCategory, deleteCategory,saveAttributeCategory }) => {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [attributeTable, setAttributeTable] = useState([]);
    const [images, setImages] = useState(false);
    const [isCreating, setIsCreating] = useState("");
    const [createProductResponseState, setCreateProductResponseState] = useState({ message: "", error: "" });
    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setselectedCategory] = useState("choose category");
    const [selectedAttrKey, setSelectedAttrKey] = useState(null);
    const [productAttributes, setProductAttributes] = useState([]);
    //const [updateProductResponseState, setUpdateProductResponse] = useState({ message: "", error: "" });
    const [newAttributeValue, setNewAttributeValue] = useState(false);
    const [newAttributeKey, setNewAttributeKey] = useState(false);
    // const [isUploading, setIsUploading] = useState("");
    // const [imageUploaded, setImageUploaded] = useState(false);
    const createNewAttrKey = useRef(null);
    const createNewAttrVal = useRef(null);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const productInfo = {
            name: form.name.value,
            description: form.description.value,
            price: form.price.value,
            count: form.countinstock.value,
            category: form.category.value,
            attrs: productAttributes,
            images: images
        }

        //here we are perfoming two cases that is when we can directly store the image in the data base, local storage and other is from cloudinary

        if (event.currentTarget.checkValidity() === true) {
            createProduct(productInfo).then((data) => {
                console.log(data);
                if (images) {
                    if (process.env.NODE_ENV === "production") {
                        uploadImageApiCall(images, data._id).then((data) => {
                        }).catch((err) => setIsCreating(err.response.data.message ? err.response.data.message : err.response.data));
                    } else {
                        uploadImagesCloudinaryApiRequest(images, data._id);
                    }

                }
                return data;
            }).then((data) => {
                setIsCreating("product got created....");
                setTimeout(() => {
                    setIsCreating("");
                    if (data.message === "Product got created") {
                        navigate("/admin/products");
                    }
                }, 2000)
            }).catch((err) => {
                setCreateProductResponseState(err.response.data.message ? err.response.data.message : err.response.data);
            })
        }
        setValidated(true);
    };

    const uploadHandler = (items) => {
        setImages(items);
    }

    const createNewCategory = (e) => {
        setNewCategory(e.target.value);
    }

    const newCategoryHandler = async (e) => {
        if (e.keyCode && e.keyCode === 13 && newCategory) {
            dispatch(insertCategory(newCategory));
            setselectedCategory(newCategory);
            setNewCategory("");
            e.target.value = "";
        }
    }

    const checkKeyDown = (e) => {
        if (e.code === "Enter") e.preventDefault();
    }

    const deleteCategoryHandler = (e) => {
        dispatch(deleteCategory(selectedCategory));
        setselectedCategory("choose category");

    }

    //Attributes 
    //we can wrap all this functions in one place inforder to reduce the reusing of ccode by using the utilsAttribute code but for easy understanding iam not changing but if we want we can do refactoring of the code
 // as both admincreatepagecomponent and admineditpage component has the similar function to work on attributes
    
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
                    console.log(item.key);
                    console.log(newkey);
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

    if (categories === null) {
        return <><div>loading....</div></>
    }

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
                        <h1>Create a new product</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} onKeyDown={(e) => checkKeyDown(e)}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="name"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter product name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicDecription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    required
                                    as="textarea" rows={3}
                                    name="description"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter Description</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCountInStock">
                                <Form.Label>Count in stock</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="countinstock"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter count in stock</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="price"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter count in stock</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>Category
                                    <CloseButton onClick={deleteCategoryHandler} />(<small>remove selected</small>)</Form.Label>
                                <Form.Select required name='category' onChange={(e) => setselectedCategory(e.target.value)} value={selectedCategory}>
                                    <option value="choose category" >choose category</option>
                                    {
                                        categories.map((category, _idx) => {
                                            return (
                                                <option key={_idx} value={category.name} >{category.name}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicNewCategroy">
                                <Form.Label>Or create a new category(e.g:Computer/Laptop/Intel)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="newcategory"
                                    onKeyDown={newCategoryHandler}
                                    onChange={createNewCategory}
                                    disabled={selectedCategory !== "choose category"}
                                />
                            </Form.Group>
                            {
                                newCategory !== "" ? <><Alert variant='primary'>
                                    After typing attribute key and value press enter on one of the field
                                </Alert></> : null
                            }


                            <Form.Group className="mb-3" controlId="formBasicCreateNewCategroy">
                                <Row>
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
                                                                <td ><CloseButton onClick={() => deleteAttribute(item)} /></td>
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
                                            disabled={selectedCategory === "choose category"}
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
                                            disabled={selectedCategory === "choose category" || newAttributeKey === "" ? true : false}
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
                                <Form.Control
                                    onChange={(e) => uploadHandler(e.target.files)}
                                    type='file' multiple />
                            </Form.Group>
                            {
                                isCreating
                            }
                            <Button type="submit" >{/*<Spinner animation="border" role="status" size='sm' aria-hidden="true">
                                </Spinner>*/}Create</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}


