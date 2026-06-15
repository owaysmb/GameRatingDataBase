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
    DeleteReview
    } from "../controllers/controller.js";

import {AuthMiddleware} from "../middleware/authMiddleware.js"
import multer from 'multer'


const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router();

router.post("/profile", AuthMiddleware, (req,res)=>{
    res.json({message:"Protected route",user:req.user})
})
router.post("/login", login);
router.post("/signup", signup);
router.post("/game/:id/addtolist", AuthMiddleware, addToList);
router.post("/game/:id/rate", AuthMiddleware, addRating);
router.get("/getstats",AuthMiddleware,getStats);
router.post("/game/:id/favorite",AuthMiddleware,addFavortie);
router.get("/getfavorite",AuthMiddleware,GetFavorite);
router.get("/game/:id/getrating",AuthMiddleware,GetRating);
router.post("/progress",AuthMiddleware,addProgress);
router.get("/getprogress",AuthMiddleware,GetProgress);
router.post("/game/:id/addreview",AuthMiddleware,AddReview);
router.get("/getreview",AuthMiddleware,GetReview);
router.post("/game/:id/addtextpost",AuthMiddleware,AddTextPost);
router.post("/game/:id/addlinkpost",AuthMiddleware,AddLinkPost);
router.get("/game/:id/getposts",AuthMiddleware,GetAllPosts);
router.post('/game/:id/addmediapost', AuthMiddleware, upload.single('media'), AddMediaPost);
router.delete("/game/:id/deletepost/:postId", AuthMiddleware, DeletePost);
router.delete("/deletereview/:reviewId", AuthMiddleware, DeleteReview);

export default router