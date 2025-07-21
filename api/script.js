import { MongoClient } from "mongodb";
import fetch from "node-fetch";  // If your environment doesn’t have fetch, you may need this package

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  let client;

  try {
    client = await MongoClient.connect(uri);
    const db = client.db("logs");
    const collection = db.collection("messages");

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || "unknown";

    // Query IP geolocation API
    let geo = {};
    if (ip && ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,lat,lon,timezone,isp,org,query`);
      geo = await geoRes.json();
      if (geo.status !== "success") geo = {};
    }

    await collection.insertOne({
      ip,
      geo,
      userAgent: req.headers["user-agent"] || "unknown",
      referrer: req.headers["referer"] || req.headers["referrer"] || "none",
      acceptLanguage: req.headers["accept-language"] || "unknown",
      cookies: req.headers["cookie"] || "",
      headers: JSON.stringify(req.headers || {}),
      method: req.method,
      query: JSON.stringify(req.query || {}),
      remotePort: req.connection?.remotePort || null,
      timestamp: new Date(),
    });

    res.status(200).json({ status: "logged", geo });
  } catch (error) {
    console.error("Logging failed:", error);
    res.status(500).json({ status: "error", error: error.message });
  } finally {
    if (client) await client.close();
  }
}