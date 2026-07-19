import express from "express";
import {TopRatedGamesPage,NewReleased,TrendingPage,Upcoming} from "../controllers/IGDBController.js"
const router = express.Router();

router.get("/api/top-rated-page",TopRatedGamesPage);
router.get("/api/new-released-page",NewReleased);
router.get("/api/trending-page",TrendingPage);
router.get("/api/Upcoming-page",Upcoming);

export default router;
