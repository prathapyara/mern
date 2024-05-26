import { CartPageComponent } from "./components/CartPageComponent.js";
import { add_to_cart } from "../redux/actions/cartActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { delete_from_cart } from "../redux/actions/cartActions";

export const CartPage = () => {
    const dispatch=useDispatch();
    const {cartItems,cartSubTotal}=useSelector((state)=>state.cart);

    return (
        <>
            <CartPageComponent add_to_cart={add_to_cart} dispatch={dispatch} cartItems={cartItems} cartSubtotal={cartSubTotal} delete_from_cart={delete_from_cart}/>
        </>
    )
}