import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

export const verifyJWT = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            return res.json({success:false, message:"unauthorized token"})
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            return res.json({success:false, message:"user not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:"error in authentication"});
        
    }
}