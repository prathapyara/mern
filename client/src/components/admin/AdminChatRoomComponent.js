import Toast from 'react-bootstrap/Toast';
import { Form, Button } from "react-bootstrap";
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AdminReply, messageReceived } from '../../redux/actions/chatAction';

export const AdminChatRoomComponent = ({ user, message,socket }) => {
    const [toast1, closeToast1] = useState(true);
    const [validated, setValidated] = useState(false);
    const dispatch=useDispatch();

    const close1 = () => {
        closeToast1(false);
        console.log("iam here");
        socket.emit("admin closes the chat",user);
    }
    const chatBodyRef=useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget.elements;
        const replyMessage = form.message1.value;
        if (e.currentTarget.checkValidity() === true) {

           
            socket.emit("admin reply to client",({
                user:user,
                replyMessage:replyMessage
            }));
            

            dispatch(AdminReply(user,replyMessage));
            dispatch(messageReceived(false))

            if(chatBodyRef.current){
                chatBodyRef.current.scrollTop=chatBodyRef.current.scrollHeight;
            }
            setTimeout(()=>{
                form.message1.value="";
            },50)
           
        }
        setValidated(true);
    }

    return (
        <>
            <Toast show={toast1} onClose={close1} className='ms-4 mb-5'>
                <Toast.Header><strong className='me-auto'>Chat with {user}</strong></Toast.Header>
                <Toast.Body style={{ overflow: "auto", maxHeight: "500px" }} ref={chatBodyRef}>
                    {
                        message.map((item, idx) => {
                            return (<>
                                <Fragment key={idx}>
                                    {
                                        item.client && (<p className='ms-5 bg-primary p-3 text-light rounded-pill'><strong>User Chat: </strong>{item.client}</p>)
                                    }
                                    {
                                        item.admin && (<p ><strong>Agent Chat: </strong>{item.admin}</p>)
                                    }
                                </Fragment>
                            </>)
                        })
                    }
                    
                </Toast.Body>
                <Form onSubmit={handleSubmit} validated={validated} noValidate>
                        <Form.Group className='mb-3'
                            controlId='expampleFrom.controltextarea1'>
                            <Form.Label>Reviews</Form.Label><br/>
                            <textarea required="true" id="textMessage" rows={3} placeholder="Your Text Message" name="message1"></textarea>
                        </Form.Group>
                        <Button variant='success' type='submit'>
                            Submit
                        </Button>
                    </Form>
            </Toast>

        </>
    )
}