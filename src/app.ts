import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import Stripe from "stripe";
import OpenAI from "openai";
import { User, IUser } from "./models/User";

const app = express();

/* ===========================
   CLIENTS
=========================== */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

if (!process.env.MODEL_API_KEY) {
  throw new Error("MODEL_API_KEY is missing");
}
const client = new OpenAI({
  apiKey: process.env.MODEL_API_KEY,
});

/* ===========================
   STRIPE WEBHOOK (MUST BE FIRST)
=========================== */
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).send("Missing Stripe signature");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          const customerId = (pi.customer as string) ?? null;

          if (customerId) {
            User.findOneAndUpdate(
              { stripeCustomerId: customerId },
              { premium: true },
              { new: true }
            )
              .then((user: IUser | null) => {
                if (user) {
                  console.log(`💎 User ${user.email} upgraded to premium`);
                }
              })
              .catch(console.error);
          }
          break;
        }

        case "payment_intent.payment_failed":
          console.log("❌ Payment failed");
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return res.json({ received: true });
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

/* ===========================
   GLOBAL MIDDLEWARE
=========================== */
app.use(cors());
app.use(helmet());
app.use(express.json());

/* ===========================
   ROUTES
=========================== */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({
    name: "Hashtag Ranking API",
    description: "Discover and rank hashtags to maximize social media reach.",
    endpoints: {
      health: "/health",
      generateCaptions: "/captions/generate?text=...",
      premiumCaptions: "/captions/premium",
    },
  });
});

app.get("/captions/generate", async (req, res) => {
  const text = req.query.text as string;
  if (!text) {
    return res.status(400).json({ error: "Missing 'text' query parameter" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Return JSON { caption, tone }" },
        { role: "user", content: `Generate a viral caption for: ${text}` },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response");

    res.json({ input: text, ...JSON.parse(content) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

app.post("/captions/premium", async (req, res) => {
  const { text, paymentIntentId } = req.body;
  if (!text || !paymentIntentId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return res.status(402).json({ error: "Payment not completed" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Return JSON { caption, tone, hashtags }" },
        { role: "user", content: `Generate a viral caption for: ${text}` },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response");

    res.json({ input: text, ...JSON.parse(content) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate premium caption" });
  }
});

export default app;