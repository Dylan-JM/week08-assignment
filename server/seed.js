import { db } from "./dbConnection.js";

db.query(
  `INSERT INTO guestbook (username, message, category) VALUES ($1, $2, $3)`,
  ["Dylan", "Love this game!", "Review"]
);
db.query(
  `INSERT INTO guestbook (username, message, category) VALUES ($1, $2, $3)`,
  ["Alex", "Found a bug in level 3.", "Bug"]
);
db.query(
  `INSERT INTO guestbook (username, message, category) VALUES ($1, $2, $3)`,
  ["Will", "Can we have more multiplayer options?", "Suggestion"]
);
db.query(
  `INSERT INTO guestbook (username, message, category) VALUES ($1, $2, $3)`,
  ["Kian", "Anyone want to squad up?", "Other"]
);
