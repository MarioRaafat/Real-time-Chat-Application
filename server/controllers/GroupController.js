import Messages from '../models/MessageModel.js'
import Groups from '../models/GroupModel.js'
import mongoose from 'mongoose';


export const createGroup = async (req, res) => {
    try {
        const { name, members, admin } = req.body;
        if (!name || !members || !admin) {
            console.log(req.body);
            return res.status(400).json({ message: 'Name, members, and admin are required' });
        }
        const group = await Groups.create({ name, members, admin });
        res.status(201).json(group);
    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getGroups = async (req, res) => {
    let { userId } = req;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    userId = new mongoose.Types.ObjectId(userId);

    try {
        const groups = await Groups.find({
            $or: [
                { members: { $in: [userId] } },
                { admin: userId }
            ]
        })
        .sort({ updatedAt: -1 }); 

        if (groups.length > 0) {
            res.status(200).json(groups);
        } else {
            res.status(404).json({ message: 'No groups found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};



export const getGroupMessages = async (req, res) => {
    try {
        const { id } = req.body;
        const group = await Groups.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const messages = await Messages.find({ receiver: id})
            .sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}