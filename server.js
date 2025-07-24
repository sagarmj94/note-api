const express = require("express");
const connectDB = require("./src/db/db");
const notesRoutes = require("./src/routes/noteRoutes");

const app = express();

app.use(express.json());
connectDB();

app.use("/api/notes", notesRoutes); // ✅ base route

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});
