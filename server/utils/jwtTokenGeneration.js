import jwt from "jsonwebtoken";

export const getJWTwebToken=(_id,firstName,lastName,isAdmin,emailAddress)=>{
    return jwt.sign({_id,firstName,lastName,isAdmin,emailAddress},process.env.JWT_Security,{expiresIn:"10hr"});
}