import ChatHeader from "@/pages/chat/components/chat-container/components/chat-header.jsx";
import MessageContainer from "@/pages/chat/components/chat-container/components/message-container.jsx";
import MessageBar from "@/pages/chat/components/chat-container/components/message-bar.jsx";

const ChatContainer = () => {
    return (
        <div className=" flex flex-col w-full bg-[#131313] h-screen">
            <ChatHeader />
            <MessageContainer />
            <MessageBar />
        </div>
    );
};

export default ChatContainer;