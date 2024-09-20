import {Router} from "express";
import {Signup, Login} from "../controllers/AuthController.js";

const authRouter = Router();

authRouter.post("/signup", Signup)
authRouter.post("/login", Login)

export default authRouter;