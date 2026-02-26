import mongoose from "mongoose";

const connectDB = async () => {
  try {

    // 1️⃣ check env loaded
    if (!process.env.MONGO_URL) {
      console.error("❌ MONGO_URL not found in environment variables");
      process.exit(1);
    }

    // 2️⃣ debug (temporary — remove later)
    console.log("Connecting to:", process.env.MONGO_URL);

    // 3️⃣ connect
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "booking",
    });

    console.log("✅ MongoDB connected successfully");

  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  }
};


// connection listeners
mongoose.connection.on("connected", () => {
  console.log("📦 MongoDB connection open");
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

export default connectDB;