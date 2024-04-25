import {ChatLogType} from "../model/types/ChatLogType.ts";
import {MessageType} from "../model/types/MessageType.ts";
import create from "zustand";

type ChatLogStore = {
    chatLogs: ChatLogType[];
    activeChatLog: ChatLogType | null;
    updateChatLogWithNewMessage: (chatLogId: number, message: MessageType) => void;
    updateActiveChatLog: (chatLogId: number) => void;
    fetchChatLog: (chatLogId: number) => Promise<ChatLogType | undefined>;
};

export const useChatLogStore = create<ChatLogStore>((set) => ({
    chatLogs: [],
    activeChatLog: null,
    updateChatLogWithNewMessage: (chatLogId, message) => set((state) => {
        const chatLogIndex = state.chatLogs.findIndex((chatLog) => chatLog.id === chatLogId);
        if (chatLogIndex !== -1) {
            const updatedChatLog = {
                ...state.chatLogs[chatLogIndex],
                messages: [...state.chatLogs[chatLogIndex].messages, message],
            };
            const updatedChatLogs = [...state.chatLogs];
            updatedChatLogs[chatLogIndex] = updatedChatLog;
            return { chatLogs: updatedChatLogs };
        }
        // Return current state if chatLogIndex is not found
        return state;
    }),
    updateActiveChatLog: (chatLogId : number) => set((state) => {
        const activeChatLog = state.chatLogs.find((chatLog) => chatLog.id === chatLogId) || null;
        return { activeChatLog };
    }),
    fetchChatLog: async (chatLogId: number) => {
        try {
            const response = await fetch(`http://localhost:8081/getChatLog?chatLogId=${chatLogId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    //todo auth headers
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const chatLog = await response.json();
            set((state) => {
                const chatLogs = [...state.chatLogs];
                const chatLogIndex = chatLogs.findIndex((chatLog) => chatLog.id === chatLogId);
                if (chatLogIndex !== -1) {
                    chatLogs[chatLogIndex] = chatLog;
                } else {
                    chatLogs.push(chatLog);
                }
                return { chatLogs };
            });

            return chatLog;
        } catch (error) {
            console.error(error);
        }
        return undefined;
    },
}));

export const ChatLogStore = {
    getLastMessageFromChatLog: (chatLogId: number) : MessageType | undefined => {
        const chatLog : ChatLogType | undefined = useChatLogStore.getState().chatLogs.find((chatLog : ChatLogType) => chatLog.id === chatLogId);
        if (chatLog) {
            return chatLog.messages[chatLog.messages.length - 1];
        }
        return undefined;
    },
    updateActiveChatLog: (chatLogId : number) => {
        useChatLogStore.getState().updateActiveChatLog(chatLogId);
    },
    setActiveChatLog: async (chatLog : ChatLogType) => {
        const fetchedChatLog = await useChatLogStore.getState().fetchChatLog(chatLog.id);
        if (fetchedChatLog) {
            useChatLogStore.setState({ activeChatLog: fetchedChatLog });
        }
    }
}