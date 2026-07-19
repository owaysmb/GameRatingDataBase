
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
import Forum from "../models/Forum.js";
import PostComments from "../models/PostComments.js";

// Cloudniary imports   
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { format } from "@cloudinary/url-gen/actions/delivery";

const upload = multer({ storage: multer.memoryStorage() })


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})
console.log("Cloudinary config:", cloudinary.config())

let LoginAttempts = 5;
let LockDuration = 15 * 60 * 1000;

export const login = async (req,res)=>{
    try {
        const { email, password } = req.body

        const user = await userSchema.findOne({ email })

        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const now = Date.now();

        if (user.lockUntil && user.lockUntil > now) {
            return res.status(423).json({
                message: "Account locked",
                lockUntil: user.lockUntil
            });
        }

        if (user.lockUntil && user.lockUntil <= now) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null;
            await user.save();
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            if (user.failedLoginAttempts >= LoginAttempts) {
                user.lockUntil = new Date(now + LockDuration);
                await user.save();
                return res.status(423).json({
                    message: "Too many attempts, try again later",
                    lockUntil: user.lockUntil
                });
            }

            await user.save();
            return res.status(400).json({
                message: "Wrong password",
                attemptsLeft: LoginAttempts - user.failedLoginAttempts
            });
        }

        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign( 
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" })
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        const { password: _, ...userWithoutPassword } = user.toObject()
        res.json({ message: "Login successful", user: userWithoutPassword })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }



}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);

        if(username.length < 3 
            || email.includes(" ") 
            || !email.includes("@gmail.com") 
            || password.length < 6
            || password.includes(" ")
        ){
            return res.status(400).json({ message: "Invalid input" })
        }

        const newUser = new userSchema({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()
        const { password: _, ...userWithoutPassword } = savedUser.toObject()
        res.status(201).json({
            message: "Signup successful",
            user: userWithoutPassword
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}


export const ProfileByUser = async (req, res) => {
    try {
        const username = req.params.username;

        const findUser = await userSchema.findOne({ username }).select('-password');

        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(findUser);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = req.user.id;
        const { username, bio } = req.body;
        const updates = {};

        if (typeof username === "string") {
            const trimmedUsername = username.trim();
            if (trimmedUsername.length < 3) {
                return res.status(400).json({ message: "Username must be at least 3 characters" });
            }
            updates.username = trimmedUsername;
        }

        if (typeof bio === "string") {
            updates.bio = bio.trim().slice(0, 160);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid profile data provided" });
        }

        const updatedUser = await userSchema.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

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
        const userId = req.query.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const objectId = new mongoose.Types.ObjectId(userId);
        const list = await cache(`list:all:${objectId}`, () => ListsSchema.findOne({ userId: objectId }));

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
        const userId = req.query.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

    let fav = await cache(`favorite:${userId}`, () => FavoriteSchema.findOne({userId}));    
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
        
        const userId = req.query.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        let UserProgress = await  cache(`progress:${userId}`, () => ProgressSchema.findOne({userId}));
        
        res.json({UserProgress}); 


    } catch (err) {
        console.log(err);
    }
}

export const AddReview = async (req,res)=>{
    try {
        const gameId = req.params.id;
        const { review } = req.body;

        if (!review || !review.trim()) {
            return res.status(400).json({ message: "Review text is required" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        let UserReview = await ReviewsSchema.findOne({ userId });

        if (!UserReview) {
            UserReview = new ReviewsSchema({ userId });
        }

        UserReview.games.push({ gameId, review: { text: review.trim() } });
        await UserReview.save();
        await clearCache(`review:all:${req.user.id}`);
        return res.status(201).json({ message: "Review added successfully" });

     } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}


export const GetReview = async (req,res)=>{
    try {
        const userId = req.query.userId || req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const objectId = new mongoose.Types.ObjectId(userId);
        const UserReview = await cache(`review:all:${userId}`, () => ReviewsSchema.findOne({ userId: objectId }));

        if (!UserReview) {
            return res.json({ reviews: [] });
        }
        
        const reviews = UserReview.games.map(game => ({
            gameId: game.gameId,
            review: game.review?.text || "",
            reviewId: game._id
        }));

        return res.json({ reviews });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
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
            likes: [],
            disLikes: []
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
            likes: [],
            disLikes: []
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

export const joinForum = async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const gameId = req.params.id;
        const forumJoined = req.body?.forumJoined;

        if(!userId || !gameId){
            return res.status(400).json({ message: "User or Game ID not provided" });
        }

        let forum;

        if (forumJoined) {
            forum = await Forum.findOneAndUpdate(
                { userId },
                { $addToSet: { Forums: gameId } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        } else {
            forum = await Forum.findOneAndUpdate(
                { userId },
                { $pull: { Forums: gameId } },
                { new: true }
            );
        }

        await clearCache(`forum:${userId}`);
        res.json({ message: forumJoined ? "Joined forum successfully" : "Removed forum membership", forum });        

    }catch (err) {
        res.json({ message: "Error joining forum" });
        console.log(err)
    }
}


export const getForum = async(req,res)=>{
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.json({ forum: null });
        }

        let forum = await cache(`forum:${userId}`, () => Forum.findOne({ userId }));

        if (!forum) {
            return res.json({ forum: null });
        }

        res.json({ forum });
        
    }catch (err) {
        res.json({ message: "Error getting forum" });
        console.log(err)
    }


}


export const handleLike = async (req, res) => {
    try {
        const userId = req.user?.id?.toString();
        const { postId, like } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        if (typeof like !== "boolean") {
            return res.status(400).json({ message: "Like value is required" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const hasLiked = (post.likes || []).includes(userId);
        const hasDisliked = (post.disLikes || []).includes(userId);

        let update = {};

        if (like) {
            if (hasLiked) {
                update = { $pull: { likes: userId } };
            } else {
                update = {
                    $addToSet: { likes: userId },
                    $pull: { disLikes: userId }
                };
            }
        } else {
            if (hasDisliked) {
                update = { $pull: { disLikes: userId } };
            } else {
                update = {
                    $addToSet: { disLikes: userId },
                    $pull: { likes: userId }
                };
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });

        await clearCache(`posts:${updatedPost.forumId}`);
        return res.json({ message: "Post updated successfully", post: updatedPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}


export const handleImageUpload = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const mimeType = req.file.mimetype || "image/png";
        const base64Image = req.file.buffer.toString("base64");
        const profilePicture = `data:${mimeType};base64,${base64Image}`;

        const updatedUser = await userSchema.findByIdAndUpdate(
            userId,
            { profilePicture },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "Profile picture updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Image upload error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const handleComment = async(req,res)=>{
    try {
        const userId = req.user?.id;
        const postId = req.body.postID;
        const text = req.body.comment;
        const forumId = req.body.forumId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        
        const comment = new PostComments({
            userId,
            postId,
            text,
            forumId
        })

        await comment.save();
        res.json({message:"sent succesfully"})

    } catch (err) {
        console.log(err);
    }


}


export const GetComment = async (req,res) =>{

    try {
        
        const postId = req.params.postId;

        const comments = await PostComments.find({postId})
            .populate('userId', 'username')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(comments)

    } catch (err) {
        console.log(err);
        res.status(500);
    }   
    
    
    

}


export const DeleteComment = async (req,res)=>{

    try {
        const userId = req.user.id;
        const commentId = req.params.commentID;

        const comment = await PostComments.find()

        if (!comment) {
                return res.status(404).json({ message: "Post not found" });
            }

        await PostComments.findByIdAndDelete(commentId);
        res.json({ message: "Comment deleted successfully" });        
    } catch (err) {
        console.log(err);
    }
    
}

export const handleCommentLike = async (req, res) => {
    try {
        const userId = req.user?.id?.toString();
        const { commentId, like } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        if (typeof like !== "boolean") {
            return res.status(400).json({ message: "Like value is required" });
        }

        const comment = await PostComments.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const hasLiked = (comment.likes || []).includes(userId);
        const hasDisliked = (comment.disLikes || []).includes(userId);

        let update = {};

        if (like) {
            if (hasLiked) {
                update = { $pull: { likes: userId } };
            } else {
                update = {
                    $addToSet: { likes: userId },
                    $pull: { disLikes: userId }
                };
            }
        } else {
            if (hasDisliked) {
                update = { $pull: { disLikes: userId } };
            } else {
                update = {
                    $addToSet: { disLikes: userId },
                    $pull: { likes: userId }
                };
            }
        }

        const updatedComment = await PostComments.findByIdAndUpdate(commentId, update, { new: true });

        return res.json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.json({ message: "Logged out successfully" });
}

export const getMe = async (req, res) => {
    try {
        const user = await userSchema.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const getForumsByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await userSchema.findOne({ username }).select('_id');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const forum = await Forum.findOne({ userId: user._id });
        if (!forum) {
            return res.json({ forums: [] });
        }
        res.json({ forums: forum.Forums });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}