import mongoose from "mongoose";


const ForumSchema = new mongoose.Schema({
  gameId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  name:      { type: String, required: true },
}, { timestamps: true })


ForumSchema.index({ gameId: 1 })