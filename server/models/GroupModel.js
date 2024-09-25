import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Group name is required"],
    },
    image: {
        type: String,
        required: false,
    },
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    admin: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message',
            required: false,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

GroupSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

GroupSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Group = mongoose.model('Group', GroupSchema);

export default Group;