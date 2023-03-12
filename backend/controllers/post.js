const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary")

exports.createPost = async (req, res) => {
    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "posts"
        })
        const data = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner: req.user._id
        };

        const post = await Post.create(data);
        const user = await User.findById(data.owner);
        user.posts.unshift(post._id);
        await user.save();

        res.status(201).json({ success: true, message: "Post created" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Compare User Id
        if (post.owner.toString() != req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id)
        await post.remove();

        // Remove post from user database
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();

        res.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });
        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();

            return res.status(200).json({ success: true, message: "Post Unliked" });
        }
        else {
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({ success: true, message: "Post Liked" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Find posts of user following
        const posts = await Post.find({
            owner: {
                $in: user.following
            }
        }).populate("owner likes comments.user")
        res.status(200).json({ success: true, posts: posts.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Compare User Id
        if (post.owner.toString() != req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        post.caption = req.body.caption;
        await post.save();

        res.status(200).json({ success: true, message: "Post updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        let index = -1;
        // Checking if comment already exists
        post.comments.forEach((comment, i) => {
            if (comment.user.toString() === req.user._id.toString()) {
                index = i;
            }
        });
        if (index !== -1) {
            post.comments[index].comment = req.body.comment;
            await post.save();
            return res.status(200).json({ success: true, message: "Comment Updated" });
        }
        else {
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment
            });

            await post.save();
            return res.status(200).json({ success: true, message: "Comment Added" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Checking if owner wants to delete
        if (post.owner.toString() === req.user._id.toString()) {
            if (req.body.commentId === undefined) {
                return res.status(400).json({ success: false, message: "Comment Id is required" });
            }
            post.comments.forEach((comment, i) => {
                if (comment._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(i, 1);
                }
            });

            await post.save();
            return res.status(200).json({ success: true, message: "Selected comment has deleted" });
        }
        else {
            // Checking if comment already exists
            post.comments.forEach((comment, i) => {
                if (comment.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(i, 1);
                }
            });

            await post.save();
            return res.status(200).json({ success: true, message: "Your comment has deleted" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}