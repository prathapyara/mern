import dotevn from "dotenv";
import mongoose from "mongoose";
dotevn.config();

const mongodb_url=process.env.MONGODB_URL;

export const MongoDB=async()=>{
    try{
        
        await mongoose.connect(mongodb_url);
        console.log("MogoDB connected successfully");
    } 
    catch(error){
        console.log(error);
        console.log("MongoDB is failed to connect");
        
    }
}

