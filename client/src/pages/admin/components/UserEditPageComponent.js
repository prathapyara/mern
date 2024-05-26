import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export const UserEditPageComponent = ({fetchAdmin,updateAdmin}) => {
    const [validated, setValidated] = useState(false);
    const [user,setUser]=useState(null);
    const [userUpdated,setUserUpdated]=useState("");
    
    const navigate=useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        if (event.currentTarget.checkValidity() === true) {
           const updatedData={
            firstName:form.firstName.value,
            lastName:form.lastName.value,
            emailAddress:form.emailAddress.value,
            isAdmin:form.isAdmin.checked
           }

           updateAdmin(updatedData).then((data)=>{
            if(data==="user updated"){
                setUserUpdated("User got updated");
                setTimeout(()=>{
                    navigate("/admin/users")
                },1000)
            }
           })

        }
        setValidated(true);
    };

    useEffect(()=>{
        
        fetchAdmin().then((data)=>{
            setUser(data.msg);
        }).catch((err)=>{
            console.log(err.response.data.message?err.response.data.message:err.response.data);
        })

    },[]);



    if(user===null){
        return (
            <><div>loading...</div></>
        )
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center align-items-start mt-4">
                    <Col md={1} className='m-1'>
                        <LinkContainer to="/admin/users">
                            <Button variant='info'>
                                Go Back
                            </Button>
                        </LinkContainer>

                    </Col>
                    <Col md={6} >
                        <h1>Edit user</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="firstName"
                                    defaultValue={user.firstName}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter First name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicLastName">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="lastName"
                                    defaultValue={user.lastName}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter last name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmailName">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="emailAddress"
                                    defaultValue={user.emailAddress}
                                />
                                <Form.Control.Feedback type='invalid'>Please enter email</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Check
                                    label="Is admin"
                                    name='isAdmin'
                                    checked={user.isAdmin}
                                />

                                <Form.Control.Feedback type='invalid'>Please enter product name</Form.Control.Feedback>
                            </Form.Group>

                            <Button type="submit" >{/*<Spinner animation="border" role="status" size='sm' aria-hidden="true">
                            </Spinner>*/}UPDATE</Button>

                            <Alert variant='primary' show={userUpdated}>
                                {userUpdated}
                            </Alert>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
