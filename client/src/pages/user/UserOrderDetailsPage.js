import axios from "axios";
import { UserOrderDetailComponent } from "./components/UserOrderDetailComponent";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadScript } from "@paypal/paypal-js";

export const UserOrderDetails = () => {
    const { userInfo } = useSelector((state) => state.user);
    const { cartItems, itemsCount, cartSubTotal } = useSelector((state) => state.cart);

    const { id } = useParams();

    const fetchUser = async () => {
        const { data } = await axios.get("/api/users/profile/");
        return data;
    }

    const fetchOrder = async () => {
        const { data } = await axios.get(`/api/orders/user/${id}`);
       
        return data;
    }

    const loadPayPalScript = ((cartItems, cartSubTotal,updateStateAfterOrder) => {
        loadScript({ "client-id": "AZkf1FXezxzTrbWVs5zLVlUWWPXlcLuXB4XdkyC1a26mEG44XZ2xPRn0U-d7Qt7lQbXPOi3ZKgjOpe-l" }).then(paypal => {
            paypal.Buttons(buttons(cartItems, cartSubTotal,updateStateAfterOrder)).render("#paypal-buttons-render");
        }).catch(err => {
            console.log("failed to load the PayPal");
        })
    })

    const buttons = (cartItems, cartSubTotal,updateStateAfterOrder) => {

        return {
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: cartSubTotal,
                                breakdown: {
                                    item_total: {
                                        currency_code: "USD",
                                        value: cartSubTotal,
                                    }
                                }
                            },
                            items:cartItems.map((product)=>{
                                return {
                                    name:product.name,
                                    unit_amount:{
                                        currency_code:"USD",
                                        value:product.price,
                                    },
                                    quantity:product.quantity,
                                }
                            })
                        }
                    ]
                })
            },
            onCancel: onCancelHandler,
            onApprove: function(data,actions){
                return actions.order.capture().then((orderData)=>{
                    var transaction=orderData.purchase_units[0].payments.captures[0];
                    if(Number(transaction.amount.value)===Number(cartSubTotal) && transaction.status==="COMPLETED"){
                        updateOrder(id).then((data)=>{
                            if(data.isPaid){
                                updateStateAfterOrder(data.paidAt);
                            }
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }
                })
            },
            onError: onErrorHandler,
        }
    }

    const onCancelHandler = (() => {
        console.log("cancel");
    })

    const onErrorHandler = (() => {
        console.log("error");
    });

    const updateOrder=async(id)=>{
        const {data}=await axios.patch(`/api/orders/paid/${id}`);
        return data;
    }

    return (
        <>
            <UserOrderDetailComponent userInfo={userInfo} fetchUser={fetchUser} cartItems={cartItems} itemsCount={itemsCount} cartSubTotal={cartSubTotal} fetchOrder={fetchOrder} loadPayPalScript={loadPayPalScript} id={id}/>
        </>
    )
}