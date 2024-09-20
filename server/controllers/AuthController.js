 import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {compare} from "bcrypt"

const createToken = async (email, id) => {
    return jwt.sign({ email, id }, process.env.JWT_KEY, {
        expiresIn: "3d",
    });
}

 export const Signup = async (req, res) => {
     const { email, password, firstName, lastName } = req.body;
     if (!email || !password) {
         return res.status(400).json({ message: "Email and Password are required" });
     }

     try {
         // Check if the email already exists
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(409).json({ message: "Email is already in use" });
         }

         const user = await User.create({ email, password, firstName, lastName });
         const token = await createToken(user.email, user.id);
         res.cookie("jwt", token, {
             httpOnly: true,
             secure: true,
             sameSite: "none",
         });
         res.status(201).json({
             user: {
                 id: user.id,
                 email: user.email,
                 firstName: user.firstName,
                 lastName: user.lastName,
                 image: user.image,
                 profileSetup: user.profileSetup,
             },
         });
     } catch (error) {
         res.status(500).json({ message: "Something went wrong" });
     }
 };


 export const Login = async (req, res) => {
     const { email, password } = req.body;
     if (!email || !password) {
         return res.status(400).json({ message: "Email and Password are required" });
     }

     try {
         // Find the user by email
         const user = await User.findOne({ email });
         if (!user) {
             return res.status(404).json({ message: "User not found" });
         }

         // Check if the password is correct
         const isPasswordValid = await compare(password, user.password);
         if (!isPasswordValid) {
             return res.status(401).json({ message: "Invalid password" });
         }

         // Create a token
         const token = await createToken(user.email, user.id);
         res.cookie("jwt", token, {
             httpOnly: true,
             secure: true,
             sameSite: "none",
         });

         res.status(200).json({
             user: {
                 id: user.id,
                 email: user.email,
                 firstName: user.firstName,
                 lastName: user.lastName,
                 image: user.image,
                 profileSetup: user.profileSetup,
             },
         });
     } catch (error) {
         res.status(500).json({ message: "Something went wrong" });
     }
 };

