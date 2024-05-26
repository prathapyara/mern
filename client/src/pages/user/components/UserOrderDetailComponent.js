import { Row, Col, Container, ListGroup, Button, Alert } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { CartItemComponent } from "../../../components/CartItemComponent"
import { useEffect, useState, useRef } from "react"

export const UserOrderDetailComponent = ({ userInfo, fetchUser, fetchOrder, cartItems, loadPayPalScript }) => {

    const [order, setOrder] = useState({});
    const [userAddress, setUserAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [orderButtonMessage, setOrderButtonMessage] = useState("");
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [isDelivered, setIsDelivered] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const paypalContainer = useRef();

    useEffect(() => {
        fetchUser().then((data) => {
            setUserAddress({ address: data.user.address, city: data.user.city, state: data.user.state, zipCode: data.user.zipCode, phoneNumber: data.user.phoneNumber })
        }).catch((err) => console.log(err));

        fetchOrder().then((data) => {
            setOrder(data);
            setPaymentMethod(data.paymentMethod);
            setCartSubtotal(data.orderTotal.cartSubtotal);
            data.isDelivered ? setIsDelivered(data.deliveredAt) : setIsDelivered(false);
            data.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false);
            if (data.isPaid) {
                setOrderButtonMessage("Your order is finished");
                setButtonDisabled(true);
            } else {
                if (data.paymentMethod === "Cash on Delivery(delivery may be delayed)") {
                    setButtonDisabled(true);
                    setOrderButtonMessage("wait for your order.You pay on delivery");
                } else {
                    setOrderButtonMessage("pay for your order");
                }
            }

        }).catch((err) => console.log(err));

    }, []);

    const orderHandler = () => {
        setButtonDisabled(true);
        if (paymentMethod !== "Cash on Delivery(delivery may be delayed)") {
            setOrderButtonMessage("To pay for your order click on one of the buttons below");
            if (!isPaid) {
                loadPayPalScript(order.cartItem, cartSubtotal, updateStateAfterOrder)
            }
        } else {
            setOrderButtonMessage("Your order got placed")
        }
    }

    const updateStateAfterOrder = (paidAt) => {
        setOrderButtonMessage("Thank you for your payment!");
        setIsPaid(paidAt);
        setButtonDisabled(true);
        paypalContainer.current.style = "display :none";
    }

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
                                <b>Name:</b> {userInfo.firstName}<br />
                                <b>Address:</b> {userAddress.address} {userAddress.state}<br />
                                <b>Phone:</b> {userAddress.phoneNumber}<br />
                            </Col>
                            <Col md={6}>
                                <h3>Payment method</h3>
                                <Form.Select disabled={true}>
                                    <option value={paymentMethod}>{paymentMethod}</option>
                                </Form.Select>
                            </Col>
                            <Row>
                                <Col md={6}>
                                    <Alert className="mt-3" variant={isDelivered ? "success" : "danger"}>
                                        {isDelivered ? <>Delivered at {isDelivered}</> : <>Not delivered</>}
                                    </Alert>
                                </Col>
                                <Col md={6}>
                                    <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                                        {isPaid ? <>Paid on {isPaid}</> : <>Not paid yet</>}
                                    </Alert>
                                </Col>
                            </Row>
                        </Row>
                        <br />
                        <h2>Order Items</h2>
                        <ListGroup variant="flush">
                            {
                                order && order.cartItem ? (
                                    order.cartItem.map((item, idx) => (
                                        <CartItemComponent key={idx} orderItem={item} orderCreated={true} />
                                    ))
                                ) : (
                                    <ListGroup.Item>loading....</ListGroup.Item>
                                )
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
                                <Button variant="danger" disabled={buttonDisabled} onClick={orderHandler}>{orderButtonMessage}</Button>
                            </div></ListGroup.Item>
                        </ListGroup>
                        <div style={{ position: "relative", zIndex: 1, paddingTop: "10px" }}><div ref={paypalContainer} id="paypal-buttons-render"></div></div>

                    </Col>
                </Row>
            </Container>
        </>
    )
}