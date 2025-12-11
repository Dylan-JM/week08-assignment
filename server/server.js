//TODO: setup a server

//imports

//configs

//port

//root route

//==========

//TODO: a route to read data from the database

//TODO: a route to create data in the database

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
