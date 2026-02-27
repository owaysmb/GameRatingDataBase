import express from "express";
import { login, signup } from "../controllers/controller.js";
import {AuthMiddleware} from "../middleware/authMiddleware.js"
const router = express.Router();

router.post("/profile", AuthMiddleware, (req,res)=>{
    res.json({message:"Protected route",user:req.user})
})
router.post("/login", login);
router.post("/signup", signup);

export default router