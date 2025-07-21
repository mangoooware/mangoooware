import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || 'unknown';
  const time = new Date();

  const logEntry = {
    ip,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    timestamp: time,
  };

  try {
    await client.connect();
    const db = client.db('logsDB');          // Database name — can be anything you want
    const collection = db.collection('accessLogs');  // Collection name

    await collection.insertOne(logEntry);

    await client.close();

    res.status(200).json({ status: 'logged' });
  } catch (error) {
    console.error('MongoDB logging error:', error);
    res.status(500).json({ error: 'Logging failed' });
  }
}