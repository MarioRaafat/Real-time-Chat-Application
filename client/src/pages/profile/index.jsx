import { useAppstore } from "@/store/index.js";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input.jsx";
import { getColor, colors } from "@/lib/utils.js";
import { FaUserPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { HOST, UPDATE_USER_INFO, ADD_PROFILE_IMG, DELETE_PROFILE_IMG } from "@/utils/constants.js";

const Profile = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo, ChatData} = useAppstore();
    const [email, setEmail] = useState(userInfo.email);
    const [firstName, setFirstName] = useState(userInfo.firstName);
    const [lastName, setLastName] = useState(userInfo.lastName);
    const [image, setImage] = useState(userInfo.image);
    const [color, setColor] = useState(0);
    const [hovered, setHovered] = useState(false);
    const fileInput = useRef(null);

    useEffect(() => {
        if (userInfo.profileSetup) {
            setColor(userInfo.color);
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
        }
        if (userInfo.image) {
            setImage(userInfo.image.startsWith(HOST) ? userInfo.image : `${HOST}/${userInfo.image}`);
        }
    }, [userInfo, ChatData]);

    const validateProfile = () => {
        if (!email || !firstName || !lastName) {
            toast.error("All fields are required");
            return false;
        }
        return true;
    };

    const saveChanges = async () => {
        if (!validateProfile()) return;

        const data = { email, firstName, lastName, image, color };
        try {
            const response = await apiClient.post(UPDATE_USER_INFO, data, { withCredentials: true });
            if (response.status === 200) {
                setUserInfo(response.data.user);
                navigate("/chat");
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error("Error updating profile: " + error.response?.data?.message || "Something went wrong");
        }
    };

    const handleFileInput = () => {
        fileInput.current.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file);
            try {
                const response = await apiClient.post(ADD_PROFILE_IMG, formData, { withCredentials: true });
                if (response.status === 200 && response.data.image) {
                    setUserInfo({ ...userInfo, image: response.data.image });
                    toast.success("Image uploaded successfully");
                } else {
                    toast.error("Failed to upload the image");
                }
            } catch (error) {
                toast.error("Error uploading image: " + error.response?.data?.message || "Something went wrong");
            }
        } else {
            toast.error("No file selected");
        }
    };

    const handleImageDelete = async () => {
        try {
            const response = await apiClient.delete(DELETE_PROFILE_IMG, { withCredentials: true });
            if (response.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                setImage(null);
                toast.success("Image deleted successfully");
            }
        } catch (error) {
            toast.error("Error deleting image: " + error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="profile-page bg-[#1b1c24] h-[100vh] w-[100vw] flex flex-col items-center justify-center">
            <div className="profile-card w-[80vw] flex gap-6 items-center justify-center m-28">
                <div className="grid grid-cols-2">
                    <div className="flex items-center justify-center h-full relative"
                         onMouseEnter={() => setHovered(true)}
                         onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar className="h-32 w-32 rounded-full overflow-hidden m-auto">
                            {image ? (
                                <AvatarImage src={image} alt="profile image" className="object-cover w-full h-full" />
                            ) : (
                                <div className={`font-bold text-6xl uppercase h-32 w-32 rounded-full overflow-hidden m-auto flex items-center justify-center ${getColor(color)}`}>
                                    {firstName[0]}
                                </div>
                            )}
                        </Avatar>

                        {hovered && (
                            <div
                                className="m-auto h-32 w-32 rounded-full flex items-center justify-center absolute inset-0 ring-fuchsia-50 bg-black/50 cursor-pointer"
                                onClick={!image ? handleFileInput : handleImageDelete}
                            >
                                {image ? <FaTrash className="text-white" /> : <FaUserPlus className="text-white" />}
                            </div>
                        )}
                        <input className="hidden" type="file" accept=".png, .svg, .jpg, .jpeg, .webp"
                               ref={fileInput} onInput={handleImageChange} name="profile-image" id="profile-image"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                               className={`rounded-full p-6 ${getColor(color)}`} placeholder="First Name" />
                        <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                               className={`rounded-full p-6 ${getColor(color)}`} placeholder="Last Name" />
                        <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                               className={`rounded-full p-6 ${getColor(color)}`} placeholder="Email" />
                        <div className="flex gap-4 xl:gap-5 md:gap-4 sm:gap-3 items-center justify-center m-auto">
                            {colors.map((c, index) => (
                                <div key={index}
                                     className={`h-8 w-8 rounded-full cursor-pointer m-auto ${getColor(index)} ${color === index ? "ring-2 ring-amber-50" : ""}`}
                                     onClick={() => setColor(index)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button
                className={`rounded-2xl w-[60vw] p-6 ${getColor(color)} font-bold text-xl hover:text-amber-50 hover:border-amber-50 max-w-[500px]`}
                onClick={saveChanges}>Save Changes
            </button>
        </div>
    );
}

export default Profile;
