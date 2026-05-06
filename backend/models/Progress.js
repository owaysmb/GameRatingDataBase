import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  Progress: {
    type: Map,
    of: Number,
    default: {}
  }
    

},{ timestamps: true });

export default mongoose.model("Progress", ProgressSchema);
