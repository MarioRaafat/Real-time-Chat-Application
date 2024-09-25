import { useState, useRef, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input.jsx";
import Lottie from "react-lottie";
import { animationDefault } from "@/lib/utils.js";
import { apiClient } from "@/lib/api-client.js";
import { GET_CONTACTS_ROUTE, CREATE_GROUP_ROUTE } from "@/utils/constants.js";
import { useAppstore } from "@/store/index.js";
import { toast } from "sonner";

const NewGroup = () => {
    const { setChatType, setChatData, setChatMessages, userInfo } = useAppstore();
    const [isOpened, setIsOpened] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [groupName, setGroupName] = useState('');
    const inputRef = useRef(null);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setIsInputVisible(false);
        }
    };

    useEffect(() => {
        if (isInputVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isInputVisible]);

    const nameInput = () => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleCreateGroup();
            }
        };

        return (
        <div>
            {isInputVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 backdrop-blur-lg z-50 flex items-center justify-center">
            <div
                ref={inputRef}
                className=""
            >
                <input
                    type="text"
                    className="w-[24rem] py-4 px-6 rounded-full text-gray-700 shadow-lg focus:ring-4 focus:ring-pink-400 border-none outline-none transition-all duration-500 bg-white focus:shadow-2xl text-lg placeholder-gray-400"
                    placeholder="Type group name here..."
                    autoFocus
                    onChange={(e) => setGroupName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            </div>
            )}
            </div>
        );
    };

    const handleSearch = async (value) => {
        if (!value) {
            setContacts([]);
            return;
        }

        try {
            const response = await apiClient.post(GET_CONTACTS_ROUTE, { searchTerm: value }, { withCredentials: true });
            if (response.status === 200) {
                setContacts(response.data);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = () => {
        if (selectedContacts.length < 3) {
            toast.error('Please select at least 3 contacts to create a group');
            return;
        }

        setIsOpened(false);
        setIsInputVisible(true);

    }

    const handleSelectContact = (contact) => {
        if (!selectedContacts.includes(contact)) {
            setSelectedContacts([...selectedContacts, contact]);
        }
    };

    const handleRemoveContact = (contact) => {
        setSelectedContacts(selectedContacts.filter((c) => c !== contact));
    };

    const handleCreateGroup = async () => {
        try {
            const response = await apiClient.post(CREATE_GROUP_ROUTE, 
                { members: selectedContacts.map((contact) => contact._id) , admin: userInfo.id, name: groupName },
                { withCredentials: true });

            if (response.status !== 201) {
                console.log(response.data);
            } 
            const group = response.data;

            setChatType('group');
            setChatData(group);
            setChatMessages([]);
            setIsOpened(false);
            setIsInputVisible(false);

            toast.success('Group created successfully');
        } catch (error) { 
            console.log(error); 
        }
    };

    return (
        <div>
            {
                nameInput()
            }
            <Dialog open={isOpened} onOpenChange={setIsOpened}>
                <DialogTrigger>
                    <TooltipProvider>
                        <Tooltip>
                            <FaPlus className="text-gray-400 hover:text-amber-50 cursor-pointer" />
                            <TooltipContent>
                                <p>Create a new group</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </DialogTrigger>
                <DialogContent className="flex flex-col bg-gray-950 text-amber-50 border-purple-500 border-[1px] max-w-sm mx-auto h-[70vh]">
                    <DialogHeader className="flex items-center justify-between">
                        <DialogTitle className="font-bold text-xl text-amber-50">Create a Group</DialogTitle>
                    </DialogHeader>

                    <Input
                        placeholder="Search contacts"
                        className="w-full p-2 sm:p-4 bg-slate-900 text-amber-50 border-none outline-none"
                        type="text"
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <div className="flex flex-wrap mt-2">
                        {selectedContacts.map((contact, index) => (
                            <div key={index} className="flex items-center bg-gray-700 rounded-full px-2 py-1 mr-2 mb-2">
                                <span>{contact.firstName} {contact.lastName}</span>
                                <button onClick={() => handleRemoveContact(contact)} className="ml-2 text-red-500">&times;</button>
                            </div>
                        ))}
                    </div>

                    <ScrollArea className="h-[90%] w-full overflow-auto">
                        {contacts.length > 0 ? (
                            contacts.map((contact, index) => 
                                ( !selectedContacts.includes(contact) &&
                                <div className="flex items-center gap-4 p-2 sm:p-4 hover:bg-slate-900 cursor-pointer" key={index} onClick={() => handleSelectContact(contact)}>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500 text-white">
                                        {contact.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="text-amber-50">{contact.firstName} {contact.lastName}</p>
                                        <p className="text-gray-500">{contact.email}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex-col justify-center items-center transition-all duration-1000 mt-5">
                                <Lottie isClickToPauseDisabled={true} width={100} height={100} options={animationDefault} />
                                <div className="flex items-center justify-center text-xl mt-5 poppins-semibold">
                                    <p className="text-white font-semibold">No contacts found</p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                    <button onClick={()=> handleSave()} className="mt-4 bg-blue-600 text-white rounded px-4 py-2">Create Group</button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewGroup;
