import { Alert, Col, Container, Row } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { Card } from "react-bootstrap";
import { ListGroup, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AddToCartMessageComponent } from "../../components/AddToCartMessageComponent.js";
import Image from "react-bootstrap/Image";
import ImageZoom from "js-image-zoom";
import { useParams } from "react-router-dom";
import { useRef } from "react";

export const ProductsDetailsPageComponent = ({ fetchProduct, dispatch, addToCartReduxAction, postReview }) => {
    const [validated, setValidated] = useState(false);
    const [product, setProduct] = useState(null);
    const { productId } = useParams();
    const [isCart, setIsCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loggedIn, setIsloggedIn] = useState(false);
    const [error, setError] = useState("");
    const [productReviewed,setProuctReviewed]=useState(false);

    const messagesEndRef=useRef(null);

    const loggedinUser = localStorage.getItem("userInfo") ? localStorage.getItem("userInfo") : sessionStorage.getItem("userInfo");

    const handleCart = () => {
        setIsCart(true);
        dispatch(addToCartReduxAction(productId, quantity));
    }

    useEffect(() => {
        fetchProduct().then((res) => {
            setProduct(res.product);
        }).catch((er) => {
            console.log(er.response.data.message ? er.response.data.message : er.response.data);
        });

        if (product) {
            var options = {
                width: 400,
                height: 200,
                zoomWidth: 600,
                scale: 2,
                offset: { vertical: 0, horizontal: 10 }
            };

            product.images.map((item, _id) => {
                return (new ImageZoom(document.getElementById(_id + 1), options))
            })
        }
        if (loggedinUser) {
            setIsloggedIn(true);
        }
    }, [productId,productReviewed]);

    useEffect(()=>{
        
        if(productReviewed || error){
            setTimeout(()=>{
                messagesEndRef.current.scrollIntoView({behavior:"smooth"});
            },200)
        }
    },[productReviewed,error])

    const handleSubmit = (e) => {

        e.preventDefault();
        const form = e.currentTarget.elements;
        const formInputs = {
            rating: form.rating.value,
            comment: form.comment.value
        }

        if (e.currentTarget.checkValidity() == true) {
            postReview(formInputs).then((data) => {
                if(data="review created"){
                    setProuctReviewed("Your review got added successfully !");
                }
            }).catch((err) => {
                if (err.response.data == "All inputs are required" || err.response.data == "product already reviewed") {
                    setError(err.response.data);
                    setInterval(() => {
                        setError("");
                    }, 5000)
                }
            })
        }
        setValidated(true);
    }

    if (!product) {
        return (
            <><div>loading....</div></>
        )
    }

    return (
        <>
            <Container>
                {
                    <AddToCartMessageComponent isCart={isCart} setIsCart={setIsCart} />
                }
                <Row className="mt-5">
                    <Col md={4} style={{ zIndex: 1 }}>
                        {
                            product.images.map((item, _idx) => {
                                return (
                                    <>
                                        <div id={_idx + 1}>
                                            <Image fluid src={item.path} className="p-2" style={{ height: "200px", width: "100%", objectFit: "cotain !important", }} />
                                        </div>
                                    </>
                                )
                            })
                        }
                    </Col>
                    <Col md={8} >
                        <Row>
                            <Col sm={8}>
                                <Card.Body>
                                    <Card.Title><h1>{product.name}</h1></Card.Title>
                                    <Card.Text>
                                        {product.description}
                                    </Card.Text>
                                    <Card.Text>
                                        <Rating readonly size={20} initialValue={product.rating} />({product.reviewsNumber})
                                    </Card.Text>
                                    <Card.Text className="h4">
                                        {product.price}
                                    </Card.Text>
                                    <Card.Text>
                                        Product Description :{product.description}
                                    </Card.Text>
                                </Card.Body>
                            </Col>
                            <Col sm={4}>
                                <ListGroup >
                                    <ListGroup.Item className='mb-3 mt-3'>Status : {product.count > 0 ? ("Product in stock") : ("Out of stock")}</ListGroup.Item>
                                    <ListGroup.Item>Price: <span>{quantity * product.price}</span></ListGroup.Item>
                                    <ListGroup.Item>Quantity :  <Form.Select value={quantity} onChange={(e) => setQuantity(e.target.value)} aria-label="Default select example">
                                        <option>choose</option>
                                        {Array.from({ length: product.count }).map((item, _idx) => {
                                            return (<><option key={_idx} value={_idx + 1}>{_idx + 1}</option></>)
                                        })}
                                    </Form.Select></ListGroup.Item>
                                    <ListGroup.Item>
                                        <Button variant="danger" onClick={handleCart}>Add to cart</Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                        <Row className="py-4">
                            <Col>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><h1>REVIEWS</h1></ListGroup.Item>
                                    {
                                        product.reviews.map((item, idx) => {
                                            return (
                                                <>
                                                    <ListGroup.Item key={idx}>
                                                        {item.user.name}
                                                        <br />
                                                        <Rating readonly size={20} initialValue={item.rating} />
                                                        <br />
                                                        {item.updatedAt}
                                                        <br />
                                                        Review: {item.comment}
                                                    </ListGroup.Item>
                                                </>
                                            )
                                        })
                                    }
                                </ListGroup>
                                <div ref={messagesEndRef}></div>
                            </Col>
                        </Row>
                        <hr />
                        <Alert variant="danger" show={!loggedIn}>Login first to write a review</Alert>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleFrom.ControlTextarea1"  >
                                <Form.Label>
                                    Write a review
                                </Form.Label>
                                <Form.Control as="textarea" rows={3} name="comment" required disabled={!loggedIn} />
                            </Form.Group>

                            <Form.Select aria-label="Default select example" name="rating" required disabled={!loggedIn}>
                                <option value="">Your rating</option>
                                <option value="5">5 (very good)</option>
                                <option value="4">4 (good)</option>
                                <option value="3">3 (average)</option>
                                <option value="2">2 (bad)</option>
                                <option value="1">1 (awful)</option>
                            </Form.Select>
                            <Button className="mt-2 mb-2" variant="primary" disabled={!loggedIn} type="submit">Submit</Button>
                        </Form>
                        <Alert variant="danger" show={error ? true : false} >{error}</Alert>
                        <Alert show={productReviewed} variant="success">{productReviewed}</Alert>
                    </Col>
                </Row>
            </Container>
        </>
    )
} 