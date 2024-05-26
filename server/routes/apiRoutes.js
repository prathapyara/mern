import express from "express";
import productRoutes from "./productRoutes.js"
import categoryRoutes from "./categoryRoutes.js"
import ordersRoutes from "./ordersRoutes.js";
import reviewsRoutes from "./reviewsRoutes.js"
import usersRoutes from "./usersRoutes.js";
import jwt from "jsonwebtoken";

const app=express();

app.get("/logout",(req,res)=>{
    return res.clearCookie("access_token").send("access token cleared");
});

app.get("/get-token",(req,res)=>{
    try{
        const access_token=req.cookies["access_token"];
        const decoded=jwt.verify(access_token,process.env.JWT_Security);
        return res.json({tokenUserName:decoded.firstName,isAdmin:decoded.isAdmin});
    }catch(err){
        return res.status(401).send("Unauthorized, InValid Token")
    }
})

app.use("/products",productRoutes);
app.use("/category",categoryRoutes);
app.use("/orders",ordersRoutes);
app.use("/users",usersRoutes);
app.use("/reviews",reviewsRoutes);

export default app;