import { Col, Row, Container, Form } from "react-bootstrap"
import AdminLinkComponent from "../../../components/admin/AdminLinkComponent"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const AdminAnalyticsPageComponent = ({ getOrdersFirstDate, getOrdersSecondDate, socketIOClient }) => {

    const [firstDateToCompare, setFirstDateToCompare] = useState(new Date().toISOString().substring(0, 10));

    let previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);
    const [secondDateToCompare, setSecondDateToCompare] = useState(new Date(previousDate).toISOString().substring(0, 10));
    const [dataForTheFirstSet, setDataForTheFirstSet] = useState([]);
    const [dataForTheSecondSet, setDataForTheSecondSet] = useState([]);

    useEffect(() => {
        const serverUrl = process.env.NODE_ENV === "production"
            ? "https://server-x05s.onrender.com"
            : "http://localhost:5000";

        const socket = io(serverUrl);

        const today = new Date().toDateString();


        const handler = (orderData) => {
            var orderDate = new Date(orderData.createdAt).toLocaleString("en-US", {
                hour: "numeric", hour12: true, timeZone: "UTC"
            })

            if (new Date(orderData.createdAt).toDateString() === today) {
                console.log(new Date(firstDateToCompare).toDateString(), today);
                if (new Date(firstDateToCompare).toDateString() === today) {

                    setDataForTheFirstSet((prev) => {
                        if (prev.length <= 0) {
                            return [{ name: orderDate, [firstDateToCompare]: orderData.orderTotal.cartSubtotal }];
                        }
                        const length = prev.length;
                        if (prev[length - 1].name === orderDate) {

                            prev[length - 1][firstDateToCompare] += orderData.orderTotal.cartSubtotal
                            return [...prev];
                        } else {
                            return [...prev, { name: orderDate, [firstDateToCompare]: prev[length - 1][firstDateToCompare] + orderData.orderTotal.cartSubtotal }]
                        }

                    })
                } else if (today === new Date(secondDateToCompare).toDateString()) {
                    setDataForTheSecondSet((prev) => {
                        if (prev.length <= 0) {
                            return [{ name: orderDate, [secondDateToCompare]: orderData.orderTotal.cartSubtotal }];
                        }

                        const length = prev.length;
                        if (prev[length - 1].name === orderDate) {
                            prev[length - 1][secondDateToCompare] += orderData.orderTotal.cartSubtotal
                            return [...prev];
                        } else {
                            return [...prev, { name: orderDate, [secondDateToCompare]: prev[length - 1][secondDateToCompare] + orderData.orderTotal.cartSubtotal }]
                        }

                    })
                }
            }
        }

        socket.on("sendOrderData", handler);
        return () => socket.off("sendOrderData", handler);

    }, [dataForTheFirstSet, dataForTheSecondSet, secondDateToCompare, firstDateToCompare])


    useEffect(() => {
        getOrdersFirstDate(firstDateToCompare).then((data) => {
            let orderSum = 0;
            const orders = data.map((order) => {
                orderSum += order.orderTotal.cartSubtotal;
                var date = new Date(order.createdAt).toLocaleString("en-US", {
                    hour: "numeric", hour12: true, timeZone: "UTC"
                });
                return ({ name: date, [firstDateToCompare]: orderSum })
            })
            setDataForTheFirstSet(orders);
        }).catch((err) => {
            console.log(err.response.data.message ? err.response.data.message : err.response.data)
        });


        getOrdersSecondDate(secondDateToCompare).then((data) => {
            let orderSum = 0;
            const orders = data.map((order) => {
                orderSum += order.orderTotal.cartSubtotal;
                var date = new Date(order.createdAt).toLocaleString("en-US", {
                    hour: "numeric", hour12: true, timeZone: "UTC"
                });
                return ({ name: date, [secondDateToCompare]: orderSum })
            })
            setDataForTheSecondSet(orders);
        }).catch((err) => {
            console.log(err.response.data.message ? err.response.data.message : err.response.data)
        });
        ;

    }, [firstDateToCompare, secondDateToCompare]);





    return (
        <Container>
            <Row className='mt-5'>
                <Col sm={3}>
                    <AdminLinkComponent />
                </Col>
                <Col sm={9}>
                    <h2>Black Friday Cumulative Revenue {firstDateToCompare} VS {secondDateToCompare}</h2>
                    <Form.Group>
                        <Form.Label>Select First Date To Compare</Form.Label>
                        <Form.Control type="Date" defaultValue={firstDateToCompare} onChange={(e) => setFirstDateToCompare(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Second  Date To Compare</Form.Label>
                        <Form.Control type="Date" defaultValue={secondDateToCompare} onChange={(e) => setSecondDateToCompare(e.target.value)} />
                    </Form.Group>
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart
                            width={500}
                            height={300}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" label={{ value: "TIME", offset: 50, position: "insideBottomRight", }} allowDuplicatedCategory={false} />
                            <YAxis label={{ value: "REVENUE $", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            {
                                dataForTheFirstSet.length > dataForTheSecondSet.length ? (
                                    <>
                                        <Line type="monotone" dataKey={firstDateToCompare} stroke="#8884d8" activeDot={{ r: 8 }} data={dataForTheFirstSet} />
                                        <Line type="monotone" dataKey={secondDateToCompare} stroke="#82ca9d" data={dataForTheSecondSet} />
                                    </>
                                ) : (
                                    <>
                                        <Line type="monotone" dataKey={secondDateToCompare} stroke="#8884d8" activeDot={{ r: 8 }} data={dataForTheSecondSet} />
                                        <Line type="monotone" dataKey={firstDateToCompare} stroke="#82ca9d" data={dataForTheFirstSet} />
                                    </>
                                )
                            }

                        </LineChart>
                    </ResponsiveContainer>
                </Col>
            </Row>
        </Container>
    )
}