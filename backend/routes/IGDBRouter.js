import express from "express";
import {TopRatedGamesPage,NewReleased,TrendingPage,Upcoming} from "../controllers/IGDBController.js"
import {AuthMiddleware} from "../middleware/authMiddleware.js"
const router = express.Router();


router.get("/api/top-rated-page",AuthMiddleware,TopRatedGamesPage);
router.get("/api/new-released-page",AuthMiddleware,NewReleased);
router.get("/api/trending-page",AuthMiddleware,TrendingPage);
router.get("/api/Upcoming-page",AuthMiddleware,Upcoming);




export default router; 