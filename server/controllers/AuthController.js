 import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {compare} from "bcrypt"

const createToken = async (email, id) => {
    return jwt.sign({ email, id }, process.env.JWT_KEY, {
        expiresIn: "3d",
    });
}

export const Signup = async (req, res) => {
    const { email, password, firstName, lastName} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    try {
        const user = await User.create({ email, password, firstName, lastName});
        const token = await createToken(user.email, user.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(201).json({ user: {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            profileSetup: user.profileSetup,
            }});
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const Login = async (req, res) => {
     const { email, password } = req.body;
     if (!email || !password) {
         return res.status(400).json({ message: "Email and Password are required" });
     }

     try {

         const user = User.findOne({email});
         if (!user) {
             return res.status(404).json({message: "user not found"})
         }
         if (!compare(user.password, password)) {
             return res.status(400).json({message: "Password is incorrect"});
         }

         const token = await createToken(email, user.id);
         res.cookie("jwt", token, {
             httpOnly: true,
             secure: true,
             sameSite: "none",
         });
         res.status(200).json({
             user: {
                 id: user.id,
                 email: user.email,
                 password: user.password,
                 firstName: user.firstName,
                 lastName: user.lastName,
                 image: user.image,
                 profileSetup: user.profileSetup,
             }
         });
     } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
     }
}