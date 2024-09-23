 import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {compare} from "bcrypt"
import {renameSync, unlinkSync} from "fs";

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
                 color: user.color,
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
                 color: user.color,
                 profileSetup: user.profileSetup,
             },
         });
     } catch (error) {
         res.status(500).json({ message: "Something went wrong" });
     }
 };

 export const getUserInfo = async (req, res) => {
     const userId = req.userId; // Assuming you use session or JWT to authenticate

     try {
         const user = await User.findById(userId);
             if (!user) {
                 return res.status(404).json({ message: 'User not found' });
             }

             res.status(200).json({
                 user: {
                     id: user.id,
                     email: user.email,
                     firstName: user.firstName,
                     lastName: user.lastName,
                     image: user.image,
                     color: user.color,
                     profileSetup: user.profileSetup,
                 },
             });
     } catch (error) {
             res.status(500).json({ message: "Something went wrong" });
     }
 };

 export const updateUser = async (req, res) => {
     const {email, firstName, lastName, image, color} = req.body;
     const id = req.userId;

     try {
         console.log(req.body);
         console.log("hi 1")
        const user = await User.findByIdAndUpdate
        (id,
            {email, firstName, lastName, image, color, profileSetup: true},
            {new: true, runValidators: true}
        );

         console.log("hi 2")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
         res.status(200).json({ user: {
             id: user.id,
             email: user.email,
             firstName: user.firstName,
             lastName: user.lastName,
             image: user.image,
             color: user.color,
             profileSetup: user.profileSetup,
         }});

     } catch (error) {
         console.log("hi -1")
         res.status(500).json({ message: "Something went wrong" });
     }
 };

 export const addProfileImg = async (req, res) => {
     try {
         if (!req.file) {
             return res.status(400).json({ message: "Image is required" });
         }

         const date = new Date();
         const fileName = `uploads/profiles/${date.getTime()}-${req.file.originalname}`;
         renameSync(req.file.path, fileName);

         const id = req.userId;
         const user = await User.findByIdAndUpdate(id, {image: fileName}, {new: true, runValidators: true});
         if (!user) {
             return res.status(404).json({ message: "User not found" });
         }

         res.status(200).json({
                 image: user.image,
             });
     } catch (error) {
         res.status(500).json({ message: "Something went wrong" });
     }
 };

    export const deleteProfileImg = async (req, res) => {
        const id = req.userId;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.image) {
                unlinkSync(user.image);
            } else {
                return res.status(404).json({ message: "Image not found" });
            }

            await User.findByIdAndUpdate(id, { image: null }, { new: true });

            res.status(200).json({ message: "Image deleted successfully" });

        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    };

 export const Logout = async (req, res) => {};
