import React, { useState, useEffect, useRef } from 'react';
import { IoMdSend } from 'react-icons/io';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';

const MessageBar = () => {
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [emojiOpened, setEmojiOpened] = useState(false);
    const emojiPickerRef = useRef(null);

    // Handle sending the message
    const handleSend = () => {
        if (message.trim() || attachment) {
            console.log('Message sent:', message);
            if (attachment) {
                console.log('Attachment sent:', attachment.name);
            }
            setMessage('');
            setAttachment(null);
        }
    };

    // Handle file attachment
    const handleAttachment = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachment(file);
            console.log('File selected:', file.name);
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
            <label className="text-gray-400 hover:text-gray-200 mx-2 cursor-pointer">
                <AiOutlinePaperClip size={24} />
                <input
                    type="file"
                    className="hidden"
                    onChange={handleAttachment}
                />
            </label>

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