import { Alert, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const AddToCartMessageComponent = (props) => {
    const navigate=useNavigate();
    const handleCart = () => {
        props.setIsCart(false);
    }
    
    const goBack=()=>{
        navigate(-1);
    }

    return (
        <>
            {
                props.isCart ?
                    <>
                        <Alert variant="success" onClose={handleCart} dismissible>
                            <Alert.Heading>The product was added to your cart!</Alert.Heading>
                            <p>
                                <Button variant="success" onClick={goBack}>Go Back</Button>{" "}
                                <Link to="/cart">
                                    <Button variant="danger">Go To Cart</Button>
                                </Link>
                            </p>
                        </Alert>
                    </> : null
            }

        </>
    )
}