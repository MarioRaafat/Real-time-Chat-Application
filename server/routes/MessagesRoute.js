import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleware.js";
import {getMessages} from "../controllers/MessagesController.js";
import {uploadFile, deleteMessages, editMessage} from "../controllers/MessagesController.js";
import multer from "multer";

const MessagesRouter = Router();
const upload = multer({dest: "uploads/files"});

MessagesRouter.post("/get-messages", verifyToken, getMessages);
MessagesRouter.post("/edit-message", verifyToken, editMessage);
MessagesRouter.post("/delete-messages", verifyToken, deleteMessages);
MessagesRouter.post("/upload-file", verifyToken, upload.single("file"), uploadFile);
export default MessagesRouter;