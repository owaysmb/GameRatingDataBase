import express from "express";
import { 
    login, 
    signup ,
    addToList,
    addRating,
    getStats,
    addFavortie,
    GetFavorite,
    GetRating,
    addProgress , 
    GetProgress,
    AddReview,
    GetReview,
    AddTextPost,
    AddLinkPost,
    GetAllPosts,
    AddMediaPost,
    DeletePost,
    DeleteReview,
    joinForum,
    getForum,
    updateUserProfile,
    handleLike,
    handleImageUpload,
    handleComment,
    GetComment,
    DeleteComment,
    ProfileByUser,
    logout,
    getMe,
    getForumsByUsername,
    handleCommentLike
    } from "../controllers/controller.js";

import {AuthMiddleware} from "../middleware/authMiddleware.js"
import {OptionalAuthMiddleware} from "../middleware/optionalAuthMiddleware.js"
import multer from 'multer'


const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router();

// Public routes - no auth required
router.post("/login", login);
router.post("/signup", signup);
router.get("/profile/:username", ProfileByUser)
router.get("/profile/:username/forums", getForumsByUsername)
router.get("/getstats", getStats);
router.get("/getfavorite", GetFavorite);
router.get("/getreview", GetReview);
router.get("/getprogress", GetProgress);
router.get("/game/:id/getposts", OptionalAuthMiddleware, GetAllPosts);
router.get("/game/:id/get-forum", OptionalAuthMiddleware, getForum);
router.get("/game/:id/getcomment/:postId", OptionalAuthMiddleware, GetComment);

// Auth required routes
router.get("/me", AuthMiddleware, getMe);
router.post("/logout", AuthMiddleware, logout);
router.put("/:username/profile/update", AuthMiddleware, updateUserProfile);
router.post("/file-upload", AuthMiddleware, upload.single("image"), handleImageUpload);
router.post("/game/:id/addtolist", AuthMiddleware, addToList);
router.post("/game/:id/rate", AuthMiddleware, addRating);
router.post("/game/:id/favorite", AuthMiddleware, addFavortie);
router.get("/game/:id/getrating", AuthMiddleware, GetRating);
router.post("/progress", AuthMiddleware, addProgress);
router.post("/game/:id/addreview", AuthMiddleware, AddReview);
router.post("/game/:id/addtextpost", AuthMiddleware, AddTextPost);
router.post("/game/:id/addlinkpost", AuthMiddleware, AddLinkPost);
router.post('/game/:id/addmediapost', AuthMiddleware, upload.single('media'), AddMediaPost);
router.delete("/game/:id/deletepost/:postId", AuthMiddleware, DeletePost);
router.delete("/deletereview/:reviewId", AuthMiddleware, DeleteReview);
router.post("/game/:id/join-forum", AuthMiddleware, joinForum);
router.post("/post-like", AuthMiddleware, handleLike);
router.post("/game/:id/addcomment", AuthMiddleware, handleComment);
router.delete("/game/:id/deletecomment/:commentID", AuthMiddleware, DeleteComment);
router.post("/comment-like", AuthMiddleware, handleCommentLike);

export default router
