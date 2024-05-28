import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import AdminLinkComponent from '../../components/admin/AdminLinkComponent';
import { Container } from 'react-bootstrap';
import { AdminChatRoomComponent } from '../../components/admin/AdminChatRoomComponent';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const AdminChatPage = () => {
    const { chatRooms } = useSelector((state) => state.chatBetweenClientAdmin)
    const socket=io("https://server-x05s.onrender.com");
    return (
        <>
            <Row className='m-5'>
                <Col md={3}>
                    <AdminLinkComponent />
                </Col>
                <Col md={9}>
                    <Row >
                        {
                            Object.entries(chatRooms).map(([user, message]) => {
                                return <AdminChatRoomComponent user={user} message={message} socket={socket}/>
                            })
                        }
                    </Row>

                </Col>
            </Row>

        </>
    )
}