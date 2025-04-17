const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel'); 

// Get trending posts
router.get('/trending', async (req, res) => {
    try {
        const trendingPosts = await Post.aggregate([
            {
                $addFields: {
                    likeCount: { $size: "$likes" },
                    commentCount: { $size: "$comments" }
                }
            },
            {
                $sort: {
                    likeCount: -1,
                    commentCount: -1,
                    createdAt: -1
                }
            },
            { $limit: 20 }
        ]);
        
        res.json(trendingPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get suggested users
router.get('/suggested-users', async (req, res) => {
    try {
        const currentUserId = req.user._id; // Assuming you have authentication middleware
        
        // Get users not followed by current user
        const currentUser = await User.findById(currentUserId);
        const suggestedUsers = await User.find({
            _id: { $nin: [...currentUser.following, currentUserId] }
        }).limit(10);
        
        res.json(suggestedUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ users: [], posts: [] });

        // Search users
        const users = await users.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } }
            ]
        }).limit(5).select('username fullName profilePicture');

        // Search posts
        const posts = await Posts.find({
            caption: { $regex: query, $options: 'i' }
        }).limit(5).populate('user', 'username profilePicture');

        res.json({ users, posts });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;