
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useRef } from 'react';
import { ChatHeader } from "./ChatHeader"
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder"
import MessageInput from "./MessageInput";
import MessagesLoadingSkeletion from "./MessagesLoadingSkeletion";


const ChatContainer = () => {

    const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } = useChatStore();
    const { authUser } = useAuthStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessagesByUserId(selectedUser._id);
    }, [selectedUser])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <>
            <ChatHeader />

            <div className="flex-1 px-6 overflow-y-auto py-8">
                {messages.length > 0 && !isMessagesLoading? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {
                            messages.map((message) => (
                                <div key={message._id}
                                    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                                >
                                    <div className={
                                        `chat-bubble relative ${message.senderId === authUser._id
                                            ? "bg-cyan-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                        }`
                                    }>
                                        {
                                            message.image && (<img src={message.image} alt="shared"
                                                className="rounded-lg h-48 object-cover"
                                            />)
                                        }

                                        {
                                            message.text && <p>{message.text}</p>
                                        }
                                        <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>

                                    </div>
                                </div>
                            ))
                        }
                        {/* target for scroll into view */}
                        <div ref={messageEndRef} />
                    </div>
                ) : isMessagesLoading ? <MessagesLoadingSkeletion /> : (
                    <NoChatHistoryPlaceholder name={selectedUser.fullName} />
                )}
            </div>

            <MessageInput />
        </>
    )
}

export default ChatContainer
