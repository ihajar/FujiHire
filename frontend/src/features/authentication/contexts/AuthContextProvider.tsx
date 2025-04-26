import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { request } from "@/utils/api";



interface IAuthResponse {
    token: string;
    message: string;
}

export interface IUser {
    id: string;
    email: string;
    emailVerified: boolean;
}

interface IAuthContextType {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<IUser | null>>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
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
    
    const login = async(email: string, password: string) =>{
    await request<IAuthResponse>({
        endpoint: "/api/v1/auth/login",
        method: "POST",
        body: JSON.stringify({email, password}),
        onSuccess:({ token }) => {
            localStorage.setItem("token", token);
        },
        onFailure: (error) => {
            throw new Error(error);
        }
    })
}

    const signup = async(email: string, password: string) => {
        await request<IAuthResponse>({
            endpoint: "/api/v1/auth/register",
            method: "POST",
            body: JSON.stringify({ email, password }),
            onSuccess: ({ token }) => {
                localStorage.setItem("token", token);
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
        if (user) { return; }
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



// interface User {
//   id: string;
//   email: string;
//   emailVerified: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function useAuth() {
//   return useContext(AuthContext)!;
// }

// export function AuthContextProvider() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const isOnAuthPage =
//     location.pathname === "/login" ||
//     location.pathname === "/signup" ||
//     location.pathname === "/request-password-reset" ;

//    const login = async(email: string, password: string) => {
//     const reponse = await fetch(import.meta.env.VITE_API_URL + "/api/v1/auth/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//     });
//     if (reponse.ok) {
//         const { token } = await reponse.json();
//         localStorage.setItem("token", token);
//         await fetchUser();
//     } else {
//         const { message } = await reponse.json();
//         throw new Error(message);
//     }
//    };

//    const signup = async(email: string, password: string) => {
//     const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/auth/register", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//     });
//     if (response.ok) {
//         const { token } = await response.json();
//         localStorage.setItem("token", token);
//     } else {
//         const { message } = await response.json();
//         throw new Error(message);
//     }
//    };

//    const logout = async() => {
//     localStorage.removeItem("token");
//     setUser(null);
//    }

//    const fetchUser = async() => {
//     try {
//         const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/auth/users/me", {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//         if (!response.ok) {
//             throw new Error("Authentication failed");
//         }
//         const user = await response.json();
//         setUser(user);
//     } catch (e) {
//         console.log(e);
//     } finally {
//         setIsLoading(false);
//     }
//    }

//    useEffect(() => {
//     if(user) return;
//     fetchUser();
//    }, [location.pathname]);

//    useEffect(() => {
//     if(user && user?.emailVerified && location.pathname === "/verify-email"){
//         navigate("/", { replace: true });
//     }
//    }, [user, location.pathname, navigate])

//    if(isLoading) {
//     return <Loader />
//    }

//    if(!isLoading && !isOnAuthPage && !user) {
//     return <Navigate to="/login" state={{ from: location.pathname }} />;
//    }

//    if(user && !user.emailVerified && location.pathname !== "/verify-email") {
//     return <Navigate to="/verify-email" replace />;
//    }

//    if (user && user.emailVerified && location.pathname == "/verify-email") {
//     console.log("user verification 101");
//     // it should redirect to home page??
//     return <Navigate to="/" replace />;
//    }
   

//    return (
//         <AuthContext.Provider value={{ 
//             user,
//             login,
//             signup,
//             logout,
//             }}
//         >
            
//         <Outlet />
//         </AuthContext.Provider>
//     );
// }
