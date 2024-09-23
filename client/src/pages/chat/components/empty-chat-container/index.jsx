import Lottie from "react-lottie"
import {animationDefault} from "@/lib/utils.js";
import {useAppstore} from "@/store/index.js";

const EmptyChatContainer = () => {
    const {userInfo} = useAppstore();
    const {firstName} = userInfo;

    return (
        <div className=" flex-1 md:flex flex-col justify-center items-center
            hidden md:bg-black transition-all duration-1000">
            <Lottie isClickToPauseDisabled={true}
                    width={200} height={200} options={animationDefault} />
            <div className="flex items-center justify-center text-2xl mt-12 poppins-semibold">
                <p className="text-white font-semibold ">Hi {firstName}!</p> <span className="text-fuchsia-600 bold"> Welcome to ChatMe</span>
            </div>
        </div>
    );
};

export default EmptyChatContainer;