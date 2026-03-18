import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore"
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";


export const ChatHeader = () => {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const isOnline = onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setSelectedUser(null);
            }
        }

        window.addEventListener("keydown", handleEscapeKey);


        return () => window.removeEventListener("keydown", handleEscapeKey)
        // remove event listener when component unmounts/or when it is removed from the screen
        // without this cleanup , each re render of the page, would keep on adding event listeners over one another
        // so we remove each event listener after the page closes

    }, []);



    return (
        <div className="flex justify-between items-center bg-slate-800/50 
        border-b border-slate-700/50 max-h-[84px] px-6 flex-1">

            <div className="flex items-center space-x-3">
                <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                    <div className="w-12 rounded-full">
                        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
                    <p className="text-slate-400 text-sm">{isOnline ? "online" : "offline"}</p>
                    {/* change online with socket */}
                </div>
            </div>

            {/* close chat */}
            <button onClick={() => setSelectedUser(null)}>
                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>


        </div>
    )
}

