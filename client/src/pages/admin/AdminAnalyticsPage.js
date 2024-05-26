import { AdminAnalyticsPageComponent } from "./components/AdminAnalyticsPageComponents";
import axios from "axios";
import socketIOClient from "socket.io-client";

export const AdminAnalyticsPage = () => {

    const getOrdersFirstDate=async(firstDateToCompare)=>{
        const {data}=await axios.get("/api/orders/analysis/" + firstDateToCompare);
        return data;
    }

    const getOrdersSecondDate=async(secondDateToCompare)=>{
        const {data}=await axios.get("/api/orders/analysis/" + secondDateToCompare);
        return data;
    }


    return (
        <AdminAnalyticsPageComponent getOrdersFirstDate={getOrdersFirstDate} getOrdersSecondDate={getOrdersSecondDate} socketIOClient={socketIOClient}/>
    )
}