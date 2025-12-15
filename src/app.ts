import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import Stripe from "stripe";
import OpenAI from "openai";
import User from "./models/User"; // MongoDB User model

// Initialize app
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Stripe + OpenAI clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const client = new OpenAI({ apiKey: process.env.MODEL_API_KEY });

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Root landing route
app.get("/", (req, res) => {
  res.json({
    name: "Hashtag Ranking API",
    description: "Discover and rank hashtags to maximize social media reach.",
    docs: "https://github.com/evanjom/hashtag-ranking-api#readme",
    endpoints: {
      health: "/health",
      rankHashtags: "/hashtags/rank?keyword={keyword}&limit={n}",
      generateCaptions: "/captions/generate?text={input}",
      premiumCaptions: "/captions/premium"
    }
  });
});

// Free caption generator
app.get("/captions/generate", async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "Missing 'text' query parameter" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a caption generator for TikTok/Reels. Always return JSON with {caption:string, tone:string}."
        },
        {
          role: "user",
          content: `Generate a viral caption for: ${text}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "caption_schema",
          schema: {
            type: "object",
            properties: {
              caption: { type: "string" },
              tone: { type: "string" }
            },
            required: ["caption", "tone"],
            additionalProperties: false
          }
        }
      }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json({ input: text, ...parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

// Premium caption generator (Stripe-protected)
app.post("/captions/premium", async (req, res) => {
  const { text, paymentIntentId } = req.body;
  if (!text || !paymentIntentId) {
    return res.status(400).json({ error: "Missing text or paymentIntentId" });
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return res.status(402).json({ error: "Payment not completed" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a premium caption generator. Return JSON with {caption, tone, hashtags}." },
        { role: "user", content: `Generate a viral caption for: ${text}` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "premium_caption_schema",
          schema: {
            type: "object",
            properties: {
              caption: { type: "string" },
              tone: { type: "string" },
              hashtags: { type: "array", items: { type: "string" } }
            },
            required: ["caption", "tone", "hashtags"],
            additionalProperties: false
          }
        }
      }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json({ input: text, ...parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate premium caption" });
  }
});

// Stripe webhook handler
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const customerId = paymentIntent.customer as string;

      User.findOneAndUpdate(
        { stripeCustomerId: customerId },
        { premium: true },
        { new: true }
      )
        .then(user => {
          if (user) {
            console.log(`💎 User ${user.email} upgraded to premium`);
          } else {
            console.log("No user found for customer:", customerId);
          }
        })
        .catch(err => console.error("DB update error:", err));
      break;

    case "payment_intent.payment_failed":
      console.log("❌ Payment failed");
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default app;