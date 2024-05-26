import { UserOrdersPageComponent } from './components/userorderpageComponent';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const UserOrdersPage = () => {

    const {userInfo}= useSelector((state)=>state.user);

    const getOrder=async()=>{
        const {data}=await axios.get("/api/orders/");
        return data;
    }

    return (
        <><UserOrdersPageComponent getOrder={getOrder} userInfo={userInfo}/></>
    );
}

