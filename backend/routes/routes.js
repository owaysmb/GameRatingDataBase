import express from "express";
import { login, signup ,addToList,addRating,getStats,addFavortie,GetFavorite} from "../controllers/controller.js";
import {AuthMiddleware} from "../middleware/authMiddleware.js"
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


export default router