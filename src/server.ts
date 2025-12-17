import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3000;

/* ===========================
   DATABASE CONNECTION
=========================== */
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log(`🚀 Server running on port ${PORT}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });