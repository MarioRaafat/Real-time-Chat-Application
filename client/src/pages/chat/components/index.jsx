import {useNavigate} from "react-router-dom";
import {useAppstore} from "@/store/index.js";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import ChatContainer from "@/pages/chat/components/chat-container/index.jsx";
import ContactsContainer  from "@/pages/chat/components/contacts-container/index.jsx";
import EmptyChatContainer from "@/pages/chat/components/empty-chat-container/index.jsx";


const Chat = () => {
    const {userInfo, chatType} = useAppstore();
    const {email, firstName, lastName, profileSetup} = userInfo;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        if (!profileSetup){
            toast.error("Please set up your profile first to continue");
            navigate("/profile");
        }
    }, [])

    return (
        <div className="flex h-screen w-screen" >
            <ContactsContainer isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            {chatType === undefined ? 
                <EmptyChatContainer isSidebarOpen={isSidebarOpen}/>
                :
                <ChatContainer />}
        </div>
    );
}

export default Chat;