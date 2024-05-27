import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';

function CategoryCardComponent({item,idx}) {
    const itemurl=`https://source.unsplash.com/random/900×700/?${item.name}`
    console.log(item.image);
  return (
    <Card>
      <Card.Img crossOrigin='anonymous' variant="top" src={item.image?item.image:null} style={{ "height": "250px", "object-fit": "cover" }} />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>
          {item.description}
        </Card.Text>
        <LinkContainer to={`/product-list/category/${item.name}`}>
        <Button variant="primary">Go to the Category</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

export default CategoryCardComponent;