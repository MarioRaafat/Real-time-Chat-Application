import {apiClient} from "@/lib/api-client.js";
import {GET_GROUPS_ROUTE} from "@/utils/constants.js";
import {useEffect} from "react";
import {useAppstore} from "@/store/index.js";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import { ScrollArea } from "@/components/ui/scroll-area";

const Groups = () => {
    const {chatData, setChatData, setChatType, setChatMessages, chatGroups, setChatGroups} = useAppstore();

    useEffect(() => {
        const getGroups = async () => {
            try {
                const response = await apiClient.get(GET_GROUPS_ROUTE, {withCredentials: true});
                setChatGroups(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getGroups();
    }, [chatGroups, setChatGroups, chatData]);

    const handleClick = (group) => {
        setChatType("group");
        setChatData(group);
        if (chatData && chatData._id !== group.id) {
            setChatMessages([]);
        }
    };

    const renderGroups = () => {
        return chatGroups.map((group, index) => {
            const {name, image} = group;

            return (
                <div key={index}
                    onClick={() => handleClick(group)}
                    className="flex items-center gap-2 p-2 w-full hover:bg-gray-800 cursor-pointer transition-colors duration-300 ease-in-out">
                    <div className="flex items-center gap-4 w-full pl-6">
                        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                            {image ? (
                                <AvatarImage
                                    src={image}
                                    alt="profile image"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div
                                    className={`font-bold text-l uppercase h-10 w-10 rounded-full flex items-center justify-center bg-gray-400`}>
                                    {name[0]}
                                </div>
                            )}
                        </Avatar>
                        <div className="flex flex-col w-full max-w-[60%] md:max-w-[70%] lg:max-w-[80%] pr-6">
                            <p className="text-white text-sm block truncate">
                                {name}
                            </p>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="w-full">
            {renderGroups()}
        </div>
    );
}

export default Groups;
