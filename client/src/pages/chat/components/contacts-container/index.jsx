import ProfileInfo from "@/pages/chat/components/contacts-container/components/profile-info.jsx";
import NewContact from "@/pages/chat/components/contacts-container/components/new-contact.jsx";

const ContactsContainer = () => {
    return (
        <div className="w-[30vw] bg-[#1b1c24] relative border-r-[1px] border-gray-300">
            <Logo/>
            <div className="flex justify-between gap-2 p-5">
                <h6 className="text-gray-400 ml-2 hover:text-amber-50 cursor-pointer">Direct Messages</h6>
                <div className="flex items-center justify-center pr-10">
                    <NewContact />
                </div>
            </div>
            <div className="flex flex-col gap-2 p-5">
                <h6 className="text-gray-400 ml-2 hover:text-amber-50 cursor-pointer">Channels</h6>
                <div className="flex items-center justify-center pr-10">

                </div>
            </div>
            <ProfileInfo />
        </div>
    );
};

export default ContactsContainer;

export const Logo = () => {
    return (
        <div className="flex p-5 mt-4 justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="78"
                height="32"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {" "}
                <path
                    d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                    className="ccustom"
                    fill="#8338ec"
                ></path>{" "}
                <path
                    d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                    className="ccompli1"
                    fill="#975aed"
                ></path>{" "}
                <path
                    d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                    className="ccompli2"
                    fill="#a16ee8"
                ></path>{" "}
            </svg>
            <span className="text-3xl font-semibold text-gray-300">ChatMe</span>
        </div>
    );
};