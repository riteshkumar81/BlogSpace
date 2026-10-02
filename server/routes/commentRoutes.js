const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

// Public route
router.get("/posts/:postId/comments", getComments);

// Protected routes
router.post("/posts/:postId/comments", protect, createComment);
router.put("/comments/:id", protect, updateComment);
router.delete("/comments/:id", protect, deleteComment);

module.exports = router;