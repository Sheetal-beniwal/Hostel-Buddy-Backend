//here i have to make 5 apisss
/*
api 1 --> create post
api 2--> get all posts
api 3 --> get specific post
api 4--> mark item as found
api 5--> delete post
*/


import { uploadOnCloudinary } from "../config/cloudinary.js";
import LostItem from "../models/lostFound.model.js";

export const createLostFoundItem = async(req,res)=>{
    //ye api h for like making post ki mujhe koi item mila h ya lost h to post create krni h to kya hoga ismeeee
    // yha middleware lgega ek to auth wala jisse user mil jayeg a
    //from req.body -- we will take every details 
    //validation only ki koi field khali na ho 
    //save in mongo
    //give response
try{
    const {itemName,details, location, type} = req.body;
   
     if(!itemName || !details || !location || !type){
         return res.status(400).json({success:false, message:"missing details"});
         
     }
      const itemLocalPath = req.file?.path;
      if(!itemLocalPath){
        return res.status(400).json({success:false, message:"item pic is required"})
      }

    const itemPic = await uploadOnCloudinary(itemLocalPath);
    if(!itemPic){
        return res.status(500).json({success:false, message:"error in uploading item pic"})
    }
    
     
     const item = await LostItem.create({
        itemName,
        details,
        location,
        type,
        createdBy: req.user._id,
        itemPic:itemPic.url
     })

     if(!item){
        return res.status(500).json({sucecss:false, message:"error in creating item"});

     }

     return res.status(201).json({success:true,message:"item created successfult",item})


   } catch (error) {
    console.log(error.message);
    return res.status(500).json({success:false, message:"error in creating post"});
    
   }
}

//get all posts
export const getAllItems = async(req,res)=>{
 //is api ka kaam h sari ki sari posts lake dena 
 //get request hogi koi dikt nhi h 
 //mongo se sare items fetch krege response me dedenge

 try {
    const items = await LostItem.find()
      .populate("createdBy","name profilePic")
      .sort({ createdAt: -1 });

    res.json({success:true,items});
  } catch (error) {
    res.status(500).json({success:false});
  }
}

//get specif post
export const getItemByID = async(req,res)=>{
    //get request hoyegi params se id leni h bs
    try {
        const {id} = req.params;
        const item = await LostItem.findById(id);
        if(!item){
            return res.status(400).json({success:false, message:"item not found"});
        }
        return res.status(200).json({success:true, message:"item fetched successfully",item})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false,message:"error in getting item"})
        
    }

}

//mark item as closed
export const updateStatus = async(req,res)=>{
    //is api me hme bs status ko update krna h to yha role based access bhi ayega okiiii
    // to isme kya hoga ki jo owner h use lost wali chij found ho gyi to bs vo status update krega to 
    //vo to bs mongo me update krna h lekin role based wali chij kaise krege vo sochna h
    //aise kr skte h ki token h usme user ki id hogi use me mongo me d=stored owner se check krlenge
    //yes hm shi hhhhhhhhhh

   try {
     const {id} = req.params;
     const item = await LostItem.findById(id);
     if(!item){
         return res.status(404).json({success:false, message:"item not found"})
     }
     const userId = req.user._id.toString();
     const mongoUserId = item.createdBy.toString();
     if(userId !== mongoUserId){
         return res.status(403).json({success:false, message:"you are not authorized to mark this item as found"})
     }
     await LostItem.findByIdAndUpdate(id,{
         status:"close"
     },{new:true});
     return res.status(200).json({success:true,message:"updated status",item})
   } catch (error) {
    console.log(error.message);
    return res.status(500).json({success:false,message:"error in updating ststus"})
    
   }
}

export const deleteItem = async(req,res)=>{
   try {
      const { id } = req.params;

      const item = await LostItem.findById(id);
      if(!item){
         return res.status(404).json({
            success:false,
            message:"Item not found"
         })
      }

      await LostItem.findByIdAndDelete(id);

      return res.status(200).json({
         success:true,
         message:"Item deleted by admin"
      });

   } catch (error) {
      console.log(error.message);
      return res.status(500).json({
         success:false,
         message:"Error deleting item"
      })
   }
}



