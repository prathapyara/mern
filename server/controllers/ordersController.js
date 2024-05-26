import { Order } from "../Models/OrderModel.js";
import mongoose from "mongoose"
import { Product } from "../Models/ProductModel.js";
const ObjectId = mongoose.Types.ObjectId;

export const getUserOrder=async(req,res,next)=>{
    try{
        const userId=req.user._id;
        const orders=await Order.find({user:new ObjectId(userId)});
        
        if(!orders){
            return res.status(400).send("No orders found");
        }
        return res.status(200).json({msg:orders});
    }catch(err){
        next (err);
    }
}

export const getOrder=async(req,res,next)=>{
    try{
        const order=await Order.findById(req.params.orderId).populate("user","-password -isAdmin -_id -__v -createdAt -updatedAt");   
        res.send(order);
        
    }catch(err){
        next(err);
    }

}

export const createOrder=async(req,res,next)=>{
    try{
        const {orderTotal,cartItem,paymentMethod}=req.body;
        if(!(orderTotal && cartItem && paymentMethod)){
            return res.status(400).send("enter required inputs");
        }
        console.log(orderTotal.cartSubTotal);

        const ids=cartItem.map((item)=>{
            return item.productId;
        });

        const qty=cartItem.map((item)=>{
            return Number(item.quantity);
        });

        await Product.find({_id:{$in:ids}}).then((products)=>{
            products.forEach((product,_idx)=>{
                product.sales+=qty[_idx];
                product.save();
            })
        })

        const order=await Order.create({
            user:req.user._id,
            orderTotal:orderTotal,
            cartItem:cartItem,
            paymentMethod:paymentMethod
        })
        
        return res.status(201).json({order:order,msg:"order created"});  

    }catch(err){
        next(err);
    }
}

export const updateOrderToPaid=async(req,res,next)=>{
    try{
        const order=await Order.findById(req.params.id);
        order.isPaid=true;
        order.paidAt=Date.now();

        const updatedOrder=await order.save();
        res.send(updatedOrder);

    }catch(err){
        next(err);
    }
}

export const updateOrderToDelivered=async(req,res,next)=>{
    try{
        const order=await Order.findById(req.params.id);
        order.isDelivered=true;
        order.deliveredAt=Date.now();

        const updatedOrder=await order.save();
        res.send(updatedOrder);
    }catch(err){
        next(err);
    }
}

export const getadminOrders=async(req,res,next)=>{
    try{
        const orders=await Order.find({}).populate("user","-password -isAdmin -_id -__v -createdAt -updatedAt").sort({paymentMethod:1});
        res.send(orders);
    }catch(err){
        next(err);
    }
}

export const getOrderForAnalysis=async(req,res,next)=>{
    try{
        const start=new Date(req.params.date);
        start.setHours(0,0,0,0);
        const end=new Date(req.params.date);
        end.setHours(23,59,59,999);

        const order=await Order.find({
            createdAt:{
                $gte:start,
                $lte:end,
            }
        }).sort({createdAt:"asc"});

        res.send(order);
    }catch(err){
        next(err);
    }
}
