import { ADD_TO_CART} from "../constant/constant";
import {DELETE_FROM_CART} from "../constant/constant";
import axios from "axios";

export const add_to_cart = (productId,quantity) => async(dispatch,getState) => {
    
    const {data}=await axios.get(`/api/products/get-one/${productId}`);
    dispatch({
        type: ADD_TO_CART,
        payload:{
            productId:data.product._id,
            name:data.product.name,
            price:data.product.price,
            image:data.product.images[0]??null,
            count:data.product.count,
            quantity
        }
    })

    localStorage.setItem("cart",JSON.stringify(getState().cart.cartItems));

};

export const delete_from_cart=(productId,quantity,price)=>async(dispatch,getState)=>{

    dispatch({
        type:DELETE_FROM_CART,
        payload:{
            productId:productId,
            quantity:quantity,
            price:price
        }
    })
    localStorage.setItem("cart",JSON.stringify(getState().cart.cartItems))
}

