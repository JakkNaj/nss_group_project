import { create } from "zustand";
import { EChatType } from "../model/enums/EChatType";
import { ChatType } from "../model/types/ChatType";
import { UserStore } from "./UserStore.ts";
import { UserType } from "../model/types/UserType.ts";
import {MessageType} from "../model/types/MessageType.ts";

export type State = {
	chats: ChatType[];
	directChats: ChatType[];
	groupChats: ChatType[];
	activeChat: ChatType | null;
	updateChatWithNewMessage: (chatId: number, message: MessageType) => void;
};

export const useChatStore = create<State>((set, get) => ({
	chats: [],
	directChats: [],
	groupChats: [],
	activeChat: null,
	updateChatWithNewMessage: (chatId: number, message: MessageType) => {
		set((state) => {
			const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
			if (chatIndex !== -1) {
				const updatedChat = {
					...state.chats[chatIndex],
					messages: [...state.chats[chatIndex].messages, message]
				};
				const updatedChats = [...state.chats];
				updatedChats[chatIndex] = updatedChat;

				return {
					...state,
					chats: updatedChats,
					directChats: updatedChats.filter((chat) => chat.type === EChatType.DIRECT),
					groupChats: updatedChats.filter((chat) => chat.type === EChatType.GROUP),
					activeChat: state.activeChat?.id === chatId ? updatedChat : state.activeChat,
				};
			}
			return state;
		});
	},
}));

export const ChatStore = {
	useStore: useChatStore,
	initializeChats: (chatsData: ChatType[]) => {
		useChatStore.setState({
			chats: chatsData,
			directChats: chatsData.filter((chat) => chat.type === EChatType.DIRECT),
			groupChats: chatsData.filter((chat) => chat.type === EChatType.GROUP),
			activeChat: chatsData[0] || null,
		});
	},
	updateActiveChat: (chatId: number) => {
		const chat = useChatStore.getState().chats.find((chat) => chat.id === chatId) || null;
		useChatStore.setState({ activeChat: chat });
	},
	getChatUsers(chatId: number): UserType[] {
		const chat = this.findChat(chatId);
		if (chat) {
			return chat.users.map((userId : number) => UserStore.getUserById(userId)).filter((user): user is UserType => user !== undefined);
		}
		return [];
	},
	findChat: (chatId: number): ChatType | undefined => {
		return useChatStore.getState().chats.find((chat) => chat.id === chatId);
	},
	initializeStore: async (username : string) => {
		try {
			const chatResponse = await fetch(`http://localhost:8081/getChatHistoryForUser?username=${username}`, {
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

			const chatsData = await chatResponse.json();
			ChatStore.initializeChats(chatsData);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};