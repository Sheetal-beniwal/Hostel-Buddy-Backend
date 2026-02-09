import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
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
export const Community = mongoose.model(Community,communitySchema)