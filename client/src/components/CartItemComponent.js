import { Image } from "react-bootstrap"
import { Form, Col, Button, Row, ListGroup } from "react-bootstrap"
import { RemoveFromCartComponent } from "./RemoveFromCartComponent.js"

export const CartItemComponent = ({ orderItem, orderCreated = false, changeCount = false, deleteCartItem }) => {

    return (
        <>
            <ListGroup.Item>
                <Row>
                    <Col md={2}>
                        <Image crossOrigin="anonymous" fluid src={orderItem.image ? orderItem.image.path : null} style={{ height: "50px", width: "100%", objectFit: "cover !important", }} />
                    </Col>
                    <Col md={2}>
                        <span>
                            {orderItem.name}
                        </span>
                    </Col>
                    <Col md={2}>
                        {orderItem.price}
                    </Col>
                    <Col md={3}>
                        <Form.Select onChange={changeCount ? (e) => changeCount(orderItem.productId, e.target.value) : undefined} disabled={orderCreated} value={orderItem.quantity}>
                            {
                                Array.from({ length: orderItem.count }).map((item, idx) =>
                                    <option value={idx + 1}>{idx + 1}</option>
                                )
                            }

                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <RemoveFromCartComponent productId={orderItem.productId} orderCreated={orderCreated} quantity={orderItem.quantity} price={orderItem.price} deleteCartItem={deleteCartItem} />

                    </Col>
                </Row>
            </ListGroup.Item>
        </>
    )
}