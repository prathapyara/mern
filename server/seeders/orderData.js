import mongoose from "mongoose"

const ObjectId=mongoose.Types.ObjectId;

export const orderData=Array.from({length:5}).map((_,idx)=>{
    let day=20
    if(idx<10){
        var hour="0"+idx
        var subtotal=100
    }else if(idx>16 && idx<21){
        var hour=idx
        var subtotal=100+12*idx
    }else{
        var hour=idx
        var subtotal=100
    }
    return {
        user:new ObjectId("65d09619ebb63743ed7f9a72"),
        orderTotal:{
            itemsCount:3,
            cartSubtotal:subtotal
        },
        cartItem:[
            {
                name:"Product name",
                price:34,
                image:{path:"https://source.unsplash.com/random/900×700/?"},
                quantity:3,
                count:5
            }
        ],
        paymentMethod:"PayPal",
        isPaid:false,
        isDelivered:false,
        createAt:`2023-12-${day}T${hour}:12:36.490+00:00`,
    }
})