import Messages from "../models/MessageModel.js";
import {mkdirSync, renameSync} from "fs";

export const getMessages = async (req, res) => {
    const user1 = req.body.id;
    const user2 = req.userId;

    if (!user1 || !user2) {
        return res.status(400).json({message: "Missing user id"});
    }

    try {
        const messages = await Messages.find(
            {
                $or: [
                    {sender: user1, receiver: user2},
                    {sender: user2, receiver: user1}
                ]
            }
        ).sort({time: 1});

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log("No file uploaded");
            res.status(400).json({message: "No file uploaded"});
        }

        const date = Date.now();
        const dir = `uploads/files/${date}`;
        mkdirSync(dir, {recursive: true});
        const fileName = `${dir}/${req.file.originalname}`;
        renameSync(req.file.path, fileName);
        res.status(200).json({file: `${fileName}`});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}

export const editMessage = async (req, res) =>{
    try {
        const messagesID = req.body.messageID;
        const messageText = req.body.text
        console.log(messageText);
        console.log(messagesID);

        const updatedMessage = await Messages.findByIdAndUpdate(
            messagesID,
            { text: messageText, edited: true },
            {new: true, runValidators: true}
        );

        res.status(200).json(updatedMessage);

    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}

export const deleteMessages = async (req, res) =>{
    try {
        const messagesIDs = req.body.messages.map(message => message._id);

        await Messages.updateMany(
            { _id: { $in: messagesIDs } },
            { $set: { deleted: true } }
        );

        const updatedMessages = await Messages.find(
            { _id: { $in: messagesIDs } }
        ).sort({ time: 1 });

        res.status(200).json(updatedMessages);

    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}