import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  ,games: [{
    gameId: {
      type: String,
      required: true
    },
    review: {
      text: { type: String },
      rating: { type: Number, min: 1, max: 10 }
    }
  }]
  
}, { timestamps: true });

export default mongoose.model("Review", ReviewsSchema);
