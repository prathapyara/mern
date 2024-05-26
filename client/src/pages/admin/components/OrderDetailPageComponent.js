import { Row, Col, Container, ListGroup, Button, Alert } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { CartItemComponent } from "../../../components/CartItemComponent"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/actions/userAction";

export const OrderDetailPageComponent = ({ getOrder, delivered }) => {

    const dispatch=useDispatch();
    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [orderButtonMessage, setOrderButtonMessage] = useState("Mark as delivered");
    const [cartItem, setCartItem] = useState([]);
    const { id } = useParams();

    const markAsDelivered = async (id) => {
        if (!isDelivered) {
            try {
                const data = await delivered(id);
                if (data) {
                    setIsDelivered(true);
                }
            } catch (err) {
                console.log(err);
            }

        }
    }

    useEffect(() => {
       
            getOrder(id).then((order) => {
                setUserInfo(order.user);
                setPaymentMethod(order.paymentMethod);
                order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false);
                order.isDelivered ? setIsDelivered(order.isDelivered) : setIsDelivered(false);
                setCartSubtotal(order.orderTotal.cartSubtotal);
                if (order.isDelivered) {
                    setOrderButtonMessage("order is finished");
                    setButtonDisabled(true);
                }
                setCartItem(order.cartItem);
            }).catch((er) => dispatch(logoutUser()));
        
    }, [isDelivered, id]);

    console.log(cartItem);

    return (
        <>
            <Container fluid>
                <Row className="mt-4 m-1">
                    <h1>Order Details</h1>
                    <Col md={8}>
                        <br />
                        <Row>
                            <Col md={6}>
                                <h3>Shipping</h3>
                                <b>Name:</b> {userInfo.firstName + " " + userInfo.lastName} <br />
                                <b>Address:</b> {userInfo.address} {userInfo.city} {userInfo.state} {userInfo.zipCode}<br />
                                <b>Phone:</b> {userInfo.phoneNumber}<br />
                            </Col>
                            <Col md={6}>
                                <h3>Payment method</h3>
                                <Form.Select value={paymentMethod} disabled={true}>
                                    <option value="Cash on Delivery(delivery may be delayed)">Cash on Delivery(delivery may be delayed)</option>
                                    <option value="online Payment">Cash on Delivery(delivery may be delayed)</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Cash on Delivery(delivery may be delayed)">Cash on Delivery(delivery may be delayed)</option>
                                </Form.Select>
                            </Col>
                            <Row>
                                <Col md={6}>
                                    <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>{isDelivered ? "Delivered" : "Not Delivered"}</Alert>
                                </Col>
                                <Col md={6}>
                                    <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>{isPaid ? <>Paid on {isPaid}</> : "Not Paid yet"}</Alert>
                                </Col>
                            </Row>
                        </Row>
                        <br />
                        <h2>Order Items</h2>
                        <ListGroup variant="flush">
                            {
                                cartItem.map((orderItem, idx) => (
                                    <CartItemComponent orderItem={orderItem} key={idx} orderCreated={true} />
                                ))
                            }
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <ListGroup>
                            <ListGroup.Item><h3>Order summary</h3></ListGroup.Item>
                            <ListGroup.Item>Items price(after tax) :<b>{cartSubtotal}</b></ListGroup.Item>
                            <ListGroup.Item>Shipping:<b>Included</b></ListGroup.Item>
                            <ListGroup.Item>Tax:<b>Included</b></ListGroup.Item>
                            <ListGroup.Item className="text-danger">Total Price:<b>{cartSubtotal}</b></ListGroup.Item>
                            <ListGroup.Item><div className="d-grid gap-2">
                                <Button variant="danger" type="button" disabled={buttonDisabled} onClick={() => markAsDelivered(id)} >{orderButtonMessage}</Button>
                            </div></ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

