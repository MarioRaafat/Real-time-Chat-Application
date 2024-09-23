import {Router} from "express";
import {Signup, Login, getUserInfo,
    updateUser, addProfileImg,
    deleteProfileImg, Logout} from "../controllers/AuthController.js";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRouter = Router();
const upload = multer({dest: "uploads/profiles"});

authRouter.post("/signup", Signup);
authRouter.post("/login", Login);
authRouter.get("/user-info", verifyToken, getUserInfo)
authRouter.post("/update-user-info", verifyToken, updateUser);
authRouter.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImg);
authRouter.delete("/delete-profile-image", verifyToken, deleteProfileImg);
authRouter.post("/logout", Logout);

export default authRouter;