const notificationSound = new Audio("/sounds/notification.mp3")
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => (
    {
        allContacts: [],
        chats: [],
        messages: [],
        activeTab: "chats",
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

        toggleSound: () => {
            localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
            set({ isSoundEnabled: !get().isSoundEnabled })
        },

        setActiveTab: (tab) => set({ activeTab: tab }),
        setSelectedUser: (selectedUser) => set({ selectedUser }),   // selectedUser : selectedUser

        getAllContacts: async () => {
            set({ isUsersLoading: true });
            try {
                const response = await axiosInstance.get("/messages/contacts");
                set({ allContacts: response.data });
            } catch (error) {
                toast.error(error?.response?.data?.message);
            } finally {
                set({ isUsersLoading: false });
            }
        },

        getMyChatPartners: async () => {
            set({ isUsersLoading: true });
            try {
                const response = await axiosInstance.get("/messages/chats");
                set({ chats: response.data });

            } catch (error) {
                toast.error(error?.response?.data?.message)
            } finally {
                set({ isUsersLoading: false })
            }
        },

        getMessagesByUserId: async (userId) => {
            set({ isMessagesLoading: true });
            try {
                const response = await axiosInstance.get(`/messages/${userId}`);
                set({ messages: response.data });
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                set({ isMessagesLoading: false });
            }
        },

        sendMessage: async (messageData) => {

            const { selectedUser, messages } = get()
            // optimistic updates: message gets displayed right on send (no delays)
            const { authUser } = useAuthStore.getState();
            const tempId = `temp-${Date.now()}`;

            const optimisticMsg = {
                _id: tempId,
                senderId: authUser._id,
                receiverId: selectedUser._id,
                text: messageData.text,
                image: messageData.image,
                createdAt: new Date().toISOString(),
                isOptimistic: true  //(optional)
            }

            set({ messages: messages.concat(optimisticMsg) });


            try {
                const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
                set({ messages: messages.concat(response.data) });

            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
                // remove optimistic message on failure
                set({ messages })
            }

        },

        subscribeToMessages: () => {
            const { selectedUser } = get();
            if (!selectedUser) return;

            const { socket } = useAuthStore.getState();

            socket.on("newMessage", (newMessage) => {

                const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
                if (!isMessageFromSelectedUser) return;

                const currentMessages = get().messages;
                set({ messages: [...currentMessages, newMessage] });

                if (get().isSoundEnabled) {
                    notificationSound.currentTime = 0;
                    notificationSound.play().catch((error) => console.log("Failed to play notification sound: ", error));
                }
            })


        },

        unSubscribeToMessages: () => {
            const socket = useAuthStore.getState().socket;
            socket.off("newMessage");
        }

    }
));