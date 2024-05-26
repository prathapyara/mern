import { ADD_TO_CART } from "../constant/constant";
import {DELETE_FROM_CART} from "../constant/constant";

const CART_INITIAL_STATE={
    cartItems:[],
    itemsCount:0,
    cartSubTotal:0

}

export const cartReducer=(state=CART_INITIAL_STATE,action)=>{
    switch (action.type){
        case ADD_TO_CART:
            
            const productBeingAddedToCart=action.payload;
            const productBeingAlreadyExsits=state.cartItems.find((x)=>{
              return x.productId===productBeingAddedToCart.productId  
            })

            const currentState={...state};
            
            if(productBeingAlreadyExsits){
                
                currentState.itemsCount=0;
                currentState.cartSubTotal=0;
                currentState.cartItems=state.cartItems.map((item)=>{
                    if(item.productId===productBeingAlreadyExsits.productId){
                        currentState.itemsCount+=Number(productBeingAddedToCart.quantity);
                        const sum=Number(productBeingAddedToCart.quantity)*Number(productBeingAddedToCart.price);
                        currentState.cartSubTotal+=sum;
                    }else{
                        currentState.itemsCount+=Number(item.quantity);
                        const sum=Number(item.quantity)*Number(item.price);
                        currentState.cartSubTotal+=sum;
                    }
                    return item.productId===productBeingAlreadyExsits.productId?productBeingAddedToCart:item;
                })
            }else{
                
                currentState.itemsCount+=Number(productBeingAddedToCart.quantity);
                const sum=Number(productBeingAddedToCart.price)*Number(productBeingAddedToCart.quantity);
                currentState.cartSubTotal+=sum;
                currentState.cartItems=[...state.cartItems,productBeingAddedToCart];   
            }
            return currentState;

        case DELETE_FROM_CART:
            const productId=action.payload.productId;
            
            return {
                ...state,
                cartItems:state.cartItems.filter((x)=>x.productId!==productId),
                itemsCount:state.itemsCount-action.payload.quantity,
                cartSubTotal:state.cartSubTotal-action.payload.price*action.payload.quantity
            };
        
        default:
            return state;
        }
}

