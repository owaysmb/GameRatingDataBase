import mongoose from "mongoose";

const ListsSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  playing: [{
   type: String
  }],

  played: [{
   type: String
  }],

  OnHold:[{
   type: String
  }],

  WantToPlay:[{
   type: String
  }],

  DontWantToPlay:[{
   type: String
  }],
  

},{ timestamps: true });

export default mongoose.model("List", ListsSchema);
