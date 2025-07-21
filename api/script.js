import { MongoClient } from "mongodb";

// Access the environment variable
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = client.db("logsDB");
    const collection = db.collection("accessLogs");

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      "unknown";

    await collection.insertOne({
      ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date(),
    });

    client.close();

    res.status(200).json({ status: "logged" });
  } catch (error) {
    console.error("Logging failed:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}