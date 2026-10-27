import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    igdbId: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    cover: {
      type: String,
    },

    summary: {
      type: String,
    },

    rating: {
      type: Number,
    },

    releaseDate: {
      type: Date,
    },

    genres: [
      {
        type: String,
      },
    ],

    platforms: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Game", gameSchema);