import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Chat from "./pages/chat/components/index.jsx"
import Auth from "./pages/auth"
import Profile from "./pages/profile"
import {useAppstore} from "@/store/index.js";
import {apiClient} from "@/lib/api-client.js";
import {GET_USER_INFO} from "@/utils/constants.js";

const PrivateRoute = ({children}) => {
    const {userInfo} = useAppstore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({children}) => {
    const {userInfo} = useAppstore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? <Navigate to="/chat" /> : children;
}


function App() {

  const {userInfo, setUserInfo} = useAppstore();
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });

                if (response.status === 200) {
                    setUserInfo(response.data.user);
                } else {
                    console.log("Error status:", response.status);
                    setUserInfo(undefined);
                }
            } catch (err) {
                console.error("Error fetching user info:", err.response ? err.response.data : err.message);
                setUserInfo(undefined);
            } finally {
                setLoading(false);
            }
        };

        if (!userInfo) {
            getUserInfo();
        } else {
            setLoading(false);
        }
    }, [userInfo, setUserInfo]);

  return (
    <BrowserRouter>
    <div className="h-screen w-screen overflow-hidden">
        <Routes>
            <Route path="/author" element={
                <AuthRoute>
                    <Auth />
                </AuthRoute>
            }/>
            <Route path="/profile" element={
                <PrivateRoute>
                    <Profile />
                </PrivateRoute>
             } />
            <Route path="/chat" element={
                <PrivateRoute>
                    <Chat />
                </PrivateRoute>
            }/>

            <Route path="*" element={<Navigate to={"/author" } />} />
        </Routes>
        </div>
    </BrowserRouter>
  )
}

export default App