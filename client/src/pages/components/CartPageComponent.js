import { Alert, Button, Col, Container,  ListGroup, Row } from "react-bootstrap"
import { Link } from "react-router-dom";
import { CartItemComponent } from "../../components/CartItemComponent";



export const CartPageComponent = ({add_to_cart,dispatch,cartItems,cartSubtotal,delete_from_cart}) => {
   
    const changeCount=(productId,quantity)=>{
        dispatch(add_to_cart(productId,quantity));
    }

    const deleteCartItem=(productId,quantity,price)=>{
        if(window.confirm("Are you sure?")){
            dispatch(delete_from_cart(productId,quantity,price));
        }
       
    }
   
    return (
        <>
            <Container>
                <Row className="mt-3">
                    <Col md={8}>
                        <h1>
                            Shopping Cart
                        </h1>
                        {
                           cartItems.length!==0?cartItems.map((item,idx) => {
                                return (
                                    <>
                                        <ListGroup variant="flush" className="d-flex flex-row p-2 align-items-center">
                                            <CartItemComponent changeCount={changeCount} key={idx} orderItem={item} deleteCartItem={deleteCartItem}/>
                                        </ListGroup>
                                    </>
                                )
                            }):<><Alert >Your cart is empty</Alert></>
                        }

                    </Col>
                    <Col md={4}>
                        <ListGroup>
                            <ListGroup.Item><h3>Subtotal ({cartItems.length} {cartItems.length===1?"Product":"Prodcuts"})</h3></ListGroup.Item>
                            <ListGroup.Item>{cartSubtotal}</ListGroup.Item>
                            <ListGroup.Item><Link to="/user/cart-details">
                                <Button disabled={cartItems.length===0} variant="primary">Proceed to Checkout</Button>
                            </Link></ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    )
}