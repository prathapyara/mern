import { OrderDetailPageComponent } from "./components/OrderDetailPageComponent"
import axios from "axios"

export const AdminOrderDetailsPage = () => {
   
    const getOrder=async(id)=>{
        const {data}=await axios.get("/api/orders/user/"+id);
        return data;
    }

    const delivered=async(id)=>{
        const {data}=await axios.patch("/api/orders/delivered/"+id);
        if(data){
            return data;
        }
    }

    return (
        <OrderDetailPageComponent getOrder={getOrder} delivered={delivered}/>
    )
}

