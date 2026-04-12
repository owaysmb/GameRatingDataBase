import mongoose from "mongoose";

const connectDB = async (listen) => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION)
    .then(() => {
      listen;
      console.log("Connected to DB:", mongoose.connection.host);
      console.log("Database name:", mongoose.connection.name);
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;