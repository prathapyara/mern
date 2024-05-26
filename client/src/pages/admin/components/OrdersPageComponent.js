import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { Col, Container, Row } from 'react-bootstrap';
import  AdminLinkComponent  from '../../../components/admin/AdminLinkComponent.js';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../../redux/actions/userAction";

export const OrdersPageComponent = ({fetchOrders}) => {
    const dispatch=useDispatch();
    const [orders,setOrders]=useState([]);

    useEffect(()=>{
        const abctrl = new AbortController();
        fetchOrders(abctrl).then((res) => {
            setOrders(res);
        }).catch((er) => dispatch(logoutUser()));
        return () => abctrl.abort();    
    },[]);

    return (
        <Container>
            <Row className='mt-5'>
            <Col sm={3}>
            <AdminLinkComponent/>
            </Col> 
            <Col sm={9}>
                <h1>Orders</h1>
                {
                    !orders?<><h2>No orders present</h2></>:<>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Delivered</th>
                                <th>Payment Method</th>
                                <th>Order details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((order, idx) => {
                                    return (
                                        <>
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{order.user.firstName + " " + order.user.lastName}</td>
                                                <td>{order.createdAt.substring(0,10)}</td>
                                                <td>{order.orderTotal.cartSubtotal}</td>
                                                <td>{order.isDelivered?<><i className="bi bi-check-lg text-success"></i></>:<><i className="bi bi-x-lg text-danger"></i></>}</td>
                                                <td>{order.paymentMethod}</td>
                                                <td><Link to={`/admin/order-details/${order._id}`}>Go to order</Link></td>
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
