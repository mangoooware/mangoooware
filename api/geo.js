// /api/geo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Set this in Vercel environment variables

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let client;
  try {
    const { geo, userAgent, referrer, acceptLanguage, cookies } = req.body;

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("your-db-name");       // Replace with your DB name
    const collection = db.collection("geo_logs");

    await collection.insertOne({
      geo: geo || {},
      userAgent: userAgent || "unknown",
      referrer: referrer || "None",
      acceptLanguage: acceptLanguage || "unknown",
      cookies: cookies || "",
      headers: JSON.stringify(req.headers || {}),
      method: req.method,
      timestamp: new Date()
    });

    res.status(200).json({ status: "logged" });
  } catch (err) {
    console.error("MongoDB logging failed:", err);
    res.status(500).json({ status: "error", error: err.message });
  } finally {
    if (client) await client.close();
  }
} 