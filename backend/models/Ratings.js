import mongoose from "mongoose";

const RatingsSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  ,
  rating: {
    value:{
      one:[{type: String}],
      two:[{type: String}],
      three:[{type: String}],
      four:[{type: String}],
      five:[{type: String}],
    }
  }
}, { timestamps: true });

export default mongoose.model("Rating", RatingsSchema);
