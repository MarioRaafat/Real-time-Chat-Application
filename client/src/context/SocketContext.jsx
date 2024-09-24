import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAppstore } from "@/store/index.js";
import { HOST } from "@/utils/constants.js";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socket = useRef(null); // Initialize with null
    const [messages, setMessages] = useState([]);
    const { userInfo } = useAppstore();


    const receiveMessage = (message) => {
        const { chatType, chatData, addMessage, chatMessages} = useAppstore.getState();

        if (chatType && chatData &&
            (chatData._id === message.sender ||
                chatData._id === message.receiver)) {

            console.log(message)
            addMessage(message);
        }
    }


    useEffect(() => {
        if (userInfo) {
            console.log(userInfo);
            socket.current = io(HOST, {
                query: {
                    userId: userInfo.id,
                },
                withCredentials: true,
            });

            socket.current.on("connect", () => {
                console.log("Connected to the socket server");

                socket.current.on("receive-message", receiveMessage);

                socket.current.on("disconnect", () => {
                    console.log("Disconnected from the socket server");
                });
            });
        }
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
