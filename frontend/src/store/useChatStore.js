import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  usersFetching: false,
  selectedUser: null,
  isMessagesLoading: false,
  isMessageSending: false,

  isTyping: false,

  getUserList: async () => {
    set({ usersFetching: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ usersFetching: false });
    }
  },

  getMessages: async (receiverId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${receiverId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { messages, selectedUser } = get();
    set({ isMessageSending: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send-message/${selectedUser._id}`,
        data
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageSending: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket || !selectedUser) return; // 🔑 FIX

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });

    socket.on("typing", ({ senderId, isTyping }) => {
      if (senderId === selectedUser._id) {
        set({ isTyping });
      }
    });
  },

  unsubscribefromMessages: async () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return; // 🔑 FIX
    socket.off("newMessage");
    socket.off("typing");
  },

  setIsTyping: (state) => {
    set({ isTyping: state });
  },
}));
