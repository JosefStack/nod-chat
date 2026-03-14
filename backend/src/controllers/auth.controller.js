import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            // 400 -> bad request
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password should contain atleast 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }

        const user = await User.findOne({email});
        if (user) return res.status(400).json({ message: "Email already exists" });
    
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            // generateToken(newUser._id, res);
            // await newUser.save();

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: savedUser._id,
                fullName: savedUser.fullName,   
                email: savedUser.email,
                profilePic: savedUser.profilePic
            })

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (err) {
                console.error(err);
            }



        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }

    } catch (err) {
        console.log(`Error in signup controller: ${err}`);
        return res.status(500).json({ message: "Internal server error" })

    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid Credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName, 
            profilePic: user.profilePic,
        });

    } catch (error) {   
        console.log(`Error in login controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
};

// convention to use _ for req if its not going to be used.
export const logout = async (_, res) => {
    res.cookie("jwt", "", {maxAge:0});
    return res.status(200).json({message: "Logged out successfully"});
}       

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile picture is required" });

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic:uploadResponse.secure_url },
            { new:true }
        ).select("-password");

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error in update profile: \n", err);
        return res.status(500).json({ message: "Internal server error" });  
    }
};  