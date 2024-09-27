import {Server as SocketServer} from "socket.io";
import Messages from "./models/MessageModel.js";

const userSocketMap = new Map();
let io;



const sendMessage = async  (message) => {
    const { sender, receiver, text, messageType } = message;
    const receiverSocketId = userSocketMap.get(receiver);
    const senderSocketId = userSocketMap.get(sender);

    console.log("hi");

    try {
        const newMessage = await Messages.create(message)
            .catch(err => console.error("Error saving message: ", err));

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive-message", newMessage);
            console.log(`Message sent from ${sender} to ${receiver}`);
        } else {
            console.log(`Receiver ${receiver} is not connected`);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("receive-message", newMessage);
        } else {
            console.log(`Sender ${sender} is not connected`);
        }


        const messageData = await Messages.findById(newMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("receiver", "id email firstName lastName image color");
    } catch (error) {
        console.log(error);
    }
};


const sendGroupMessage = async  (message) => {
    const { sender, receiver, text, messageType, fileUrl, members} = message;
    const senderSocketId = userSocketMap.get(sender);

    console.log("Members: ", members);

    const formattedMessage = {
        sender: sender,
        receiver: receiver,
        text: text,
        fileUrl: fileUrl,
        messageType: messageType,
    };

    try {
        const newMessage = await Messages.create(formattedMessage)
            .catch(err => console.error("Error saving message: ", err));

        if (senderSocketId) {
            io.to(senderSocketId).emit("receive-message", newMessage);
            console.log(`Message sent from ${sender} to ${receiver}`);
        } else {
            console.log(`Receiver ${receiver} is not connected`);
        }

        if (receiver) {
            for (const member of members) {
                const memberSocketId = userSocketMap.get(member);
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receive-message", newMessage);
                } else {
                    console.log(`Receiver ${member} is not connected`);
                }
            }
        } else {
            console.log(`Error sending message to group ${receiver}`);
        }


        const messageData = await Messages.findById(newMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("receiver", "id email firstName lastName image color");
    } catch (error) {
        console.log(error);
    }
};

const disconnect = (socket) => {
    console.log("Socket disconnected: ", socket.id);

    for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
            console.log("User disconnected: ", key);
            userSocketMap.delete(key);
            break;
        }
    }
}


const setupSocket = (server, origin) => {
    
    io = new SocketServer(server, {
        cors: {
            origin: origin,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    

    io.on("connection", (socket) => {
        console.log("New connection: ", socket.id);
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log("User connected: ", userId);
            console.log("Current userSocketMap:", Array.from(userSocketMap.entries()));  // Log the map
        } else {
            console.log("User not connected");
        }

        socket.on("send-message", sendMessage);
        socket.on("send-group-message", sendGroupMessage);
        socket.on("disconnect", () => disconnect(socket));
    });

}

export const getSocketIoInstance = () => io;

export default setupSocket;