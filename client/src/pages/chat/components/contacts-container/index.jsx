import { useState } from "react";
import ProfileInfo from "@/pages/chat/components/contacts-container/components/profile-info.jsx";
import NewContact from "@/pages/chat/components/contacts-container/components/new-contact.jsx";
import NewGroup from "@/pages/chat/components/contacts-container/components/new-group.jsx";
import DM from "@/pages/chat/components/contacts-container/components/DM.jsx";
import Groups from "@/pages/chat/components/contacts-container/components/Groups.jsx";
import { useAppstore } from "@/store/index.js";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContactsContainer = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { chatData } = useAppstore();

    const toggleSidebar = () => {
        if (chatData) setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`relative bg-[#1b1c24] border-r-[1px] border-gray-300 transition-all duration-300 ease-in-out 
            ${isSidebarOpen ? "w-[30vw]" : "w-[80px]"} md:w-[30vw] flex flex-col h-screen`}>
            {/* Menu icon for mobile */}
            <button onClick={toggleSidebar} className="block w-full pt-5 text-white z-10">
                <Logo isSidebarOpen={isSidebarOpen} />
            </button>

            <div className={`flex flex-col flex-grow md:block ${isSidebarOpen ? "block" : "hidden"}`}>
                <div className="flex-shrink-0 p-2 md:p-5">
                    <div className="flex justify-between gap-2">
                        <h6 className="text-gray-400 ml-2 hover:text-amber-50 cursor-pointer">Direct Messages</h6>
                        <div className="flex items-center justify-center pr-10">
                            <NewContact />
                        </div>
                    </div>
                </div>

                <ScrollArea className=" overflow-hidden w-full h-[27vh]">
                    <DM />
                </ScrollArea>

                <div className="flex-shrink-0 p-2 md:p-5">
                    <div className="flex justify-between gap-2">
                        <h6 className="text-gray-400 ml-2 hover:text-amber-50 cursor-pointer">Groups</h6>
                        <div className="flex items-center justify-center pr-10">
                            <NewGroup />
                        </div>
                    </div>
                </div>

                <ScrollArea className="overflow-hidden w-full h-[27vh]">
                    <Groups />
                </ScrollArea>
            </div>

            <ProfileInfo />
        </div>
    );
};

export default ContactsContainer;

export const Logo = ({ isSidebarOpen }) => {
    return (
        <div className="flex p-1 md:p-5 justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="78"
                height="32"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" className="ccustom" fill="#8338ec"></path>
                <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" className="ccompli1" fill="#975aed"></path>
                <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" className="ccompli2" fill="#a16ee8"></path>
            </svg>
            <span className={`${isSidebarOpen ? "text-xl" : "text-[14px]"} md:text-2xl w-full lg:text-3xl font-semibold text-gray-300`}>ChatMe</span>
        </div>
    );
};
