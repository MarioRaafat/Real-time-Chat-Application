import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    text: {
        type: String,
        required: function () {
            return this.messageType === "text";
        },
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        },
    },
    edited:{
        type: Boolean,
        default: false,
        required: false,
    },
    deleted: {
        type: Boolean,
        default: false,
        required: false,
    },
    time: {
        type: String,
        default: () => new Date().toISOString(),
    }
});

const Messages = mongoose.model("Messages", messageSchema);
export default Messages;