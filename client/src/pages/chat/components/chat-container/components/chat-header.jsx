import {RiCloseFill} from "react-icons/ri";
import {useAppstore} from "@/store/index.js";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {getColor} from "@/lib/utils.js";

const ChatHeader = () => {
    const {closeChat, chatData, userInfo} = useAppstore();
    const {color} = userInfo;
    const {image, lastName, firstName} = chatData;
    console.log(chatData);

    return <div className="relative h-[12%] border-b-[1px] w-full border-amber-50 flex items-center justify-center bg-gray-800">
            <div className="flex gap-3 items-center w-[50%] absolute left-8">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full overflow-hidden">
                    {image ? (
                        <AvatarImage
                            src={image}
                            alt="profile image"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div
                            className={`font-bold text-l uppercase h-8 w-8 lg:h-12 lg:w-12  md:h-10 md:w-10 rounded-full flex items-center justify-center ${getColor(color)}`}>
                            {firstName[0]}
                        </div>
                    )}
                </Avatar>

                <div className="flex flex-col max-w-[30%] md:max-w-[50%] lg:max-w-[60%]">
                    <p className="text-white text-sm hidden md:block truncate">
                        {firstName} {lastName}
                    </p>
                </div>
            </div>
            <div className="flex items-center absolute right-8">
                <button className="text-gray-300 focus:border-none focus:outline-none
                 transition-all focus:text-white" onClick={closeChat}>
                    <RiCloseFill className="text-3xl " />
                </button>
            </div>
    </div>
}

export default ChatHeader;