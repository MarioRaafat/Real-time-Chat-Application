import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import "./index.css"
import Victory from "../../assets/victory.svg"
import {apiClient} from "@/lib/api-client.js";
import {SIGNUP_ROUTE, LOGIN_ROUTE} from "@/utils/constants.js";
import {useNavigate} from "react-router-dom";
import {useAppstore} from "@/store/index.js";

const author = () => {

    const nav = useNavigate();
    const {setUserInfo} = useAppstore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateSignup = () => {
        if (!email.trim() || !password || !confirmPassword || !firstName || !lastName) {
            toast.error("All fields are required")
            return false
        } else if (firstName.trim() && lastName.trim()) {
            if (!/^[A-Za-z].*[A-Za-z].*[A-Za-z].*[A-Za-z]/.test(firstName) ||
                !/^[A-Za-z].*[A-Za-z].*[A-Za-z].*[A-Za-z]/.test(lastName)) {
                toast.error("First and last name must contain at least 3 letters and begin with a letter")
                return false
            }
        } else if (!email.includes("@") || !email.includes(".")) {
            toast.error("Invalid email")
            return false
        }
        else if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return false
        } else if (confirmPassword.length < 6) {
            toast.error("Confirm password must be at least 6 characters")
            return false
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return false
        }
        return true
    }

    const validateLogin = () => {
        if (!email.trim() || !password) {
            toast.error("All fields are required")
            return false
        } else if (!email.includes("@") || !email.includes(".")) {
            toast.error("Invalid email")
            return false
        }
        else if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return false
        }
        return true
    }
    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                const response = await apiClient.post(`${LOGIN_ROUTE}`, { email, password }, { withCredentials: true });
                toast.success("Login successful");
                setUserInfo(response.data.user);
                if (response.data.user.profileSetup) {
                    nav("/chat");
                } else {
                    nav("/profile");
                }
            } catch (error) {
                if (error.response) {
                    const { message } = error.response.data;
                    if (message === "User not found") {
                        toast.error("User not found, please check your email");
                    } else if (message === "Invalid password") {
                        toast.error("Incorrect password, please try again");
                    } else {
                        toast.error("Something went wrong, please try again later");
                    }
                }
            }
        }
    };

    const handleSignup = async () => {
        if (validateSignup()) {
            try {
                const response = await apiClient.post(`${SIGNUP_ROUTE}`, { email, password, firstName, lastName }, { withCredentials: true });
                toast.success("Signup successful");
                setUserInfo(response.data.user);
                nav("/profile");
            } catch (error) {
                if (error.response) {
                    const { message } = error.response.data;
                    if (message === "Email is already in use") {
                        toast.error("This email is already registered, please use another email");
                    } else {
                        toast.error("Something went wrong, please try again later");
                    }
                }
            }
        }
    };


    return (
        <>
            <div className="auth-page">
                <div className="auth-card">
                    <div className="card-content gap-10 w-full">
                        <div className="card-title w-full">
                            <div className="title">Welcome to ChatMe</div>
                            <img src={Victory} alt="victory img"/>
                        </div>
                        <p className="desc w-full flex justify-center items-center">Fill in the details to get started with ChatMe</p>

                        <Tabs defaultValue="Login" className="flex justify-center items-center flex-col mt-[15px] w-full">
                            <TabsList className="w-3/4 flex justify-between">

                                <TabsTrigger
                                    className="flex justify-center items-center data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black
                              data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 ease-in-out"
                                    value="Login">Login
                                </TabsTrigger>

                                <TabsTrigger
                                    className="flex justify-center items-center data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black
                              data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 ease-in-out"
                                    value="Sign up">Sign up
                                </TabsTrigger>

                            </TabsList>

                            <TabsContent value="Login" className="flex flex-col mt-[20px] gap-6 w-3/4">
                                <Input type="email" placeholder="Email" className="rounded-full p-6 " value={email} onChange={(e)=> setEmail(e.target.value)}/>
                                <Input type="password" placeholder="Password" className="rounded-full p-6 " value={password} onChange={(e)=> setPassword(e.target.value)}/>
                                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                            </TabsContent>

                            <TabsContent value="Sign up" className="flex flex-col mt-[20px] gap-6 w-3/4">
                                <div className="flex gap-6">
                                    <Input type="name" placeholder="First Name" className="rounded-full p-6 w-1/2" value={firstName} onChange={(e)=> setFirstName(e.target.value)}/>
                                    <Input type="name" placeholder="Last Name" className="rounded-full p-6 w-1/2" value={lastName} onChange={(e)=> setLastName(e.target.value)}/>
                                </div>
                                <Input type="email" placeholder="Email" className="rounded-full p-6 " value={email} onChange={(e)=> setEmail(e.target.value)}/>
                                <Input type="password" placeholder="Password" className="rounded-full p-6 " value={password} onChange={(e)=> setPassword(e.target.value)}/>
                                <Input type="password" placeholder="Confirm password" className="rounded-full p-6 " value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
                                <Button className="rounded-full p-6" onClick={handleSignup}>Sign up</Button>
                            </TabsContent>

                        </Tabs>

                    </div>
                </div>
            </div>
        </>
    );
}

export default author;
