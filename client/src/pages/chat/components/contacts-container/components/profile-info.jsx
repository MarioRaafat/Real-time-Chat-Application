import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppstore } from "@/store/index.js";
import { apiClient } from "@/lib/api-client.js";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { getColor } from "@/lib/utils.js";
import { FiEdit2 } from "react-icons/fi";
import { LogOutIcon } from "lucide-react";
import {LOGOUT_ROUTE} from "@/utils/constants.js";
import {toast} from "sonner";

const ProfileInfo = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppstore();
    const { email, firstName, lastName, image, color } = userInfo;

    const Logout = async  () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true});
            if (response.status === 200) {
                setUserInfo(null);
                toast.success("Logged out successfully");
                navigate("/author");
            } else {
                console.log("Failed to log out");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="bg-gray-700 absolute bottom-0 h-14 flex items-center justify-between w-full rounded-t-md p-4">
            <div className="flex items-center gap-4 w-full max-w-[30vw]">
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
                <div className="flex flex-col max-w-[30%] md:max-w-[50%] lg:max-w-[60%]">
                    {/* Name visible on medium screens and larger */}
                    <p className="text-white text-sm hidden md:block truncate">
                        {firstName} {lastName}
                    </p>

                    {/* Email visible only on large screens */}
                    <p className="text-white text-xs hidden lg:block truncate">
                        {email}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 w-full max-w-[30vw] justify-center min-w-0">
                {/* Edit Profile Icon */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2
                                className={`text-sm cursor-pointer ${getColor(color)} border-none bg-transparent`}
                                onClick={() => {
                                    navigate("/profile")
                                    toast.info("Edit your profile")
                                }}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit your profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Log Out Icon */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <LogOutIcon
                                className={`text-sm cursor-pointer text-red-700`}
                                onClick={Logout}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Log out</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;
