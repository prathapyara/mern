import { User } from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import { getJWTwebToken } from "../utils/jwtTokenGeneration.js";
import { comparePasswords } from "../utils/hashpassword.js";
import { Product } from "../Models/ProductModel.js";
import { Review } from "../Models/ReviewModel.js";
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

export const getUsers = async (req, res, next) => {
    try {
        const user = await User.find({}).select("-password").orFail();
        res.json({ users: user });
    } catch (err) {
        next(err);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const password = req.body.password;
        const lastName = req.body.lastName;
        const emailAddress = req.body.emailAddress;

        if (!(firstName && lastName && emailAddress && password)) {
            return res.status(404).send("firstName,lastName,emailAddress and password are mandatory");
        }

        const userExits = await User.findOne({ emailAddress: emailAddress });
        if (userExits) {
            return res.status(400).json({ msg: "user already exists" });
        } else {
            const user = await User.create({ firstName: firstName, lastName: lastName, password: bcrypt.hashSync(password, 10), emailAddress: emailAddress.toLowerCase() });
            res.cookie("access_token", getJWTwebToken(user._id, user.firstName, user.lastName, user.isAdmin, user.emailAddress), {
                httpOnly: true,
                secure: process.env.NODE_ENV == "Prodcution",
                sameSite: "Strict"
            }).status(201).json({
                newUser: {
                    lastName: user.lastName,
                    firstName: user.firstName,
                    emailAddress: user.emailAddress,
                    isAdmin: user.isAdmin
                },
                msg: "new user got created"
            });
        }
    } catch (err) {
        next(err);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const emailAddress = req.body.emailAddress;
        const password = req.body.password;
        const doNotLogOut = req.body.doNotLogOut || false;
        if (!(emailAddress && password)) {
            return res.status(404).json({ msg: "Email and password are required" });
        }
        const userExits = await User.findOne({ emailAddress: emailAddress }).orFail();
        
        if (userExits && comparePasswords(password, userExits.password)) {
            
            let cookieparams = {
                httpOnly: true,
                secure: process.env.NODE_ENV == "Prodcution",
                sameSite: "Strict"
            }
            if (doNotLogOut) {
                cookieparams = { ...cookieparams, maxAge: 1000 * 60 * 7 * 60 * 24 }
            }

            res.cookie("access_token", getJWTwebToken(userExits._id, userExits.firstName, userExits.lastName, userExits.isAdmin, userExits.emailAddress), cookieparams).status(201).json({
                loggedUser: {
                    id:userExits._id,
                    lastName: userExits.lastName,
                    firstName: userExits.firstName,
                    emailAddress: userExits.emailAddress,
                    isAdmin: userExits.isAdmin,
                    doNotLogOut:doNotLogOut
                },
                success: "user logged in"
            });

        } else {
            return res.status(401).send("wrong credentials")
        }
    } catch (err) {
        next(err);

    }

}

export const updateUserProfile = async (req, res, next) => {

    try {
        //here req.user we get by decoding the jwt token that is stored in cookie and  
        const user = await User.findById(req.user._id).orFail();
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        user.country = req.body.country;
        user.zipCode = req.body.zipCode;
        user.city = req.body.city;
        user.state = req.body.state;
        if (req.body.password !== user.password) {
            user.password = bcrypt.hashSync(req.body.password, 10);
        }
        await user.save();
        
        return res.status(200).json({ msg: "Updated the profile successfully",userUpdated:{emailAddress:user.emailAddress,isAdmin:user.isAdmin,firstName:user.firstName,lastName:user.lastName,_id:user._id} });

    } catch (err) {
        next(err);
    }

}

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
       
        return res.status(200).json({user:user});
    } catch (err) {
        next(err);
    }
}

export const userReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;

        if (!(comment && rating)) {
            return res.status(400).send("All inputs are required");
        }

        const product = await Product.findById(req.params.productId).populate("reviews");
        const userAlreadyReviewed = product.reviews.find((review) => review.user._id.toString() === req.user._id.toString());

        if (userAlreadyReviewed) {
            return res.status(400).send("product already reviewed");
        }
        const reviewId = new ObjectId();
        let prc = [...product.reviews];
        //prc.push({rating:rating});
        product.reviews.push(reviewId);

        if (product && !userAlreadyReviewed) {

            await Review.create([
                {
                    _id: reviewId,
                    comment: comment,
                    rating: Number(rating),
                    user: { _id: req.user._id, name: req.user.firstName + " " + req.user.lastName },
                }
            ])

            if (product.reviews.length === 1) {
                //product.reviews.push({rating:rating,comment:comment});
                product.reviewNumber = 1;
                product.rating = Number(rating);
            } else {
                const totalProducts = product.reviews.length;
                //product.reviews.push({rating:rating,comment:comment});
                const finalRating = prc.map((review) => Number(review.rating)).reduce((sum, item) => item + sum, 0) / totalProducts;
                product.reviewNumber = totalProducts;
                product.rating = Math.round(finalRating);
            }
            await product.save();
            res.status(200).send("review created");
        }
    } catch (err) {
        next(err);
    }
}

export const getUserAdmin=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id).select("firstName lastName emailAddress isAdmin").orFail();
        if(!user){
            res.status(400).send("user not found")
        }
        res.status(200).json({msg:user});
    }catch(err){
        next(err);
    }
}

export const updateUserAdmin=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id).orFail();
        
        user.firstName=req.body.firstName || user.firstName;
        user.lastName=req.body.lastName || user.lastName;
        user.emailAddress=req.body.emailAddress || user.emailAddress;
        user.isAdmin=req.body.isAdmin || user.isAdmin;

        await user.save();

        res.send("user updated");
       
    }catch(err){
        next(err);
    }
}

export const deleteUserAdmin=async(req,res,next)=>{
    try{
        const user=await User.findById(req.params.id).orFail();
        await User.deleteOne({emailAddress:user.emailAddress});
        res.send("user deleted");
    }catch(err){
        next(err);
    }
}

