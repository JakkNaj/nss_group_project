import { create } from "zustand";
import { EChatType } from "../model/enums/EChatType";
import { ChatRoomType } from "../model/types/ChatRoomType.ts";
import { UserStore } from "./UserStore.ts";
import { UserType } from "../model/types/UserType.ts";
import {MessageType} from "../model/types/MessageType.ts";
import {chatsData as mockData} from "../MockData.ts";

export type State = {
	chats: ChatRoomType[];
	directChats: ChatRoomType[];
	groupChats: ChatRoomType[];
	activeChat: ChatRoomType | null;
	updateChatWithNewMessage: (chatId: string, message: MessageType) => void;
};

export const useChatStore = create<State>((set) => ({
	chats: [],
	directChats: [],
	groupChats: [],
	activeChat: null,
	updateChatWithNewMessage: (chatId: string, message: MessageType) => {
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
					directChats: updatedChats.filter((chat) => chat.type === EChatType.ONE_ON_ONE),
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
	initializeChats: (chatsData: ChatRoomType[]) => {
		useChatStore.setState({
			chats: chatsData,
			directChats: chatsData.filter((chat) => chat.type === EChatType.ONE_ON_ONE),
			groupChats: chatsData.filter((chat) => chat.type === EChatType.GROUP),
			activeChat: chatsData[0] || null,
		});
	},
	updateActiveChat: (chatId: string) => {
		const chat = useChatStore.getState().chats.find((chat) => chat.id === chatId) || null;
		useChatStore.setState({ activeChat: chat });
	},
	getChatUsers(chatId: string): UserType[] {
		const chat = this.findChat(chatId);
		if (chat) {
			return chat.members.map((userId : number) => UserStore.getUserById(userId)).filter((user): user is UserType => user !== undefined);
		}
		return [];
	},
	findChat: (chatId: string): ChatRoomType | undefined => {
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
			throw error;
		}
	},
	getLastMessageFromChat: (chatId: string) => {
		const chat = useChatStore.getState().chats.find((chat) => chat.id === chatId);
		if (chat) {
			return chat.messages[chat.messages.length - 1];
		}
		return null;
	},
	getChatName: (chatId: string) => {
		const chat = useChatStore.getState().chats.find((chat) => chat.id === chatId);
		if (chat) {
			return chat.name;
		}
		return "";
	},
	initializeStoreWithMockData: () => {
		console.log("initializing chat store with mock data");
		const chatsData = mockData;
		ChatStore.initializeChats(chatsData);
	},
	removeUserFromChat: (chatId: string, userId: number) => {
		const chat = ChatStore.findChat(chatId);
		if (chat) {
			const updatedChat = {
				...chat,
				members: chat.members.filter((memberId) => memberId !== userId),
			};
			//maybe unnecessary filtering
			useChatStore.setState({
				chats: useChatStore.getState().chats.map((chat) => (chat.id === chatId ? updatedChat : chat)),
				directChats: useChatStore.getState().directChats,
				groupChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.GROUP),
				activeChat: useChatStore.getState().activeChat?.id === chatId ? updatedChat : useChatStore.getState().activeChat,
			});
		}
	},
	addUserToChat: (chatId: string, userId: number) => {
		const chat = ChatStore.findChat(chatId);
		if (chat) {
			const updatedChat = {
				...chat,
				members: [...chat.members, userId],
			};
			//maybe unnecessary filtering
			useChatStore.setState({
				chats: useChatStore.getState().chats.map((chat) => (chat.id === chatId ? updatedChat : chat)),
				directChats: useChatStore.getState().directChats,
				groupChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.GROUP),
				activeChat: useChatStore.getState().activeChat?.id === chatId ? updatedChat : useChatStore.getState().activeChat,
			});
		}
	},
	addMessageToChat: (chatId: string, message: MessageType) => {
		const chat = ChatStore.findChat(chatId);
		if (chat) {
			const updatedChat = {
				...chat,
				messages: [...chat.messages, message],
			};
			//maybe unnecessary filtering
			useChatStore.setState({
				chats: useChatStore.getState().chats.map((chat) => (chat.id === chatId ? updatedChat : chat)),
				directChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.ONE_ON_ONE),
				groupChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.GROUP),
				activeChat: useChatStore.getState().activeChat?.id === chatId ? updatedChat : useChatStore.getState().activeChat,
			});
		}
	},

};