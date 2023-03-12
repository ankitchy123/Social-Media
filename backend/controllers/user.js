const User = require("../models/User");
const Post = require("../models/Post");
const { sendEmail } = require("../middleware/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary")

exports.register = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "User already exists" });

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars"
        })
        user = await User.create({ name, email, password, avatar: { public_id: myCloud.public_id, url: myCloud.secure_url, } });

        const token = await user.generateToken();
        res
            .status(201)
            .cookie("token", token, { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true })
            .json({ success: true, user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password").populate("posts followers following");
        if (!user) return res.status(400).json({ success: false, message: "User does not exists" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect Password" });

        const token = await user.generateToken();
        res
            .status(200)
            .cookie("token", token, { expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), httpOnly: true })
            .json({ success: true, user, token });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.logout = async (req, res) => {
    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({ success: true, message: "Logged out" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if (!userToFollow) return res.status(404).json({ success: false, message: "User not found" });

        if (loggedInUser.following.includes(userToFollow._id)) {
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexFollower = userToFollow.followers.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexFollowing, 1);
            userToFollow.followers.splice(indexFollower, 1);

            await loggedInUser.save();
            await userToFollow.save();
            return res.status(200).json({ success: true, message: "User unfollowed" });
        }
        else {
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({ success: true, message: "User followed" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide old and new password" });
        }

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect Old Password" });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email, avatar } = req.body;
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        if (avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatars"
            })

            user.avatar.public_id = myCloud.public_id
            user.avatar.url = myCloud.secure_url
        }
        await user.save();
        res.status(200).json({ success: true, message: "Profile updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Deleting all posts of the user
        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]);
            await post.remove();
        }

        // Removing user from follower's following
        for (let i = 0; i < user.followers.length; i++) {
            const follower = await User.findById(user.followers[i]);

            const index = follower.following.indexOf(user._id);
            follower.following.splice(index, 1);
            await follower.save();
        }

        // Removing user from following's follower
        for (let i = 0; i < user.following.length; i++) {
            const follows = await User.findById(user.following[i]);

            const index = follows.followers.indexOf(user._id);
            follows.followers.splice(index, 1);
            await follows.save();
        }

        const posts = await Post.find({});
        posts.forEach(async (post) => {
            if (post.likes.includes(user._id)) {
                const index = post.likes.indexOf(user._id);
                post.likes.splice(index, 1);
                await post.save();
            }

            const index = post.comments.findIndex(e => e.user.toString() === user._id.toString());
            if (index > -1) {
                post.comments.splice(index, 1);
                await post.save();
            }
        });

        await user.remove();

        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({ success: true, message: "Profile Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts followers following");
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("posts followers following");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select("+password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const resetPasswordToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

        const message = `Reset your password by clicking on the link below: \n\n ${resetUrl}`;

        try {
            await sendEmail({ email: user.email, subject: "Reset Password", message });
            res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({ success: false, message: error.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Token is invalid or has expired" });
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const posts = []
        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner")
            posts.push(post)
        }
        return res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}