import { useAppstore } from "@/store/index.js";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_MESSAGES_ROUTE, GET_GROUP_MESSAGES_ROUTE, DELETE_MESSAGES_ROUTE, EDIT_MESSAGE_ROUTE} from "@/utils/constants.js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaFilePdf, FaFileArchive, FaFileAlt, FaArrowDown, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import {toast} from "sonner";


const MessageContainer = () => {
    const { userInfo, chatMessages, chatType, chatData, setChatMessages } = useAppstore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [showImg, setShowImg] = useState(false);
    const scrollRef = useRef();
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [msgEdited, setMsgEdited] = useState('');
    const inputRef = useRef(null);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setIsInputVisible(false);
        }
    };

    useEffect(() => {
        if (isInputVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isInputVisible, setIsInputVisible, setMsgEdited]);


    const textEditInput = () => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                if (msgEdited.length > 0) {
                    handleEditMessages(msgEdited);
                } else {
                    toast.error("Message can not be empty") 
                }
            }
        };

        return (
        <div>
            {isInputVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 backdrop-blur-lg z-50 flex items-center justify-center">
            <div
                ref={inputRef}
                className=""
            >
                <input
                    type="text"
                    className="w-[24rem] py-4 px-6 rounded-full text-gray-700 shadow-lg focus:ring-4 focus:ring-pink-400 border-none outline-none transition-all duration-500 bg-white focus:shadow-2xl text-lg placeholder-gray-400"
                    placeholder="Type text here..."
                    autoFocus
                    onChange={(e) => setMsgEdited(e.target.value)}
                    value={msgEdited}
                    onKeyDown={handleKeyDown}
                />
            </div>
            </div>
            )}
            </div>
        );
    };


    const formatDate = (date) => {
        const today = new Date();
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isImageFile = (fileUrl) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico'];
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        return imageExtensions.includes(fileExtension);
    };

    const getFileTypeIcon = (fileUrl) => {
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        if (fileExtension === 'pdf') return <FaFilePdf size={30} className="text-red-500" />;
        if (fileExtension === 'zip' || fileExtension === 'rar') return <FaFileArchive size={30} className="text-yellow-500" />;
        return <FaFileAlt size={30} className="text-gray-500" />;
    };

    const downloadFile = async (fileUrl) => {
        try {
            const response = await apiClient.get(fileUrl, { withCredentials: true, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileUrl.split('/').pop());
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

const handleSelectMessage = (message) => {
    setSelectedMessages((prevSelectedMessages) => {
        const isSelected = prevSelectedMessages.find((m) => m._id === message._id);

        if (isSelected) {
            return prevSelectedMessages.filter((m) => m._id !== message._id);
        } else {
            return [...prevSelectedMessages, message];
        }
    });
};

const handleDeleteMessages = async () => {
    try {
        const response = await apiClient.post(DELETE_MESSAGES_ROUTE, { messages: selectedMessages }, { withCredentials: true });
        if (response.status === 200) {
            setSelectedMessages([]);
        }
    } catch (error) {
        console.error("Error deleting messages:", error);
    }
}

const handleEditMessages = async (newMessageText) => {
    if (selectedMessages.length !== 1) {
        toast.error("You can only edit one message at a time");
        return;
    }

    try {
        const response = await apiClient.post(EDIT_MESSAGE_ROUTE, {
            messageID: selectedMessages[0]._id,
            text: newMessageText
        }, { withCredentials: true });

        if (response.status === 200) {
            setSelectedMessages([]);
        }
    } catch (error) {
        console.error("Error updating messages:", error);
    }
};

const handleEditClick = (message) => {
    if (selectedMessages.length === 1 && message._id === selectedMessages[0]._id) {
        setIsInputVisible(true);
        setMsgEdited(message.text);
    } else {
        toast.error("Select one message to edit");
    }
};


    const renderMessages = () => {
        let lastDate = null;
    
        return chatMessages.map((message, index) => {
            const messageDate = new Date(message.time);
            const showDate = messageDate.toDateString() !== lastDate;
            lastDate = messageDate.toDateString();
    
            const isSender = message.sender === userInfo.id;
            const isSelected = selectedMessages.find((m) => m._id === message._id);
            const isDeleted = message.deleted
            const isEdited = message.edited
            
            const multipleSelected = selectedMessages.length > 1;
    
            const nextMessage = chatMessages[index + 1];
            const nextMessageDate = nextMessage && nextMessage.time ? new Date(nextMessage.time) : null;
            const showTime = !nextMessageDate || (nextMessageDate.getMinutes() !== messageDate.getMinutes() || nextMessageDate.getHours() !== messageDate.getHours());
    
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-gray-400 my-2">
                            <span className="px-4 py-1 rounded-lg text-sm bg-gray-200">
                                {formatDate(messageDate)}
                            </span>
                        </div>
                    )}
                    <div
                        className={`flex ${isSender ? "justify-end" : "justify-start"} mb-1 relative ${isSelected ? "bg-purple-200 rounded-xl shadow-md" : ""}`}
                        onClick={() => handleSelectMessage(message)}
                    >
                        <div className={`p-2 max-w-xs md:max-w-md lg:max-w-lg text-sm ${isSender ? "bg-blue-400" : "bg-gray-300"} rounded-xl shadow-md ${isSelected ? "border border-blue-500" : ""}`}>
                            { isDeleted ?
                                <p className="text-red-500">This message was deleted</p> 
                                :
                                message.messageType === "text" ? (
                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                ) : (
                                    isImageFile(message.fileUrl) ? (
                                        <div className="h-[150px] w-[150px] md:h-[200px] md:hw-[200px] lg:h-[250px] lg:w-[250px] rounded-lg overflow-hidden">
                                            <img src={message.fileUrl} alt="message content" className="object-cover h-full w-full cursor-pointer" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {getFileTypeIcon(message.fileUrl)}
                                                <div className="relative group">
                                                    <p className="text-sm font-medium text-gray-800 truncate w-[150px]">
                                                        {message.fileUrl.split('/').pop()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            {showTime && (
                                <span className="block text-right text-xs text-gray-600 mt-1">
                                    {formatTime(messageDate)} {isEdited ? ' (edited)' : ''}
                                </span>
                            )}
                        </div>
    
                        {/* Icons for edit/delete */}
                        {isSelected && (
                            <div
                                className={`absolute top-1/2 transform -translate-y-1/2 flex space-x-2 ${
                                isSender ? "left-4" : "right-4"
                                }`}
                            >
                                {!multipleSelected && message.messageType === "text" && (
                                <button
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={() => handleEditClick(message)}
                                >
                                    <FiEdit2 size={18} />
                                </button>
                                )}
                                <button className="text-red-600 hover:text-red-800" onClick={handleDeleteMessages}>
                                <FaTrash size={18} />
                                </button>
                            </div>
                            )}
                    </div>
                </div>
            );
        });
    };    

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const ROUTE = chatType === "contact" ? GET_MESSAGES_ROUTE : GET_GROUP_MESSAGES_ROUTE;
                const response = await apiClient.post(ROUTE, { id: chatData._id }, { withCredentials: true });
                setChatMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
            getMessages();
    }, [chatMessages, chatType, chatData, setChatMessages]);

    return (
        <>
        {
            (selectedMessages.length === 1) ? 
                textEditInput() : ""
        }
            <div className="h-full bg-gradient-to-b from-gray-200 to-gray-700 transition-all duration-700 ease-in-out">
                <div className="flex flex-col h-full">
                    <ScrollArea className="overflow-hidden w-full h-[80vh] p-5">
                        <div className="space-y-4">
                            {renderMessages()}
                        </div>
                        <div ref={scrollRef} />
                    </ScrollArea>
                </div>
            </div>
            {showImg && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 backdrop-blur-lg z-50 flex items-center justify-center">
                    <img src={selectedImg} alt="selected image" className="max-h-[80vh] max-w-[60vw] cursor-pointer rounded-lg shadow-lg" onClick={() => setShowImg(false)} />

                    <button
                        className="absolute top-[30%] right-[10%] w-10 h-10 md:w-16 md:h-16 rounded-full bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center shadow-lg"
                        onClick={() => setShowImg(false)}
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button onClick={() => downloadFile(selectedImg)} className="absolute bottom-[30%] right-[10%]">
                        <div className="flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full border border-blue-400 bg-transparent hover:bg-[#1d4ed8] transition-all duration-300 ease-in-out">
                            <FaArrowDown className="text-blue-500 hover:text-white" />
                        </div>
                    </button>
                </div>
            )}
        </>
    );
};

export default MessageContainer;