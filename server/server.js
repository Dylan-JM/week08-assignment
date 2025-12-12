import express from "express";
import cors from "cors";
import { db } from "./dbConnection.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 8080;

app.listen(PORT, () => {
  console.log(
    `Server is running on https://week08-assignment-server.onrender.com:${PORT}`
  );
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// read data from database
app.get("/guestbook", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM guestbook ORDER BY id ASC");
    res.json({ guestbook: result.rows });
  } catch (err) {
    console.error("Error fetching guestbook:", err);
    res.status(500).json({ error: "Failed to fetch guestbook" });
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

//delete posts
app.delete("/guestbook/:id", async (req, res) => {
  const id = req.params.id;

  await db.query("DELETE FROM guestbook WHERE id = $1", [id]);
  res.json({ status: "success", message: `Entry with id ${id} deleted.` });
});

//like button
app.post("/guestbook/:id/like", async (req, res) => {
  const id = req.params.id;

  await db.query("UPDATE guestbook SET likes = likes + 1 WHERE id = $1", [id]);
  res.json({ status: "success", message: `Entry with id ${id} liked.` });
});
