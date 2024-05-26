import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

export const RegisterPageComponent = ({registerUser,dispatch,loggedInUser}) => {
    const [validated, setValidated] = useState(false);
    const [registerUserResponse,setRegisterUserResponse]=useState({success:"",error:"",loading:false});
    const [passwordMatchState,setPasswordMatchState]=useState(true);

    const onChange=()=>{
        const password=document.querySelector("input[name=password]");
        const confirmPassword=document.querySelector("input[name=Repeatpassword]");
       
        if(password.value===confirmPassword.value){
            setPasswordMatchState(true);
        }else{
            setPasswordMatchState(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;

        const firstName=form.name.value;
        const lastName=form.Lastname.value;
        const password=form.password.value;
        const emailAddress=form.email.value;

        if (event.currentTarget.checkValidity() === true && firstName && lastName && password && emailAddress && form.password.value===form.Repeatpassword.value) {
            
            setRegisterUserResponse({ success: "", error: "", loading: true });

            registerUser(firstName,lastName,password,emailAddress).then((res)=>{
                setRegisterUserResponse({success:res.msg,error:"",loading:false});
                if(res.newUser){
                    dispatch(loggedInUser(res.newUser));
                }

                if(res.msg==="new user got created"){
                    window.location.href="/user";
                }

                
             }).catch((er)=>{
                 setRegisterUserResponse({success:"",error: er.response.data.message ? er.response.data.message : er.response.data, loading: false})
             });
        }

        setValidated(true);
    };

    return (
        <>
            <Container>
                <Row className="justify-content-center align-items-center mt-4">
                    <Col md={6} >
                        <h1>Register</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label>Your name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    name="name"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicLastName">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter last name"
                                    name="Lastname"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter Last name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmailAddress">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                />
                                <Form.Control.Feedback type='invalid'>Please enter Email</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Enter password"
                                    name="password"
                                    minLength={6}
                                    onChange={onChange}
                                    isValid={!passwordMatchState}
                                />
                                <Form.Text>Password should have at least 6 characters</Form.Text>
                                <Form.Control.Feedback type='invalid'>Please enter password</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
                                <Form.Label>Repeat password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Repeat password"
                                    name="Repeatpassword"
                                    minLength={6}
                                    onChange={onChange}
                                    isInvalid={!passwordMatchState}
                                />
                                <Form.Control.Feedback type='invalid'>Both passwords should match</Form.Control.Feedback>
                            </Form.Group>
                            <Row className='pb-2'>
                                <Col>
                                    Do you have account already?
                                    <Link to="/login"> Login </Link>
                                </Col>
                            </Row>
                            <Button type="submit" >{registerUserResponse.loading?<Spinner animation="border" role="status" size='sm' aria-hidden="true">
                            </Spinner>:null}Submit</Button>
                            {
                                registerUserResponse.error?<Alert variant='danger'>User Alreday Exsit</Alert>:registerUserResponse.success?<Alert variant='success'>User Created</Alert>:null
                            }
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}