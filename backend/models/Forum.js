import mongoose from "mongoose";


const ForumSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  Forums:[{
    type: String,
    ref: "Forum",
  }],

}, { timestamps: true })



export default mongoose.model('Forum', ForumSchema)