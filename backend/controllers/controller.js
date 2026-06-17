
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import {cache, clearCache} from "../cache.js"

import mongoose from "mongoose";
// users Model imports 
import userSchema from "../models/User.js"
import ReviewsSchema from "../models/Reviews.js";
import RatingsSchema from "../models/Ratings.js";
import ListsSchema from "../models/Lists.js";
import FavoriteSchema from "../models/Favorite.js"
import ProgressSchema from "../models/Progress.js";
import Progress from "../models/Progress.js";
import  Post  from '../models/Posts.js';

// Cloudniary imports   
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const upload = multer({ storage: multer.memoryStorage() })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})
console.log("Cloudinary config:", cloudinary.config())

export const login = async (req,res)=>{
    try {
        const { email, password } = req.body

        const user = await userSchema.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        
        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" })
        }

        const token = jwt.sign( 
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" })
        
        res.json({ message: "Login successful" ,user,token})

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }



}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userSchema({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()
        res.status(201).json({
            message: "Signup successful",
            user: savedUser
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}


export const addToList = async (req,res) =>{
    try{
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        const gameId = req.params.id;
        const { status } = req.body;

        let list = await ListsSchema.findOne({ userId });
        await clearCache(`list:all:${userId}`);
        if (!list) {
            list = new ListsSchema({ userId });
        }

        const statusMap = {
            "playing": "playing",
            "played": "played",
            "on-hold": "OnHold",
            "want to play": "WantToPlay",
            "dont want to play": "DontWantToPlay"
        };
            const field = statusMap[status];
            
            if(field){
                if (!list[field].includes(gameId)) {
                    for (const check of Object.values(statusMap)) {
                        
                            if(list[check].includes(gameId)){
                                let index = list[check].indexOf(gameId);
                                if(index > -1){
                                    list[check].splice(index,1);
                                }
                        }
                        
                    }
                    list[field].push(gameId);
                }
            }
        
        
        await list.save();
        console.log("saved")
        res.json({ message: "Game added to list", list });

    }catch (err){
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

export const addRating = async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const rating = req.body.rating
        const gameId = req.params.id
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let userRating = await RatingsSchema.findOne({userId})
        await clearCache(`rating:all:${userId}`);
        if(!userRating){
            userRating  = new RatingsSchema({userId})
        }

        const RateRules = {
            "one":"1",
            "two":"2",
            "three":"3",
            "four":"4",
            "five":"5"
        }
for (const key of Object.keys(userRating.rating.value)) {
                const index = userRating.rating.value[key].indexOf(gameId);

                if (index > -1) {
                    userRating.rating.value[key].splice(index, 1);
                }
            }

        for (const [k,v] of Object.entries(RateRules)) {

            await clearCache(`rating:${userId}:${gameId}`);
            if(v == rating.toString()){

                if(userRating.rating.value[k].includes(gameId) ){ 
                    let index = userRating.rating.value[k].indexOf(gameId);
                    if(index > -1){
                        userRating.rating.value[k].splice(index,1);
                    }
                }

                userRating.rating.value[k].push(gameId)
            }
            
        }
        await userRating.save()

    } catch (err) {
        console.log(err)
    }
}

export const getStats = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        const list = await cache(`list:all:${userId}`, () => ListsSchema.findOne({ userId }));

        if (!list) {
            return res.json({
                played: [], playing: [], OnHold: [],
                WantToPlay: [], DontWantToPlay: [], allgames: []
            });
        }

        res.json({
            ...list,
            allgames: [
                ...(list.played ?? []),
                ...(list.playing ?? []),
                ...(list.OnHold ?? []),
                ...(list.WantToPlay ?? []),
                ...(list.DontWantToPlay ?? []),
            ]
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const addFavortie = async (req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const gameId = req.params.id
    const favorite = req.body.favorite
    if(!userId){
        console.log("user not dound")
    }
    let userFavorite = await FavoriteSchema.findOne({userId})
    await clearCache(`favorite:${userId}`);
    if(!userFavorite){
        userFavorite = new FavoriteSchema({userId})
    }

    if(favorite && !userFavorite.Favorites.includes(gameId)){
        userFavorite.Favorites.push(gameId);
    }else if(!favorite && userFavorite.Favorites.includes(gameId)){
        let index = userFavorite.Favorites.indexOf(gameId);
        if(index > -1){
            userFavorite.Favorites.splice(index,1);
        }
    }
     userFavorite.save();

}

export const GetFavorite = async (req,res)=>{
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

    let fav = await cache(`favorite:${req.user.id}`, () => FavoriteSchema.findOne({userId:req.user.id}));    
    res.json(fav)
    
    } catch (err) {
        console.log(err)
    }
    
}

export const GetRating = async (req,res)=>{
    try {
        const gameId = req.params.id;

        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let rate = await cache(`rating:${req.user.id}:${gameId}`, () => RatingsSchema.findOne({userId:req.user.id}));    
        const RateMap  = {one:1 , two:2,three:3 , four: 4 , five : 5}

            for (const [k,v] of Object.entries(RateMap)) {
                if( rate.rating.value[k]?.includes(gameId) ) return res.json({ rating: v });
            }
        res.json({rating:null});

    
    } catch (err) {
        console.log(err)
    }
}

export const addProgress = async (req,res)=>{
    try {

        const gameId = req.body.game;
        const progress = req.body.newProgress;

        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);

        let userProgress = await ProgressSchema.findOne({ userId });

        await clearCache(`progress:${userId}`);

        if (!userProgress) {
            userProgress = new ProgressSchema({ userId });
        }
        let totalHours = 0;

        for (const [k,v] of userProgress.Progress) {
            if(k != "TotalHours" ) totalHours += v;    
        }
        
        userProgress.Progress.set(String(gameId), progress);
        userProgress.Progress.set("TotalHours" , totalHours);
        await userProgress.save();

    } catch (err) {
        console.log(err);
    }
}

export const GetProgress =  async (req,res)=>{
    try {
        
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        let UserProgress = await  cache(`progress:${req.user.id}`, () => ProgressSchema.findOne({userId:req.user.id}));
        
        res.json({UserProgress}); 


    } catch (err) {
        console.log(err);
    }
}

export const AddReview = async (req,res)=>{
    try {

        const userId = new mongoose.Types.ObjectId(req.user.id);
        const gameId = req.params.id;
        const { review } = req.body; 
        
        let UserReview = await ReviewsSchema.findOne({ userId });

        await clearCache(`review:all:${userId}`);

        if (!UserReview) {
            UserReview = new ReviewsSchema({ userId });
        }

        UserReview.games.push({ gameId, review: { text: review } });
        await UserReview.save();
        res.json({ message: "Review added successfully" });

     } catch (err) {
        console.log(err);
    }
}


export const GetReview = async (req,res)=>{
    try {
        const gameId = req.params.id;         
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let UserReview = await cache(`review:${req.user.id}:${req.user.id}`, () => ReviewsSchema.findOne({ userId: req.user.id }));

        if (!UserReview) {
            return res.json({ review: null });
        }
        
        const reviews = UserReview.games.map(game => ({
            gameId: game.gameId,
            review: game.review.text,
            reviewId: game._id
        }));

        return res.json({ reviews });

    } catch (err) {
        console.log(err);
    }
}


export const AddTextPost = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const gameId = req.params.id;
        const { title, body } = req.body;

        const post = new Post({
            forumId: gameId,
            userId,
            type: "text",
            title,
            text: body,
            likes: 0,
            disLikes: 0
        })
        await clearCache(`posts:${gameId}`); 
        await post.save()

        res.status(201).json(post)

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    }
}



export const AddLinkPost = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const gameId = req.params.id;
        const { title, body ,linkUrl} = req.body;

        const post = new Post({
            forumId: gameId,
            userId,
            type: "link",
            title,
            text: body,
            linkUrl,
            likes: 0,
            disLikes: 0
        })

        await clearCache(`posts:${gameId}`); 
        await post.save()

        res.status(201).json(post)

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" })
    }
}

export const GetAllPosts = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const gameId = req.params.id;
    const posts = await cache(`posts:${gameId}`, () => Post.find({ forumId: gameId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .limit(20)
        );
      

    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'posts' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}


export const AddMediaPost = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    })

    const result = await streamUpload(req.file.buffer)

    const post = new Post({
      forumId: req.params.id,
      userId: req.user.id,
      type: "media",
      title: req.body.title,
      mediaUrl: result.secure_url,
    })
    await clearCache(`posts:${req.params.id}`);
    await post.save()
    res.status(201).json(post)

  } catch (err) {
    console.log("ERROR:", err)
    res.status(500).json({ message: "Server error" })
  }
}

export const DeletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await Post.findByIdAndDelete(postId);
        await clearCache(`posts:${post.forumId}`);

        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const DeleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        console.log("reviewId:", reviewId);
        const result = await ReviewsSchema.findOneAndUpdate(
            { "games._id": reviewId },
            { $pull: { games: { _id: reviewId } } },
            { returnDocument: 'after' },
            {new:"new"}
        );
        if (!result) {
            return res.status(404).json({ message: "Review not found" });
        }
        await clearCache(`review:all:${req.user.id}`);
        
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}