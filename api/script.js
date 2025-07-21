import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  let client;
  try {
    client = await MongoClient.connect(uri);

    const db = client.db("logs");               // match your DB name
    const collection = db.collection("messages");  // match your collection name

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || "unknown";

    await collection.insertOne({
      ip,
      userAgent: req.headers["user-agent"] || "unknown",
      timestamp: new Date(),
    });

    res.status(200).json({ status: "logged" });
  } catch (error) {
    console.error("Logging failed:", error);
    res.status(500).json({ status: "error", error: error.message });
  } finally {
    if (client) await client.close();
  }
}