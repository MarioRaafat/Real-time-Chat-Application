import {RiCloseFill} from "react-icons/ri";

const ChatHeader = () => {
    return <div className="h-[10%] border-b-2 border-amber-50 flex items-center justify-center bg-gray-800">
        <div className="flex gap-5 items-center">
            <div className="flex gap-3 items-center justify-center"></div>
            <div className="flex gap-5 items-center justify-center">
                <button className="text-gray-300 focus:border-none focus:outline-none
                 transition-all focus:text-white">
                    <RiCloseFill className="text-3xl " />
                </button>
            </div>
        </div>
    </div>
}

export default ChatHeader;