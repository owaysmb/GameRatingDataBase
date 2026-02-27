import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  ,gameId: {
    type: String,
    required: true,
    unique: true
  },
  reviewText: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Reviews", ReviewsSchema);
