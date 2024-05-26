import { Container,Row,Col } from "react-bootstrap"


export const FooterComponent=()=>{
    return (
        <footer>
          <Container fluid>
            <Row className="mt-3">
              <Col className="bg-dark  text-center py-3 text-white">
                Copyright &copy; 2023
              </Col>
            </Row>
          </Container>
        </footer>
        
    )
}