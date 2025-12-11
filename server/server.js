import express from "express";
import cors from "cors";

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
app.get("/messages", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM messages ORDER BY id ASC");
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// create data in database
app.post("/messages", async (req, res) => {
  const { msg_name, content } = req.body;

  const query = db.query(
    `INSERT INTO messages (msg_name, content) VALUES ($1, $2) RETURNING *`,
    [msg_name, content]
  );
  res.json({ status: "success", values: msg_name, content });
});
