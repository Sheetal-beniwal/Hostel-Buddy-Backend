/*
so now we want to add lost and found system so here what we will do is .....
student losted something he we will post about that the whole description and everything and than if another user finds anything he will update then the owner will delete the post  

lost model
item name
item photo
description in detail 
section of is found
owner details 
found person details
they will contact then post delete


then controller of create post 
then controller of marking found
then controller of delete post


api 1 --> create post
api 2--> get all posts
api 3 --> get specific post
api 4--> mark item as found
api 5--> delete post

 */

import mongoose from "mongoose";
import User from "./user.model.js";

const lostItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    itemPic: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["lost", "found"],
        required: true
    },
    status: {
        type: String,
        enum: ["open", "close"],
        default: "open"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }


}, { timestamps: true })

const LostItem = mongoose.model("LostItem", lostItemSchema);
export default LostItem;
