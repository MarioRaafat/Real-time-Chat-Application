import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {getMessages} from "../controllers/MessagesController.js";
import {uploadFile} from "../controllers/MessagesController.js";
import multer from "multer";

const MessagesRouter = Router();
const upload = multer({dest: "uploads/files"});

MessagesRouter.post("/get-messages", verifyToken, getMessages);
MessagesRouter.post("/upload-file", verifyToken, upload.single("file"), uploadFile);
export default MessagesRouter;