import mongoose from "mongoose";

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        default:"default category description"
    },
    image:{
        type:String,
        default:"/images/ecommerece1.png"
    },
    attrs:[
        {
            key:{type:String},value:[{type:String}]
        }
    ],
    /*products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product,
        }
    ]*/

    //need to know how the products will be fetched when a category is selected
})

categorySchema.index({description:1});

export const Category=mongoose.model("Category",categorySchema);
