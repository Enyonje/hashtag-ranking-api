import express from "express";
import app from "./app.js";

const PORT = process.env.PORT || 8080;

// Stripe webhook needs raw body
app.use(
  "/webhook",
  express.raw({ type: "application/json" })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});