import { useEffect, useRef, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

export const UserChatComponent = () => {

    const [chat, isChat] = useState(false);
    const [validated, setValidated] = useState(false);
    const [socket, setSocket] = useState(null);
    const [mychat, setMyChat] = useState([]);
    const [messageReceived, setMessageRecived] = useState(false); //if new message come and if no reply has given then it will show red dot
    const [reconnect, setReconnect] = useState(false)
    const [reconnectingMsg, setReconnectingMsg] = useState("");


    const { userInfo } = useSelector((state) => state.user);
    const chatBodyRef = useRef();

    useEffect(() => {

        if (!userInfo.isAdmin) {
            const serverUrl = process.env.NODE_ENV === "production"
                ? "https://server-x05s.onrender.com"
                : "http://localhost:5000";

            const newSocket = io(serverUrl);
            setSocket(newSocket);
            return () => newSocket.disconnect();
        }
    }, [userInfo.isAdmin, reconnect]);

    useEffect(() => {
        if (socket) {
            socket.on("message sent from admin to client", ({ message }) => {
                setMyChat((prev) => {
                    return [...prev, { admin: message }]
                })
                let audio = new Audio("/audio/chat-msg.mp3");
                setMessageRecived(true);
                audio.play();
            });
            socket.on("admin closed the chat", (msg) => {
                console.log(msg);
                setMyChat((prev) => {
                    return [...prev, { admin: msg }]
                })

                setReconnectingMsg("reconnecting.....");

                setInterval(() => {
                    setReconnect(true);
                    setReconnectingMsg("");
                    setMyChat([]);
                }, 2000);
            })
        }
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget.elements;
        const clientMessage = form.message1.value.trim();
        if (e.currentTarget.checkValidity() === true) {
            if (socket && !userInfo.isAdmin) {
                socket.emit("client side message", clientMessage);
                setMyChat((prev) => {
                    return [...prev, { client: clientMessage }];
                });
                setMessageRecived(false);
                setTimeout(() => {
                    form.message1.value = "";
                }, 50)

                socket.on("no admin is logged in", (msg) => {
                    setMyChat((prev) => {
                        return [...prev, { client: msg }]
                    })
                })

                if (chatBodyRef.current) {
                    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
                }
            }
        }
        setValidated(true);
    }

    const handleClick = () => {
        if (chat) {
            isChat(false);
        } else {
            isChat(true);
        }
    }
    return !userInfo.isAdmin ? (
        <>
            <div id="circleStyle" onClick={handleClick}>
                {
                    chat ? (<i className="bi bi-x-circle"></i>) : (<>{messageReceived ? <span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span> : null}<i className="bi bi-chat-dots"></i></>)
                }
            </div>
            {
                chat ? (
                    <>
                        <div className="chat-wrapper">
                            <div>{reconnectingMsg}</div>
                            <div className="chat-header">
                                <h6>
                                    Let's Chat - Online
                                </h6>
                            </div>
                            <Form className="form" onSubmit={handleSubmit} noValidate validated={validated}>
                                <Form.Group className="chatscroll mb-2" ref={chatBodyRef}>
                                    {
                                        mychat && mychat.map((chat) => {
                                            if (chat.client) {
                                                return (
                                                    <p>
                                                        <b>You wrote:</b> {chat.client}
                                                    </p>
                                                )
                                            } else if (chat.admin) {
                                                return (
                                                    <p className="bg-primary p-3 ms-4 text-light rounded-pill">
                                                        <b>Support wrote:</b> {chat.admin}
                                                    </p>
                                                )
                                            }

                                        })
                                    }

                                </Form.Group>
                                <Form.Group className="mb-2" controlId="formBasicEmail">
                                    <textarea required="true" id="textMessage" rows={3} placeholder="Your Text Message" name="message1"></textarea>
                                </Form.Group>
                                <Button variant="success" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </>) : null
            }
        </>

    ) : null
}