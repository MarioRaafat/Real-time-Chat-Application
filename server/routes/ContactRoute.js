import {Router} from "express";
import {addContact, deleteContact, getContacts, updateContact} from "../controllers/ContactController.js";
import {verifyToken} from "../middlewares/AuthMiddleware.js";

const contactRouter = Router();

contactRouter.post("/get-contacts", verifyToken, getContacts);
contactRouter.delete("/delete-contact", verifyToken, deleteContact);
contactRouter.post("/add-contact", verifyToken, addContact);
contactRouter.post("/update-contact", verifyToken, updateContact);

export default contactRouter;