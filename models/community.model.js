import mongoose from 'mongoose';
import User from './user.model.js';

const communitySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    interest:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true   

    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },  
    members:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    },
    totalMembers:{
        type:Number,
        default:0
    }
})
 const Community = mongoose.model("Community",communitySchema);
 export default Community;