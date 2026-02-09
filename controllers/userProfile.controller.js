//yha mujhe bnana h   user profile k liye codee heheheheheheheh
/*
3 api bnani h

1st --- user apni profile dekh paye to middleware lg jayega auth wala fir profile dekh payega bnda
2nd--- user kisi particular user ki profile dekh skta hhhhh
3rd--- user apni profile edit kr skta hhhhhhh
 */

import { uploadOnCloudinary } from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
    //yha pe kisi or ki profile mtlb id tlb vo milegi header se url se 
    //url se lenge apa id 
    //mongo se find krege id 
    //if not present return not found
    // if present return the profile details in the response 
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .select("-password ");
        if (!user) {
            return res.json({ success: false, message: "user not found!!" })
        }
        return res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: "error in fetching user" })

    }

}

export const getownProfile = async (req, res) => {
    try {
        //khudki profile fetch krni h to middleware lga denge to id ajayegi user.id se uske bad same hehehehehe
        const user = await User.findById(req.user._id)
            .select("-password");
        if (!user) {
            return res.json({ success: false, message: "user doesnot exists" });

        }
        return res.json({ success: true, user })

    } catch (error) {
        return res.json({ success: false, message: "error in fetching profile" })

    }
}

//edit profile k liye pehle login verifyjwt token lgaye vha se hme req.user._id mil jayega
//jo bhi data update krna h vo data le lenge hm user se 
//fir user ko mongo me find krege  and then use update kr denge jo chij update hui h vo vrna same 
//fir vo return kr denge user ko

export const editProfile = async (req, res) => {
    try {
        const { name, email, password, phone, bio, interest } = req.body;

        const updateFields = {};

         const profileLocalPath = req.file?.path;
            const profilePic = await uploadOnCloudinary(profileLocalPath);

        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = phone;
        if (bio) updateFields.bio = bio;
        if (interest) updateFields.interest = interest;

        if(profilePic) updateFields.profilePic = profilePic.url;

        // password needs special handling (hashing)
        if (password) {
            const user = await User.findById(req.user._id);
            user.password = password; // your pre-save hook will hash it
            await user.save();
        }

   

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true }
        ).select("-password -refreshToken");

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "error in updating profile"
        });
    }
};
