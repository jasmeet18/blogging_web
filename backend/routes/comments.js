const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comments');

const verifyToken = require('../verifyToken');

// Create a comment
router.post("/create", verifyToken, async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a comment
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json("Comment not found");
        if (comment.userID.toString() !== req.user.id) {
            return res.status(403).json("You can only edit your own comment");
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a comment
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json("Comment not found");
        if (comment.userID.toString() !== req.user.id) {
            return res.status(403).json("You can only delete your own comment");
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json("Comment deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get comments for a post
router.get("/post/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
