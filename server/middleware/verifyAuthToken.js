import jwt from "jsonwebtoken";

//to get the cookie generated we need to run first login user or create user route then we this will work 

export const verifyIsLoggedIn=(req,res,next)=>{
    try{
       
        const token=req.cookies.access_token;
        
        if(!token){
            res.status(400).json({msg:"token is required"});
        }

        try{
            const decoded=jwt.verify(token,process.env.JWT_Security);
            req.user=decoded;
            next();

        }catch(err){
            console.log(" iam here");
            return res.status(404).send("unauthorized invalid token");
        }
        

    }catch(err){
        next(err);
    }
}

export const verifyIsAdmin=(req,res,next)=>{
    try{
      
        if(req.user && req.user.isAdmin){
            next();
        }else{
            res.status(404).json({msg:"user is not an admin"});
        }

    }catch(err){
        next(err);
    }
}