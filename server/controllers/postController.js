const Post = require("../models/Post");
const User = require("../models/User");

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      const error = new Error("Title and content are required");
      error.statusCode = 400;
      return next(error);
    }

    // Create post with authenticated user as author
    const post = await Post.create({
      title,
      content,
      author: req.user._id
    });

    // Populate author information for response (without password)
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name _id"
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: populatedPost
    });
  } catch (err) {
    next(err);
  }
};

// Get all posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Newest first
      .populate("author", "name _id"); // Populate author without password

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// Get single post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name _id");

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: post
    });
  } catch (err) {
    // Handle invalid ObjectId
    if (err.name === "CastError") {
      const error = new Error("Invalid post ID");
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;

    // Find post
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to update this post");
      error.statusCode = 403;
      return next(error);
    }

    // Validate input
    if (!title || !content) {
      const error = new Error("Title and content are required");
      error.statusCode = 400;
      return next(error);
    }

    // Update post (only allowed fields)
    post.title = title;
    post.content = content;

    const updatedPost = await post.save();

    // Populate author for response
    const populatedPost = await Post.findById(updatedPost._id).populate(
      "author",
      "name _id"
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: populatedPost
    });
  } catch (err) {
    // Handle invalid ObjectId
    if (err.name === "CastError") {
      const error = new Error("Invalid post ID");
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    // Find post
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to delete this post");
      error.statusCode = 403;
      return next(error);
    }

    // Delete post
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: {}
    });
  } catch (err) {
    // Handle invalid ObjectId
    if (err.name === "CastError") {
      const error = new Error("Invalid post ID");
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};