import User from "../models/UserModel.js";
import mongoose from "mongoose";
import Messages from "../models/MessageModel.js";


export const addContact = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong' });
    }
};

export const deleteContact = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong' });
    }
};

export const getContacts = async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm;
        if (!searchTerm){
            return res.status(400).json({ message: 'search term is required' });
        }

        const id = req.userId;
        if (!id) {
            return res.status(400).json({ message: 'user ID is required' });
        }
        const users = await User.find({
            _id: { $ne: id },
            $or: [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: searchTerm, options: 'i' } } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        return  res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'something went wrong' });
    }
};

export const getDMContacts = async (req, res) => {
    let { userId } = req;
    if (!userId) {
        return res.status(400).json({ message: 'user ID is required' });
    }
    userId = new mongoose.Types.ObjectId(userId);

    try {
        const contacts = await Messages.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                            $cond: {
                                if: { $eq: ['$sender', userId] },
                                then: '$receiver',
                                else: '$sender',
                            },
                        },
                    lastMessageTime: { $first: '$time' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            {
                $unwind: '$contactInfo'
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    firstName: '$contactInfo.firstName',
                    lastName: '$contactInfo.lastName',
                    email: '$contactInfo.email',
                    color: '$contactInfo.color',
                    profileImg: '$contactInfo.profileImg'
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])

        res.status(200).json(contacts);

    } catch (error) {
        res.status(500).json({message: 'something went wrong'});
    }
}


export const updateContact = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong' });
    }
};