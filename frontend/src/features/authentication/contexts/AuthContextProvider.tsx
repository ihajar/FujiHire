import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { request } from "@/utils/api";
import { UserRole } from "@/types/user";

interface IAuthResponse {
    token: string;
    user: IUser;
}

export interface IUser {
    id: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

interface IAuthContextType {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<IUser | null>>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<IAuthContextType | null>(null);

export function useAuth() {
    return useContext(AuthContext)!;
}

export function AuthContextProvider() {
    const location = useLocation();
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isOnAuthPage = 
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/request-password-reset";
    
    const login = async(email: string, password: string) => {
        await request<IAuthResponse>({
            endpoint: "/api/v1/auth/login",
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                role: user?.role || UserRole.JOB_SEEKER
            }),
            onSuccess:({ token, user }) => {
                localStorage.setItem("token", token);
                setUser(user);
            },
            onFailure: (error) => {
                throw new Error(error);
            }
        });
    }

    const signup = async(email: string, password: string, role: UserRole) => {
        await request<IAuthResponse>({
            endpoint: "/api/v1/auth/register",
            method: "POST",
            body: JSON.stringify({ email, password, role }),
            onSuccess: ({ token, user }) => {
                localStorage.setItem("token", token);
                setUser(user);
            },
            onFailure: (error) => {
                throw new Error(error);
            },
        });
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        if (user) return;
        setIsLoading(true);
        const fetchUser = async() => {
            await request<IUser>({
                endpoint: "/api/v1/auth/users/me",
                onSuccess: (data) => setUser(data),
                onFailure: (error) => { console.log(error); },
            });
            setIsLoading(false);
        };
        fetchUser();
    }, [location.pathname]);


    if(!isLoading && !user && !isOnAuthPage) {
        return <Navigate to="/login" state={{ from: location.pathname }} />
    }

    if (user && !user.emailVerified && location.pathname !== "/verify-email") {
        return <Navigate to="/verify-email" />;
    }

    if (user && user.emailVerified && location.pathname === "/verify-email") {
        console.log("user verified!");
        return <Navigate to="/" />;
    }

    if (user && isOnAuthPage) {
        return <Navigate to={location.state?.from || "/"} />;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                signup,
            }}
        >
            <Outlet/>
        </AuthContext.Provider>
    )
}