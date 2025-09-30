const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1) Connect to MongoDB (replace <password> with your MongoDB Atlas password)
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.mongodb.net/commentsDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// 2) Create Schema + Model
const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model("Comment", commentSchema);

// 3) API Routes
app.post("/comments", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.json({ status: "success", message: "Comment saved" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/comments", async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

// 4) Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
