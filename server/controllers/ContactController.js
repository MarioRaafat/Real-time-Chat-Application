import User from "../models/UserModel.js";


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


export const updateContact = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong' });
    }
};