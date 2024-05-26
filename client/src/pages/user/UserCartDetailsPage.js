import { useSelector } from "react-redux"
import { UserCartDetailsPageComponent } from "./components/UserCartDetailPageComponent"
import { useDispatch } from "react-redux";
import { delete_from_cart } from "../../redux/actions/cartActions";
import { add_to_cart } from "../../redux/actions/cartActions";
import axios from "axios"

export const UserCartDetails = () => {

    const {userInfo}=useSelector((state)=>state.user);
    const {cartItems,itemsCount,cartSubTotal}=useSelector((state)=>state.cart);
    const dispatch=useDispatch();

    const fetchUser=async()=>{
        const {data}=await axios.get("/api/users/profile/");
        return data;
    }

    const createOrder=async(orderData)=>{
        const {data}=await axios.post("/api/orders/",{...orderData});
        return data;
    }

    return (
        <>
            <UserCartDetailsPageComponent userInfo={userInfo} cartItems={cartItems} cartSubTotal={cartSubTotal} itemsCount={itemsCount} dispatch={dispatch} add_to_cart={add_to_cart} delete_from_cart={delete_from_cart} fetchUser={fetchUser} createOrder={createOrder}/>
        </>
    )
}