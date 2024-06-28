import { ChatLogType } from "../model/types/ChatLogType.ts";
import { MessageType } from "../model/types/MessageType.ts";
import { create } from "zustand";

type ChatLogStore = {
	chatLogs: ChatLogType[];
	activeChatLog: ChatLogType | null;
	updateChatLogWithNewMessage: (chatLogId: number, message: MessageType) => void;
	updateActiveChatLog: (chatLogId: number) => void;
	fetchChatLog: (chatLogId: number) => Promise<ChatLogType | undefined>;
	reset: () => void;
};

export const useChatLogStore = create<ChatLogStore>((set) => ({
	chatLogs: [],
	activeChatLog: null,
	updateChatLogWithNewMessage: (chatLogId, message) =>
		set((state) => {
			console.log("updating chat log with new message", chatLogId, message);
			const chatLogIndex = state.chatLogs.findIndex((chatLog) => chatLog.chatLogId === chatLogId);
			if (chatLogIndex !== -1) {
				const updatedChatLog = {
					...state.chatLogs[chatLogIndex],
					messages: [...state.chatLogs[chatLogIndex].messages, message],
				};

				const updatedChatLogs = [...state.chatLogs];
				updatedChatLogs[chatLogIndex] = updatedChatLog;

				// If the updated chat log is the active chat log, update the active chat log as well
				const updatedActiveChatLog =
					state.activeChatLog && state.activeChatLog.chatLogId === chatLogId ? { ...updatedChatLog } : state.activeChatLog;

				return { chatLogs: updatedChatLogs, activeChatLog: updatedActiveChatLog };
			}
			// Return current state if chatLogIndex is not found
			return state;
		}),
	updateActiveChatLog: (chatLogId: number) =>
		set((state) => {
			const activeChatLog = state.chatLogs.find((chatLog) => chatLog.chatLogId === chatLogId) || null;
			return { activeChatLog };
		}),
	fetchChatLog: async (chatLogId: number) => {
		try {
			console.log("fetching chat log with id: ", chatLogId);
			const response = await fetch(`http://localhost:8085/chat-history/chatLog?chatLogId=${chatLogId}&page=${0}`, {
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
				const chatLogIndex = chatLogs.findIndex((chatLog) => chatLog.chatLogId === chatLogId);
				if (chatLogIndex !== -1) {
					chatLogs[chatLogIndex] = chatLog;
				} else {
					chatLogs.push(chatLog);
				}
				return { chatLogs };
			});
			console.log("done fetching chat log");
			return chatLog;
		} catch (error) {
			console.error(error);
		}
		return undefined;
	},
	reset: () => {
		console.warn("Resetting chat log store");
		set({ chatLogs: [], activeChatLog: null });
	},
}));

export const ChatLogStore = {
	getLastMessageFromChatLog: (chatLogId: number): MessageType | undefined => {
		const chatLog: ChatLogType | undefined = useChatLogStore
			.getState()
			.chatLogs.find((chatLog: ChatLogType) => chatLog.chatLogId === chatLogId);
		if (chatLog) {
			return chatLog.messages[chatLog.messages.length - 1];
		}
		return undefined;
	},
	updateActiveChatLog: (chatLogId: number) => {
		useChatLogStore.getState().updateActiveChatLog(chatLogId);
	},
	setActiveChatLog: async (chatLog: ChatLogType) => {
		if (chatLog) {
			chatLog.messages.sort((a, b) => b.timestampInSeconds - a.timestampInSeconds);
			useChatLogStore.setState({ activeChatLog: chatLog });
		}
	},
	reset: useChatLogStore.getState().reset,
	initializeStore: async (userId: number) => {
		try {
			const chatResponse = await fetch(`http://localhost:8085/chat-history/chatLogsForUser?userId=${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					//todo auth headers
				},
			});

			if (!chatResponse.ok) {
				const errorData = await chatResponse.json();
				throw new Error(`HTTP error! status: ${chatResponse.status}, message: ${errorData.message}`);
			}

			const pageData = await chatResponse.json();
			let chatLogs = pageData.content;

			// Sort the messages in each chat log by their timestamps
			chatLogs = chatLogs.map((chatLog : ChatLogType) => {
				return {
					...chatLog,
					messages: chatLog.messages.sort((a, b) => a.timestampInSeconds - b.timestampInSeconds)
				};
			});

			useChatLogStore.setState({ chatLogs: chatLogs });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	removeChatLog: (chatLogId: number) => {
		useChatLogStore.setState({
			chatLogs: useChatLogStore.getState().chatLogs.filter((chatLog) => chatLog.chatLogId !== chatLogId),
			activeChatLog:
				useChatLogStore.getState().activeChatLog?.chatLogId === chatLogId ? null : useChatLogStore.getState().activeChatLog,
		});
	},
};