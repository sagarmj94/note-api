const express = require("express");
const router = express.Router();
const Note = require("../models/notes.model");

// GET /api/notes
router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// POST /api/notes
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("Incoming Body:", req);
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and Content are required" });
    }

    const note = new Note({ title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// PUT /api/notes/:id - Update a note by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updatedNote);
  } catch (err) {
    console.error("UPDATE Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// PATCH /api/notes/:id - Partially update a note by ID
router.patch("/:id", async (req, res) => {
  try {
    const updates = req.body;

    // Validate that there's something to update
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const patchedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!patchedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(patchedNote);
  } catch (err) {
    console.error("PATCH Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
