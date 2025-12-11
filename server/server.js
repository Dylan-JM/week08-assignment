import express from "express";
import cors from "cors";
import { db } from "./dbConnection.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// read data from database
app.get("/guestbook", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM messages ORDER BY id ASC");
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// create data in database
app.post("/guestbook", async (req, res) => {
  const { username, message, category } = req.body;

  const query = db.query(
    `INSERT INTO guestbook (username, message, category) VALUES ($1, $2, $3) RETURNING *`,
    [username, message, category]
  );
  res.json({ status: "success", values: username, message, category });
});
