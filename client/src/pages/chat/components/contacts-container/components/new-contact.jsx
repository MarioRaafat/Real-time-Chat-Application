import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input.jsx";
import Lottie from "react-lottie";
import {animationDefault} from "@/lib/utils.js";
import {apiClient} from "@/lib/api-client.js";
import {GET_CONTACTS_ROUTE} from "@/utils/constants.js";
import {useAppstore} from "@/store/index.js";
import { toast } from "sonner";

const NewContact = () => {
    const {chatType, chatMessages, chatData, setChatType, setChatMessages, setChatData} = useAppstore();
    const [isOpened, setIsOpened] = useState(false);
    const [contacts, setContacts] = useState([]);

    //["Mario", "hi", "aa", "ss", "aaa", "asgu", "Mario", "hi", "aa", "ss", "aaa", "asgu"]
    const handleSearch = async (value) => {
        if (!value) {
            setContacts([]);
            return;
        }

        if (value.length > 2) {
            try {
                if (value){
                    const response = await apiClient.post(GET_CONTACTS_ROUTE, { searchTerm: value }, { withCredentials: true });
                    const data = await response.data;
                    if (response.status === 200) {
                        setContacts(data);
                    } else {
                        console.log(data.message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    function handleSelectContact (contact) {
        setChatType('contact');
        setChatData(contact);
        setChatMessages([]);
        setIsOpened(false);
    }

    return (
        <div>
            <Dialog open={isOpened} onOpenChange={setIsOpened}>
                <DialogTrigger>
                    <TooltipProvider>
                        <Tooltip>
                            <FaPlus className="text-gray-400 hover:text-amber-50 cursor-pointer" />
                            <TooltipContent>
                                <p>Add a new contact</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </DialogTrigger>
                <DialogContent className="flex flex-col bg-gray-950 text-amber-50 border-purple-500 border-[1px] max-w-sm mx-auto h-[70vh]">
                    <DialogHeader className="flex items-center justify-between">
                        <DialogTitle className="font-bold text-xl text-amber-50">Please select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search contacts"
                            className="w-full p-2 sm:p-4 bg-slate-900 text-amber-50 border-none outline-none"
                            type="text"
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyDown= {(event) => {
                                if (event.key === 'Enter') {
                                    toast.error("Please type at least 3 characters to search");
                                }
                            }}
                        />
                        <div className="sm:px-4 opacity-55">
                            Please enter at least 3 characters to search
                        </div>
                    </div>
                    <ScrollArea className=" h-[90%]  w-full overflow-auto">
                        {contacts.length > 0 ? (
                            contacts.map((contact, index) => (
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
                            <div className=" flex-1 flex-col justify-center items-center
                                     transition-all duration-1000 mt-5">
                                <Lottie isClickToPauseDisabled={true}
                                        width={100} height={100} options={animationDefault}/>
                                <div className="flex items-center justify-center text-xl mt-5 poppins-semibold">
                                    <p className="text-white font-semibold ">There are <span
                                        className="text-fuchsia-600 bold"> no </span> contacts</p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewContact;
