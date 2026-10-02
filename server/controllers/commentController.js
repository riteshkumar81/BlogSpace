const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Create a new comment
exports.createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    // Validate input
    if (!content || content.trim() === "") {
      const error = new Error("Comment content is required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      return next(error);
    }

    // Create comment with authenticated user as author and post from params
    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      post: postId
    });

    // Populate author information for response (without password)
    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name _id"
    );

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: populatedComment
    });
  } catch (err) {
    next(err);
  }
};

// Get all comments for a post
exports.getComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      return next(error);
    }

    // Retrieve comments belonging to that post, newest first
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 }) // Newest first
      .populate("author", "name _id"); // Populate author without password

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments
    });
  } catch (err) {
    next(err);
  }
};

// Update comment
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const commentId = req.params.id;

    // Validate input
    if (!content || content.trim() === "") {
      const error = new Error("Comment content is required");
      error.statusCode = 400;
      return next(error);
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to update this comment");
      error.statusCode = 403;
      return next(error);
    }

    // Update comment (only allowed field: content)
    comment.content = content.trim();

    const updatedComment = await comment.save();

    // Populate author for response
    const populatedComment = await Comment.findById(updatedComment._id).populate(
      "author",
      "name _id"
    );

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: populatedComment
    });
  } catch (err) {
    next(err);
  }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      const error = new Error("Comment not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to delete this comment");
      error.statusCode = 403;
      return next(error);
    }

    // Delete comment
    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: {}
    });
  } catch (err) {
    next(err);
  }
};