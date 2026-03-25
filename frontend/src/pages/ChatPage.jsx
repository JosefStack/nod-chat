import { useAuthStore } from '../store/useAuthStore'
import AnimatedBorderContainer from "../components/AnimatedBorderContainer"
import { useChatStore } from '../store/useChatStore'
import ActiveTabSwitch from '../components/ActiveTabSwitch'
import ChatsList from '../components/ChatsList'
import ContactsList from '../components/ContactsList'
import ProfileHeader from '../components/ProfileHeader'
import ChatContainer from '../components/ChatContainer'
import NoConversationPlaceholder from '../components/NoConversationPlaceholder'



const ChatPage = () => {

    const { activeTab, selectedUser } = useChatStore();

    return (


                <div className="relative w-full max-w-6xl h-[700px]">
                    <AnimatedBorderContainer>
                        {/* left side */}
                        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
                            {/* profile header component */}
                            <ProfileHeader />
                            {/* active tab switch component */}
                            <ActiveTabSwitch />
                            {/* tab container */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
                            </div>
                        </div>
                        {/* right side */}
                        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
                            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
                        </div>
                    </AnimatedBorderContainer>
                </div>
            

        
    )
}

export default ChatPage

