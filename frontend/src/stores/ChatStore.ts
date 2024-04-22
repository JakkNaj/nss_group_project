import { create } from "zustand";
import { chatsData } from "../MockData";
import { EChatType } from "../model/enums/EChatType";
import { ChatType } from "../model/types/ChatType";
import { UserStore } from "./UserStore.ts";
import { UserType } from "../model/types/UserType.ts";
import {MessageType} from "../model/types/MessageType.ts";

export type State = {
	chats: typeof chatsData;
	directChats: ChatType[];
	groupChats: ChatType[];
	activeChat: ChatType | null;
	updateDirectChatWithNewMessage: (chatId: number, message: MessageType) => void;
	updateGroupChatWithNewMessage: (chatId: number, message: MessageType) => void;

};

const defaultState: State = {
	chats: chatsData,
	directChats: chatsData.filter((chat) => chat.type === EChatType.DIRECT),
	groupChats: chatsData.filter((chat) => chat.type === EChatType.GROUP),
	activeChat: chatsData[0] || null,
	updateDirectChatWithNewMessage: (chatId: number, message: MessageType) => {
		// Default implementation
	},
	updateGroupChatWithNewMessage: (chatId: number, message: MessageType) => {
		// Default implementation
	},
};

const useStore = create<State>((set) => ({
	chats: chatsData,
	directChats: chatsData.filter((chat) => chat.type === EChatType.DIRECT),
	groupChats: chatsData.filter((chat) => chat.type === EChatType.GROUP),
	activeChat: chatsData[0] || null,
	updateDirectChatWithNewMessage: (chatId: number, message: MessageType) => {
		set((state) => {
			const chatIndex = state.directChats.findIndex(chat => chat.id === chatId);
			if (chatIndex !== -1) {
				const updatedChat = {
					...state.directChats[chatIndex],
					messages: [...state.directChats[chatIndex].messages, message]
				};
				const updatedChats = [...state.directChats];
				updatedChats[chatIndex] = updatedChat;
				return {
					...state,
					directChats: updatedChats
				};
			}
			return state;
		});
	},
	updateGroupChatWithNewMessage: (chatId: number, message: MessageType) => {
		set((state) => {
			const chatIndex = state.groupChats.findIndex(chat => chat.id === chatId);
			if (chatIndex !== -1) {
				const updatedChat = {
					...state.groupChats[chatIndex],
					messages: [...state.groupChats[chatIndex].messages, message]
				};
				const updatedChats = [...state.groupChats];
				updatedChats[chatIndex] = updatedChat;
				return {
					...state,
					groupChats: updatedChats
				};
			}
			return state;
		});
	},
}));

export const ChatStore = {
	useStore,
	findChat(chatId: number) {
		return chatsData.find((chat) => chat.id === chatId);
	},
	updateActiveChat: (chatId: number) => useStore.setState({ activeChat: chatsData.find((chat) => chat.id === chatId) || null }),
	getLastMessageFromChat(chatId: number) {
		const chat = this.findChat(chatId);
		if (chat) {
			return chat.messages[chat.messages.length - 1];
		}
	},
	getChatName(chatId: number) {
		const chat = this.findChat(chatId);
		if (chat && chat.type === EChatType.DIRECT) {
			for (let i = 0; i < chat.users.length; i++) {
				if (chat.users[i] !== UserStore.getLoggedInUser().id) {
					const otherUser = UserStore.getUserById(chat.users[i]);
					return otherUser ? otherUser.name : "Unknown user";
				}
			}
		}
		return chat ? chat.name : "Unknown chat";
	},
	getChatUsers(chatId: number): UserType[] {
		const chat = this.findChat(chatId);
		if (chat) {
			return chat.users.map((userId) => UserStore.getUserById(userId)).filter((user): user is UserType => user !== undefined);
		}
		return [];
	},
	resetActiveChat: () => useStore.setState(defaultState),
	updateDirectChatWithNewMessage: useStore.getState().updateDirectChatWithNewMessage,
	updateGroupChatWithNewMessage: useStore.getState().updateGroupChatWithNewMessage,
};