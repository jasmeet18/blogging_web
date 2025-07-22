const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt'); // fixed typo
const Post = require('../models/Post');
const Comment = require('../models/Comments');
const verifyToken = require('../verifyToken');


// CREATE POST
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: "Post creation failed", error: err });
  }
});

// Update post
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("Post not found");
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json("You can only edit your own post");
        }
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json("Post not found");
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json("You can only delete your own post");
        }
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ postId: req.params.id }); // Match with your schema field
        res.status(200).json("Post deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get post details
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // Fixed: was using delete
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get posts (searchable)
router.get("/", async (req, res) => {
    try {
        const searchFilter = req.query.search
            ? { title: { $regex: req.query.search, $options: "i" } }
            : {};
        const posts = await Post.find(searchFilter);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get user posts
router.get("/user/:userId", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
