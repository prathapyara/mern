import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import AdminLinkComponent from '../../components/admin/AdminLinkComponent';
import { AdminChatRoomComponent } from '../../components/admin/AdminChatRoomComponent';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const AdminChatPage = () => {
    const { chatRooms } = useSelector((state) => state.chatBetweenClientAdmin)
    const serverUrl = process.env.NODE_ENV === "production"
        ? "https://server-x05s.onrender.com"
        : "http://localhost:5000";

    const socket = io(serverUrl);
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
                                return <AdminChatRoomComponent user={user} message={message} socket={socket} />
                            })
                        }
                    </Row>

                </Col>
            </Row>

        </>
    )
}
