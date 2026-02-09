//yha mujhe bnana h user suth basically reqister login logout refresh 

import { uploadOnCloudinary } from "../config/cloudinary.js";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken}

    }catch(error){
        console.log("TOKEN error: ",error);
        
    }

}
export const register = async (req,res)=>{
    // register logic here............
    //from user we will take name email password bio phone interest array 
    // ye itni sari chije 
    //validation
    //check if user alreday exists
    //generate access and refresh token 
    //save everything in mongo ........
    //return responseeee

    const {name,email,password,phone,bio,interest} = req.body;
    if(!name || !email || !password || !phone){
        return res.json({success:false, message:"missing details"})
    }
    const alreadyUser =await User.findOne({email});
    if(alreadyUser){
        console.log("user already hh");
        return res.json({success:false, message:"user already exists"})
    }

    //imgg
    const profileLocalPath = req.file?.path;
    const profilePic = await uploadOnCloudinary(profileLocalPath);

    const user = await User.create({
        name,
        email,
        password,
        phone,
        bio,
        interest,
        profilePic:profilePic?.url || ""

    })
    const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
    )

    if(!createdUser){
        return res.json({success:false,message:"user not created"})
    }

    return res.json({success:true, message:"user created successfulyy !! yayyyy welcomeeee to hostel buddy ajaoo bhaijiii"})

}

export const loginUser = async(req,res)=>{
    //user se lena h name email and pass onlyy and verify the pass 
    //then generate the access and refresh token

    const {name,email,password} = req.body;
    if(!email || !password ||!name){
        return res.json({success:false, message:"missing details"});
    }
    const user = await User.findOne({email});

    if(!user){
        return res.json({success:false,message:'user not found'});
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res.json({success:false, message:"password doesnot match"});
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({success:true, message:"user logged in successfully",loggedInUser})
    //ye order bhot jruri hhh pehle res terurn kr dia to cookie kbhi jayegi hi nhiiiiiiiiiiiiiiiiiiiiiiiii
    
}

export const logoutUser = async(req,res)=>{
    //find user from middleware delte data from mongo and clear cookies and token
    await User.findByIdAndUpdate(
        req.user._id,
        {
           $unset: { refreshToken: 1 }

        },{
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true

    }
    return res
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({success:true, message:"logged out successfully"})
}