import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, deletePost, commentPost, likeUnlikePost, getAllPost, getLikedPost, getFollowingPosts , getUserPosts} from "../controllers/post.controller.js";


const router = express.Router();


router.get("/all", protectRoute, getAllPost)
router.get("/likes/:id", protectRoute, getLikedPost)
router.get("/following", protectRoute, getFollowingPosts)
router.get("/user/:username", protectRoute, getUserPosts)
router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, commentPost)
router.delete("/:id", protectRoute, deletePost)


export default router;