import userSchema from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import {AuthMiddleware} from "../middleware/authMiddleware.js"


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
            { expiresIn: "7d" })
        
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

