import {Router} from "express";
import {Signup} from "../controllers/AuthController.js";
import {Login} from "../controllers/AuthController.js"

const authRouter = Router();

authRouter.post("/signup", Signup)
authRouter.post("/login", Login)

export default authRouter;