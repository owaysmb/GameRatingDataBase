import mongoose from "mongoose";
// import dns from 'node:dns/promises';
// dns.setServers(['1.1.1.1', '8.8.8.8']);
// "mongodb+srv://Oways:oways123123@gameratingdatabase.axvwkfn.mongodb.net/GRDB?retryWrites=true&w=majority"
const connectDB = async (listen) => {
  try {
    await mongoose.connect(
      "mongodb+srv://Oways:oways123123@gameratingdatabase.axvwkfn.mongodb.net/GRDB?retryWrites=true&w=majority")
    .then(()=>
    {
      listen
      console.log("Connected to DB:", mongoose.connection.host);
      console.log("Database name:", mongoose.connection.name);
    }

  );
    
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
