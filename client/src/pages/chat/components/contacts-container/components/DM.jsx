import {apiClient} from "@/lib/api-client.js";
import {GET_DM_CONTACTS_ROUTE} from "@/utils/constants.js";
import {useEffect} from "react";
import {useAppstore} from "@/store/index.js";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {getColor} from "@/lib/utils.js";

const DM = () => {
    const {chatData, setChatData, setChatType, setChatMessages, DMContacts, setDMContacts} = useAppstore();

    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {withCredentials: true});
                setDMContacts(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getContacts();
    }, []);

    const handleClick = (contact) => {
        setChatType("contact");
        setChatData(contact);
        if (chatData && chatData._id !== contact.id) {
            setChatMessages([]);
        }
    };

    const renderContacts = () => {
        return DMContacts.map((contact, index) => {
            const {firstName, lastName, email, image, color} = contact;

            return (
                <div key={index}
                     onClick={() => handleClick(contact)}
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
                                    className={`font-bold text-l uppercase h-10 w-10 rounded-full flex items-center justify-center ${getColor(color)}`}>
                                    {firstName[0]}
                                </div>
                            )}
                        </Avatar>

                        {/* Name and Email - responsive display */}
                        <div className="flex flex-col w-full max-w-[60%] md:max-w-[70%] lg:max-w-[80%] pr-6">
                            <p className="text-white text-sm block truncate">
                                {firstName} {lastName}
                            </p>

                            {/* Email visible only on large screens */}
                            <p className="text-white text-xs hidden lg:block truncate">
                                {email}
                            </p>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="w-full">
            {renderContacts()}
        </div>
    );
}

export default DM;
