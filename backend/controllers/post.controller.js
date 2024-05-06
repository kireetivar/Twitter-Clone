import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";


export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" })

        if (!img && !text) {
            return res.status(400).json({ error: "Post must have text or image" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        })

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(500).json({ Error: "Internal server error Creating Post" })
        console.log("Error in Create Post controller: ", error);
    }
}


export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ msg: "Post not found" })

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete the post" })
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" })

    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
        console.log("ERROR in deletePost Controller : ", error);
    }
}

export const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) return res.status(400).json({ error: "Text field is required" });

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = { user: userId, text }

        post.comments.push(comment);
        await post.save()

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ Error: "Internal Server error at comment Post" })
        console.log("Error in Comment Post : ", error);
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ Msg: "Post not found" })
        }

        const userLikePost = post.likes.includes(userId);

        if (userLikePost) {
            // unlike
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());

            res.status(201).json({ message: "Post unliked Successfully" })

        } else {
            //like
            post.likes.push(userId)
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            })
            await notification.save();

            res.status(200).json({ message: "Post liked successfully" })
        }




    } catch (error) {
        res.status(500).json({ Error: "Internal server error in post like" })
        console.log("Error win likeUnlike post : ", error);
    }
}


export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ Error: "Internal server error in get all" })
        console.log("Error win getAll post : ", error);
    }
}

export const getLikedPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ error: "User Not Found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            })

        res.status(200).json(likedPosts)
    } catch (error) {
        res.status(500).json({ Error: "Internal server error in getLiked Posts" })
        console.log("Error win getLiked post : ", error);
    }
}