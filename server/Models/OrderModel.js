import mongoose, { isObjectIdOrHexString } from "mongoose";
import { User } from "./UserModel.js";

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    orderTotal:{
        itemsCount:{type:Number,required:true},
        cartSubtotal:{type:Number,required:true}
    },
    cartItem:[
        {
            name:{type:String,required:true},
            price:{type:Number,required:true},
            image:{path:{type:String,required:true}},
            quantity:{type:Number,required:true},
            count:{type:Number,required:true},
        }
    ],
    transcationResult:{
        status:{type:String},
        createTime:{type:String},
        amount:{type:Number},
    },
    isPaid:{
        type:Boolean,
        required:true,
        default:false
    },
    paidAt:{
        type:Date,
    },
    isDelivered:{
        type:Boolean,
        required:true,
        default:false,
    },
    deliveredAt:{
        type:Date
    },
    paymentMethod:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

export const Order=mongoose.model("Order",orderSchema);

Order.watch().on("change",(data)=>{
    //console.log(data.fullDocument);
    if(data.operationType==="insert"){
        io.emit("sendOrderData",data.fullDocument);
    }
})