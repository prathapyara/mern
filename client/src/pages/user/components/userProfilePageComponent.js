import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Alert, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const UserProfilePageComponent = ({ fetchUserProfile, updateUserProfile, dispatch, loggedInUser,localStorage,sessionStorage,userInfo }) => {
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState({});
    const [updateProfileResponseState, setUpdateProfileResponseState] = useState({ success: "", error: "" })
    const [password, setPassword] = useState(false);

    useEffect(() => {
        fetchUserProfile(userInfo.id).then((res) => {
            setUser(res.user);
        }).catch((err) => { console.log(err) })
    }, [])

    const onChange = () => {
        const password = document.querySelector("input[name=password]");
        const confirm = document.querySelector("input[name=Repeatpassword]")
        if (password.value === confirm.value) {
            setPassword(false);
        } else {
            setPassword(true);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget.elements;

        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        const address = form.address.value;
        const city = form.city.value;
        const state = form.state.value;
        const country = form.country.value;
        const zipCode = form.zipCode.value;
        const password = form.password.value;
        const phoneNumber = form.phoneNumber.value;

        if (event.currentTarget.checkValidity() === true && form.password.value === form.Repeatpassword.value) {
            updateUserProfile(firstName, lastName, phoneNumber, address, country, zipCode, city, state, password).then((res) => {
                setUpdateProfileResponseState({ success: res.msg, error: "" });
                dispatch(loggedInUser({doNotLogout:userInfo.doNotLogout, ...res.userUpdated}));
            }).catch((er) => {
                setUpdateProfileResponseState({ success: "", error: er.response.data.message ? er.response.data.message : er.response.data })
            })
        }

        setValidated(true);
    };



    return (
        <>

            <Row className="justify-content-center align-items-center mt-4">
                <Col md={6} >
                    <h1>Change your profile</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} >
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>Your name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="firstName"
                                defaultValue={user.firstName}
                            />
                            <Form.Control.Feedback type='invalid'>Please enter name</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicLastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="lastName"
                                defaultValue={user.lastName}
                            />
                            <Form.Control.Feedback type='invalid'>Please enter Last name</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmailAddress">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                required
                                name="email"
                                disabled
                                value={user.emailAddress}  
                            />
                            <Form.Control.Feedback type='' style={{"opacity":"0.75"}}>you cannnot change the email, you need to create a new account</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="phoneNumber"
                                defaultValue={user.phoneNumber}
                            />
                            <Form.Control.Feedback type='invalid'>Please enter phone number</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={user.address}
                                name="address"
                            />
                            <Form.Control.Feedback type='invalid'>Please enter address</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={user.country}
                                name="country"
                            />
                            <Form.Control.Feedback type='invalid'>Please enter Country</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmailAddresZipCode">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={user.zipCode}
                                name="zipCode"
                            />
                            <Form.Control.Feedback type='invalid'>Please enter Zip Code</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={user.city}
                                name="city"
                            />
                            <Form.Control.Feedback type='invalid'>Please enter city</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicState">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="state"
                                defaultValue={user.state}
                            />
                            <Form.Control.Feedback type='invalid'>Please enter state</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                name="password"
                                minLength={6}
                                onChange={onChange}
                                isInvalid={password}
                            />
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
                                isInvalid={password}
                            />
                            <Form.Control.Feedback type='invalid'>Both passwords should match</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" >Update Profile</Button>
                        <Alert show={updateProfileResponseState.success} variant='success'>{updateProfileResponseState.success}</Alert>
                        <Alert show={updateProfileResponseState.error} variant='danger'>{updateProfileResponseState.error}</Alert>
                    </Form>
                </Col>
            </Row>

        </>
    );
}