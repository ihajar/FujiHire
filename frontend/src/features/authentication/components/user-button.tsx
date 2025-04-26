import { User2Icon } from "lucide-react";
import { useAuth } from "../contexts/AuthContextProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/loader";



export const UserButton = () => {
    const auth = useAuth();
    if (!auth) {
        return <Loader />;
    }
    const { user, logout } = auth;
    const navigate = useNavigate();
    
    const handleLogout = async() => {
        await logout();
        navigate('/login');
    }
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                {/* <AvatarImage src={} /> */}
                <AvatarFallback className="bg-muted-foreground/30">
                    <User2Icon className="text-white"/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 px-2 border-muted-foreground/10 shadow-md mr-5">
            <DropdownMenuLabel className="items-start">
                <span className="font-bold">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-muted-foreground/10" />
            <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                    Edit profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    Message
                </DropdownMenuItem >
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-muted-foreground/10"/>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
               Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}