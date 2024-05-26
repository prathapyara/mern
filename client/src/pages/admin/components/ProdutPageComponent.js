import Table from 'react-bootstrap/Table';
import { Button, Col, Container, Row } from 'react-bootstrap';
import AdminLinkComponent from '../../../components/admin/AdminLinkComponent.js';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../../redux/actions/userAction";

export const ProductPageComponent = ({ fetchProducts,deleteProduct }) => {
    const dispatch=useDispatch();
    const [products, setProdcuts] = useState([]);
    const [isProductDelete,setIsProductDelete]=useState(false);

    const deleteHandler = async (productId) => {
       
        if (window.confirm("Are you sure?")){
            const data=await deleteProduct(productId);
            
            if(data==="Product Removed"){
                setIsProductDelete(!isProductDelete);
            }
        }
    }

    useEffect(() => {
        const abctrl=new AbortController();
      
            fetchProducts(abctrl).then((res) => setProdcuts(res)).catch((er) => dispatch(logoutUser()));
       
        return ()=>abctrl.abort();
    }, [isProductDelete]);

    return (
        <Container>
            <Row className='mt-5'>
                <Col sm={3}>
                    <AdminLinkComponent />
                </Col>
                <Col sm={9}>
                    <div>
                        <h1>Products List <LinkContainer to="/admin/create-new-product"><Button variant='primary' size='lg'>Create new</Button></LinkContainer>
                        </h1>
                    </div>

                    {
                        !products ? <><h2>No products found</h2></> : <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map((product, idx) => {
                                            return (
                                                <>
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.price}</td>
                                                        <td>{product.category}</td>
                                                        <td><LinkContainer to={`/admin/edit-product/${product._id}`}><Button variant='primary' size='sm'><i class="bi bi-pencil-square"></i></Button></LinkContainer> / <Button variant='danger' size='sm' onClick={()=>deleteHandler(product._id)}><i class="bi bi-x-circle"></i></Button></td>

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

