import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const LoginPageComponent = ({ loginUser,dispatch,loggedInUser }) => {
    const [validated, setValidated] = useState(false);
    const [loginUserResponseState, setLoginUserResponseState] = useState({ success: "", error: "", loading: false })

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget.elements;

        const email = form.email.value;
        const password = form.password.value;
        const doNotLogOut = form.checkbox1.checked;

        if (event.currentTarget.checkValidity() === true && email && password) {
            setLoginUserResponseState({ success: "", error: "", loading: true });
            
            loginUser(email, password, doNotLogOut).then((res) => { 
                setLoginUserResponseState({ success: res.success, error: "", loading: false });
               
                if(res.loggedUser){
                    dispatch(loggedInUser(res.loggedUser));
                }

                if(res.success==="user logged in" && !res.loggedUser.isAdmin){
                    window.location.href="/user";
                }else{
                    console.log("i am here");
                    window.location.href="/admin/orders";
                }
                
            }).catch((er) => {
                setLoginUserResponseState({ success: "", error: er.response.data.message ? er.response.data.message : er.response.data, loading: false })
            });
        }
        setValidated(true);
    };

    return (
        <>
            <Container>
                <Row className="justify-content-center align-items-center mt-4">
                    <Col md={6} >
                        <h1>Login</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="formBasicEmailAddressLogin">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter Email</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPasswordLogin">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter password</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckBox">
                                <Form.Check
                                    type='checkbox'
                                    name='checkbox1'
                                    label="Do not logout"></Form.Check>
                            </Form.Group>
                            <Row className='pb-2'>
                                <Col>
                                    Don't you have an account?
                                    <Link to="/register"> Register </Link>
                                </Col>
                            </Row>
                            <Button type="submit" >{(loginUserResponseState && loginUserResponseState.loading === true) ? <Spinner animation="border" role="status" size='sm' aria-hidden="true">
                            </Spinner> : null}Login</Button>
                            <Alert show={loginUserResponseState && loginUserResponseState.error === "wrong credentials"} variant='danger'>Wrong credentials</Alert>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}