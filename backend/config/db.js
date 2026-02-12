import mongoose from "mongoose";
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
const connectDB = async (listen) => {
  try {
    await mongoose.connect(
      "mongodb+srv://Oways:owaysmb2006@gameratingdatabase.axvwkfn.mongodb.net/GRDB?retryWrites=true&w=majority")
    .then(()=>listen);
    
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
