import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from "react-bootstrap/Badge"
import { Form, Dropdown, DropdownButton, Button, InputGroup, IN } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/actions/userAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { category_list } from '../redux/actions/caterogiesAction';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { chatActions } from '../redux/actions/chatAction';
import { messageReceived } from '../redux/actions/chatAction';
import { RemoveChatRooms } from '../redux/actions/chatAction';

export const HeaderComponent = () => {

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { chatRooms,messageReceivedFromClient } = useSelector((state) => state.chatBetweenClientAdmin)

  const { userInfo } = useSelector((state) => state.user);
  const { itemsCount } = useSelector((state) => state.cart);
  const { categories } = useSelector((state) => state.categories);
  const [searchValue, setSearchValue] = useState("");
  const [searchCategoryDisplay, setSearchCategoryDisplay] = useState("All");

  let pathUrl = "";
  let category = "";
  let searchQuery = `/search/${searchValue}`;

  const handleSearchClick = (e) => {

    if (e.keyCode && e.keyCode !== 13) return
    e.preventDefault();
    if (pathname.includes("product-list/category")) {
      const categorySplit = pathname.split("/");
      let categoryName = categorySplit[3] || "";
      category = categoryName ? `/category/${categoryName}` : "";
      pathUrl = `/product-list${category}${searchQuery}`
    } else {
      pathUrl = `product-list` + searchQuery
    }
    navigate(pathUrl);
    setSearchValue("");

  }

  useEffect(() => {

    dispatch(category_list());

  }, [dispatch]);

  useEffect(() => {
    if (userInfo.isAdmin) {
      const socket = io("https://server-x05s.onrender.com");
      socket.emit("admin is logged in","Admin"+Math.floor(Math.random()*1000000000));
      socket.on("message sent from client to admin", ({message,user }) => {
        dispatch(chatActions(user, message));
        dispatch(messageReceived(true));
        // let audio = new Audio("/audio/chat-msg.mp3");
        // audio.play();
      })
      socket.on("disconnected",({reason,socketId})=>{
        dispatch(RemoveChatRooms(socketId));
      })
      return () => socket.disconnect();
    }

  }, [userInfo.isAdmin])


  return (
    <Navbar bg="dark" variant='dark' collapseOnSelect expand="lg" >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>BEST ONLINE SHOP</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <InputGroup>
              <DropdownButton id="dropdown-basic-button" title={searchCategoryDisplay} defaultValue="All">
                {
                  categories && categories.map((category, _idx) => {
                    return (
                      <LinkContainer to={`product-list/category/${category.name}`} ><Dropdown.Item key={_idx + 1} onClick={(e) => setSearchCategoryDisplay(category.name)}>{category.name}</Dropdown.Item></LinkContainer>
                    )
                  })
                }
              </DropdownButton>
              <Form.Control type="text" placeholder="Search in Shop ..." onKeyUp={handleSearchClick} onChange={(e) => setSearchValue(e.target.value)} value={searchValue} />
              <Button variant="warning" onClick={handleSearchClick} >
                <i className='bi bi-search'></i>
              </Button>
            </InputGroup>
          </Nav>
          <Nav>
            {
              (Object.keys(userInfo).length !== 0) ? (
                userInfo.isAdmin ? (
                  <>
                  {
                    messageReceivedFromClient?(<span className="position-absolute top-1 start-10 translate-end p-2 bg-danger border border-light rounded-circle"></span>):(null)
                  }   
                    <NavDropdown title={`${userInfo.firstName + userInfo.lastName}`} id="collapsible-nav-dropdown">
                      <NavDropdown.Item eventKey="/admin/users" as={Link} to="/admin/users">Admin View</NavDropdown.Item>
                      <NavDropdown.Item eventKey="/user" as={Link} to="/user">My Profile</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => dispatch(logoutUser())}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <> <NavDropdown title={`${userInfo.firstName + userInfo.lastName}`} id="collapsible-nav-dropdown">
                    <NavDropdown.Item eventKey="/user/my-orders" as={Link} to="/user/my-orders">My orders</NavDropdown.Item>
                    <NavDropdown.Item eventKey="/user" as={Link} to="/user">My profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => dispatch(logoutUser())}>Logout</NavDropdown.Item>
                  </NavDropdown></>
                )

              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link >Login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link >Register</Nav.Link>
                  </LinkContainer></>
              )

            }

            <LinkContainer to="/cart">
              <Nav.Link >
                <Badge pill bg='danger'>{itemsCount ? itemsCount : 0}</Badge><i className="bi bi-cart"></i> <span className='ms-1'>CART</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}