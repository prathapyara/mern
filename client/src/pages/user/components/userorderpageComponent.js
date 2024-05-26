import { Link, useAsyncError } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { Col, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

export const UserOrdersPageComponent = ({getOrder,userInfo}) => {

    const [orders,setOrders]=useState([]);

    useEffect(()=>{
        getOrder().then((data)=>setOrders(data.msg)).catch((err)=>console.log(err));
        
    },[]);

    return (
        <Container>
            <Row className='mt-5'>
                <h1>My Orders</h1>
                <Col sm={12}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Delivered</th>
                                <th>Order details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((item, idx) => {
                                    return (
                                        <>
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{userInfo.lastName} {userInfo.firstName}</td>
                                                <td>{item.createdAt}</td>
                                                <td>{item.orderTotal.cartSubtotal}</td>
                                                <td>{item.isDelivered?<i className="bi bi-check-lg text-success"></i>:<i class="bi bi-x-lg text-danger"></i>}</td>
                                                <td><Link to={`/user/order-details/${item._id}`}>Go to order</Link></td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

