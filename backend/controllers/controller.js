import userSchema from "../models/User.js"
import bcrypt from "bcrypt"

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

        res.json({ message: "Login successful" ,user})

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }



}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 20);
        const newUser = new userSchema({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()
        res.json({ message: "Signup successful" })
        res.status(201).json(savedUser)
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}