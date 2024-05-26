import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Rating } from 'react-simple-star-rating';

function ProductForListComponent({productId,name,description,price,images,rating,reviewsNumber}) {
  
  return (
    <>
      <Card style={{ marginTop: "30x", marginBottom: "50px" }}>
        <Row>
          <Col sm={12} lg={5}>
            <Card.Img variant="top" src={images[0]?images[0].path:""}style={{ height: "250px", objectFit: "cover" }} />
          </Col>
          <Col sm={12} lg={7}>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Text>
                {description}
              </Card.Text>
              <Card.Text>
                <Rating readonly size={20} initialValue={rating} />({reviewsNumber})
              </Card.Text>
              <Card.Text className='h4'>
                {price}{" "}
                <LinkContainer to={`/product-details/${productId}`}>
                  <Button variant="danger">See product</Button>
                </LinkContainer>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default ProductForListComponent;
