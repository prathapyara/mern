import mongoose, { connect } from "mongoose";
import { MongoDB } from "../config/db.js";
import { categoryData } from "./categoryData.js";
import { Category } from "../Models/CategoryModel.js";
import { Product } from "../Models/ProductModel.js";
import { productData } from "./productData.js";
import { reviewsData } from "./reviewsData.js";
import { Review } from "../Models/ReviewModel.js";
import { User } from "../Models/UserModel.js";
import { userData } from "./userData.js";
import { orderData } from "./orderData.js";
import { Order } from "../Models/OrderModel.js";


MongoDB();
console.log(process.argv)
const importData=async()=>{
    
    try{
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        if(process.argv[2]!=="-d"){
            await Category.insertMany(categoryData);
            const reviews=await Review.insertMany(reviewsData);
            const sampleData=productData.map((product)=>{
                reviews.forEach((review)=>product.reviews.push(review._id))
                return {...product};
            })
            await Product.insertMany(sampleData);
            await User.insertMany(userData);
            await Order.insertMany(orderData);

            console.log("Data inserted successfully successfully");
            process.exit();
            
        }

        console.log("data deleted successfully")
        process.exit();
       
    }catch(error){
        console.log("Error as occured and not successful",error)
    }
}

importData();