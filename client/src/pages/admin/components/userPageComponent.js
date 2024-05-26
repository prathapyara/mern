import Table from 'react-bootstrap/Table';
import { Button, Col, Container, Row } from 'react-bootstrap';
import AdminLinkComponent from '../../../components/admin/AdminLinkComponent.js';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../../redux/actions/userAction";

export const UserPageComponent = ({ fetchUser, deleteUser }) => {
   const dispatch=useDispatch();
    const [users, setUsers] = useState([]);
    const [userDelete, setUserDelete] = useState(false);

    const deleteHandler = async (userId) => {
        if (window.confirm("Are you sure?")) {
            const data = await deleteUser(userId);
            if (data === "user deleted") {
                setUserDelete(!userDelete);
            }
        };
    }

    useEffect(() => {
        const abctrl = new AbortController();
        fetchUser(abctrl).then((res) => {
            setUsers(res.users);
        }).catch(() =>  
            dispatch(logoutUser())
           );
        return () => abctrl.abort();

    }, [userDelete]);

    return (
        <Container>
            <Row className='mt-5'>
                <Col sm={3}>
                    <AdminLinkComponent />
                </Col>
                <Col sm={9}>
                    <div>
                        <h1>User List</h1>
                    </div>

                    {
                        !users ? <h1>No records</h1> : <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Is Admin</th>
                                        <th>Edit/Delete</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user, idx) => {
                                            return (
                                                <>
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td>{user.firstName}</td>
                                                        <td>{user.lastName}</td>
                                                        <td>{user.emailAddress}</td>
                                                        <td>{!user.isAdmin ? <i className="bi bi-x-lg text-danger"></i> : <i className="bi bi-check-lg text-success"></i>}</td>
                                                        <td><LinkContainer to={`/admin/edit-user/${user._id}`}><Button variant='primary' size='sm'><i className="bi bi-pencil-square"></i></Button></LinkContainer> / <Button variant='danger' size='sm' onClick={() => deleteHandler(user._id)}><i className="bi bi-x-circle"></i></Button></td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </>
                    }


                </Col>
            </Row>
        </Container>
    );
}

