import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import {useAppstore} from "@/store/index.js";
import { useSocket } from "@/context/SocketContext.jsx";
import {GET_UPLOAD_FILE_ROUTE, HOST} from "@/utils/constants.js";
import {apiClient} from "@/lib/api-client.js";

const MessageBar = () => {
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [emojiOpened, setEmojiOpened] = useState(false);
    const emojiPickerRef = useRef(null);
    const fileRef = useRef(null);
    const socket = useSocket();
    const { chatType, chatData, userInfo} = useAppstore();

    const handleSend = () => {
        if (message.trim() || attachment) {
            console.log('Message sent:', message.trim());
            console.log(chatData);
            if (attachment) {
                console.log('Attachment sent:', attachment);
            } else {
                if (chatType === "contact") {
                    socket.emit("send-message", {
                        sender: userInfo.id,
                        receiver: chatData._id,
                        text: message.trim(),
                        messageType: attachment ? "file" : "text",
                        fileUrl: attachment,
                    });
                }
                if (chatType === "group") {
                    
                    socket.emit("send-group-message", {
                        sender: userInfo.id,
                        receiver: chatData.id,
                        members: chatData.members,
                        text: message.trim(),
                        messageType: attachment ? "file" : "text",
                        fileUrl: attachment,
                    });
                }
            }

            setMessage('');
            setAttachment(null);
        }
    };


    const handleAttachmentClick = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    }

    // Handle file attachment
    const handleAttachmentChange = async  (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
        } else {
            console.log('File selected:', file.name);
        }
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await apiClient.post(GET_UPLOAD_FILE_ROUTE, formData, {withCredentials: true});
            setAttachment(response.data.file);
            console.log("hi 1");
            if (response.data.file && response.status === 200) {
                console.log('File uploaded:', response.data.file);

                if (chatType === "contact") {
                    console.log("hi 2")
                    socket.emit("send-message", {
                        sender: userInfo.id,
                        receiver: chatData._id,
                        text: null,
                        messageType: "file",
                        fileUrl: response.data.file,
                    });

                    setMessage('');
                    setAttachment(null);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Handle emoji selection
    const handleEmoji = (emoji) => {
        setMessage(message + emoji.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setEmojiOpened(false); // Close emoji picker if clicked outside
            }
        };

        if (emojiOpened) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [emojiOpened]);

    return (
        <div className="w-full flex items-center p-4 bg-gray-800 h-[10vh] relative">
            {/* Attachment Button */}
            <button className="text-gray-400 hover:text-gray-200 mx-2 cursor-pointer" onClick={handleAttachmentClick}>
                <AiOutlinePaperClip size={24} />
                <input
                    type="file"
                    className="hidden"
                    onChange={handleAttachmentChange}
                    ref={fileRef}
                />
            </button>

            {/* Input and Emoji Button */}
            <div className="flex w-full rounded-full bg-gray-700 relative">
                <input
                    type="text"
                    className="flex-grow p-2 text-white bg-gray-700 rounded-full outline-none ml-2"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    className="text-gray-400 hover:text-gray-200 mx-2 cursor-pointer flex items-center justify-center"
                    onClick={() => setEmojiOpened(!emojiOpened)}
                >
                    <RiEmojiStickerLine size={24} />
                </button>

                {emojiOpened && (
                    <div
                        ref={emojiPickerRef}
                        className="absolute bottom-16 right-0 z-10"
                    >
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={handleEmoji}
                        />
                    </div>
                )}
            </div>

            <button
                className="text-blue-500 hover:text-blue-400 mx-2"
                onClick={handleSend}
                disabled={!message.trim() && !attachment}
            >
                <IoMdSend size={24} />
            </button>
        </div>
    );
};

export default MessageBar;