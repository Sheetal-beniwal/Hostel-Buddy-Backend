// 4 apis bnani h bs
/*
1st -- create community 
2nd -- get all communities
3rd -- get community by id its details
4th -- join community   


 */

//1st create community
//isme pehle verifyjwt lga dege to created by k liye bnda mil jayega 
// fir req.pdy se sare fields lenge like community name desc interest vgr vgr sb ajayega
//usko mongo me save krdena h or return kra dena h bs jada kuch nhi h hhehehe

import Community  from "../models/community.model.js";

export const createCommunity = async(req,res)=>{
    try {
        const{name,interest,description} = req.body;
        if(!name || !interest){
            return res.status(400).json({success:false,message:"missing details"});
        }
        const alreadyExist = await Community.findOne({
            $or:[{name}, {interest}]
        })
        if(alreadyExist){
            return res.status(400).json({success:false,message:"community already exists"});
        }
        const community = await Community.create({
            name,
            interest,
            description: description || "",
            createdBy: req.user._id,
            members:[req.user._id],
            totalMembers:1

        })
        if(!community){
            return res.status(500).json({success:false,message:"community could not be created"})
        }
       
        return res.status(201).json({success:true,message:"comunity createddd",community})
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false, message:"error in creating community"});
        
    }

}

export const getAllCommunities = async (req,res)=>{
  try {
    const communities = await Community.find().populate("createdBy","name profilePic"); //populate se hme user._id hi nhi uska name or pic bhi mil jayegi createdBy me yeahhhhhh
    res.json({success:true, communities});
  } catch (error) {
    res.status(500).json({success:false});
  }
}

export const getCommunityById = async(req,res)=>{
    try {
        const {id} = req.params;
        const community = await Community.findById(id)
        .populate("createdBy", "name profilePic")
        .populate("members", "name profilePic");
        if(!community){
            return res.status(404).json({success:false,message:"community not found"})
        }
        return res.status(200).json({success:true,community})
        
    } catch (error) {
         res.status(500).json({success:false});
        
    }

   
}

 //join ki apiiiii
    //pehle to bnda login hoga to verify jwt lgana pdega 
    //vo specific community me jayegi with params 
    //vha membes list me vo add hojayega and total members inc
export const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found"
      });
    }

    // prevent joining twice
    if (community.members.includes(req.user._id)) {
      return res.json({
        success: false,
        message: "Already a member"
      });
    }

    await Community.findByIdAndUpdate(id, {
      $addToSet: { members: req.user._id }, //mongo inbuilt useeeeeeeeeeeeee Adds user only if not already present
      $inc: { totalMembers: 1 } //Increases count safely in DB
    });

    return res.status(200).json({
      success: true,
      message: "Joined community successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error joining community"
    });
  }
};
