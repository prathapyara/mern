import { Row, Col, Container, ListGroup, Button, Alert } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { CartItemComponent } from "../../../components/CartItemComponent"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const UserCartDetailsPageComponent = ({ cartItems, userInfo, itemsCount, cartSubTotal, dispatch, add_to_cart, delete_from_cart, fetchUser,createOrder}) => {
    const navigate=useNavigate();
    const [user, setUser] = useState({});
    const [buttonDisabled,setButtonDisbled]=useState(false);
    const [missingAddress,setMissingAddress]=useState("");
    const [paymentMethod,setPaymentMethod]=useState("Cash on Delivery(delivery may be delayed)");

    const changeCount = (productId, quantity) => {
        dispatch(add_to_cart(productId, quantity));
    }

    const deleteCartItem = (productId, quantity, price) => {
        if (window.confirm("Are you sure?")) {
            dispatch(delete_from_cart(productId, quantity, price));
        }
    }

    useEffect(() => {
        fetchUser().then((res) => {
            if(!res.user.address || !res.user.phoneNumber || !res.user.zipCode || !res.user.country || !res.user.state){
                setButtonDisbled(true);
                setMissingAddress(" .In order to make order you should have any of the profile with correct address,city etc...");
            }else{
                setUser(res.user);
                setButtonDisbled(false);
            }
        }).catch((err) => console.log(err));
       
    },[]);

    const paymentMode=(e)=>{
        setPaymentMethod(e.target.value);
    }

    const orderHandler=()=>{
        const orderItem={
            orderTotal:{
                itemsCount:itemsCount,
                cartSubtotal:cartSubTotal,
            },
            cartItem:cartItems.map((item)=>{
                return {
                    productId:item.productId,
                    name:item.name,
                    price:item.price,
                    image:{path:item.image?(item.image.path??null):null},
                    quantity:item.quantity,
                    count:item.count
                }
            }),
            paymentMethod:paymentMethod,
            
        }

        if(orderItem){
            createOrder(orderItem).then((res)=>{
                if(res){
                    navigate("/user/order-details/" + res.order._id);
                }
            })
        }

        cartItems.forEach((item)=>{
            return dispatch(delete_from_cart(item.productId, item.quantity, item.price))
        })
    }

    return (
        <>
            <Container fluid>
                <Row className="mt-4 m-1">
                    <h1>Cart Details</h1>
                    <Col md={8}>
                        <br />
                        <Row>
                            <Col md={6}>
                                <h3>Shipping</h3>
                                <b>Name:</b> {user.firstName} {user.lastName}<br />
                                <b>Address:</b>{user.address} {user.country} {user.state} {user.zipCode}<br />
                                <b>Phone:</b> {user.phoneNumber} <br />
                            </Col>
                            <Col md={6}>
                                <h3>Payment method</h3>
                                <Form.Select onChange={paymentMode}>
                                    <option value="Cash on Delivery(delivery may be delayed)">Cash on Delivery(delivery may be delayed)</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="phonePay">Phonepay</option>
                                    <option value="internet banking">internet banking</option>
                                </Form.Select>
                            </Col>
                            <Row>
                                <Col md={6}>
                                    <Alert className="mt-3" variant="danger" >Not delivered {missingAddress}</Alert>
                                </Col>
                                <Col md={6}>
                                    <Alert className="mt-3" variant="danger">Not paid yet</Alert>
                                </Col>
                            </Row>
                        </Row>
                        <br />
                        <h2>Order Items</h2>
                        <ListGroup variant="flush">
                            {
                                cartItems.map((item, idx) => (
                                    <CartItemComponent changeCount={changeCount} deleteCartItem={deleteCartItem} key={idx} orderItem={item} />
                                ))
                            }
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <ListGroup>
                            <ListGroup.Item><h3>Order summary</h3></ListGroup.Item>
                            <ListGroup.Item>Items price(after tax) :<b>${cartSubTotal}</b></ListGroup.Item>
                            <ListGroup.Item>Shipping:<b>Included</b></ListGroup.Item>
                            <ListGroup.Item>Tax:<b>Included</b></ListGroup.Item>
                            <ListGroup.Item className="text-danger">Total Price:<b>${cartSubTotal}</b></ListGroup.Item>
                            <ListGroup.Item><div className="d-grid gap-2">
                                <Button variant="danger" disabled={buttonDisabled} onClick={orderHandler}>Place your order</Button>
                            </div></ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    )
}