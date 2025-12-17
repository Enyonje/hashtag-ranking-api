import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3000;

/* ===========================
   SERVER START
=========================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ===========================
   DATABASE CONNECTION
=========================== */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
