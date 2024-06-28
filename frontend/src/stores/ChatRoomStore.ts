import {create} from "zustand";
import {EChatType} from "../model/enums/EChatType";
import {ChatRoomType} from "../model/types/ChatRoomType.ts";
import {UserType} from "../model/types/UserType.ts";
import {chatRoomsData as mockData} from "../MockData.ts";
import {ChatLogStore, useChatLogStore} from "./ChatLogStore.ts";
import {MessageType} from "../model/types/MessageType.ts";
import {EMessageType} from "../model/enums/EMessageType.ts";
import {UserStore} from "./UserStore.ts";

export type State = {
	chats: ChatRoomType[];
	directChats: ChatRoomType[];
	groupChats: ChatRoomType[];
	activeChatRoom: ChatRoomType | null;
	reset: () => void;
};

export const useChatStore = create<State>((set) => ({
	chats: [],
	directChats: [],
	groupChats: [],
	activeChatRoom: null,
	reset: () => {
		console.warn("resetting chat store");
		set({ chats: [], directChats: [], groupChats: [], activeChatRoom: null });
	},
}));

export const ChatRoomStore = {
	useStore: useChatStore,
	reset: useChatStore.getState().reset,
	initializeChats: (chatsData: ChatRoomType[]) => {
		useChatStore.setState({
			chats: chatsData,
			directChats: chatsData.filter((chat) => chat.type === EChatType.ONE_ON_ONE),
			groupChats: chatsData.filter((chat) => chat.type === EChatType.GROUP),
			activeChatRoom: chatsData[0] || null,
		});
	},
	updateActiveChatRoom: (chatId: number) => {
		const chat = useChatStore.getState().chats.find((chat) => chat.chatLogId === chatId) || null;
		useChatStore.setState({ activeChatRoom: chat });
		if (chat) {
			ChatLogStore.updateActiveChatLog(chat.chatLogId);
		}
	},
	setActiveChatRoom: async (chat: ChatRoomType) => {
		const fetchedChatLog = await useChatLogStore.getState().fetchChatLog(chat.chatLogId);
		if (fetchedChatLog) {
			await ChatLogStore.setActiveChatLog(fetchedChatLog);
		}
		useChatStore.setState({ activeChatRoom: chat });
	},
	getActiveChatRoom: () => {
		return useChatStore.getState().activeChatRoom;
	},
	getChatUsers: async (chatId: number): Promise<UserType[]> => {
		const chat = ChatRoomStore.findChat(chatId);
		if (chat) {
			const usersPromises = chat.members.map(userId => UserStore.fetchUserDetails(userId));
			const users = await Promise.all(usersPromises);
			return users;
		}
		return [];
	},
	findChat: (chatId: number): ChatRoomType | undefined => {
		const state = useChatStore.getState();
		const chat = state.chats.find((chat) => chat.chatLogId === chatId);
		if (chat) {
			return chat;
		}
		if (state.activeChatRoom && state.activeChatRoom.chatLogId === chatId) {
			return state.activeChatRoom;
		}
		return undefined;
	},
	initializeStore: async (userId: number) => {
		try {
			const chatResponse = await fetch(`http://localhost:8085/chat-history/chatRoom?userId=${userId}`, {
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
			ChatRoomStore.initializeChats(chatsData);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	getChatName: (chatId: number) => {
		const chat = useChatStore.getState().chats.find((chat) => chat.chatLogId === chatId);
		if (chat) {
			return chat.name;
		}
		return "";
	},
	initializeStoreWithMockData: () => {
		console.log("initializing chat store with mock data");
		const chatsData = mockData;
		ChatRoomStore.initializeChats(chatsData);
	},
	leaveChat: (chatId: number) => {
		console.log("leaving chat with id: ", chatId);
		const chat = ChatRoomStore.findChat(chatId);
		if (chat) {
			useChatStore.setState({
				chats: useChatStore.getState().chats.filter((chat) => chat.chatLogId !== chatId),
				directChats: useChatStore.getState().directChats.filter((chat) => chat.chatLogId !== chatId),
				groupChats: useChatStore.getState().groupChats.filter((chat) => chat.chatLogId !== chatId),
				activeChatRoom:
					useChatStore.getState().activeChatRoom?.chatLogId === chatId ? null : useChatStore.getState().activeChatRoom,
			});
			ChatLogStore.removeChatLog(chatId);
		}
	},
	addUserToChat: (chatId: number, userId: number) => {
		const chat = ChatRoomStore.findChat(chatId);
		if (chat) {
			if (chat.members.includes(userId)) {
				return false;
			}
			const updatedChat = {
				...chat,
				members: [...chat.members, userId],
			};
			useChatStore.setState({
				chats: useChatStore.getState().chats.map((chat) => (chat.chatLogId === chatId ? updatedChat : chat)),
				directChats: useChatStore.getState().directChats,
				groupChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.GROUP),
				activeChatRoom:
					useChatStore.getState().activeChatRoom?.chatLogId === chatId ? updatedChat : useChatStore.getState().activeChatRoom,
			});
			return true
		}
		return false;
	},
	getChatRoom: async (chatId: number): Promise<ChatRoomType | null> => {
		try {
			console.log("Sending request to fetch chat room with id: ", chatId);
			const response = await fetch(`http://localhost:8085/chat-history/chatRoom/${chatId}`, {
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

			const chatRoom = await response.json();
			console.warn("fetched joined chatRoom: " , chatRoom);
			return chatRoom;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	addGroupChat: (chat: ChatRoomType) => {
		if (useChatStore.getState().groupChats.find(existingChat => existingChat.chatLogId === chat.chatLogId)) {
			return false;
		}
		useChatStore.setState({
			chats: useChatStore.getState().chats,
			directChats: useChatStore.getState().directChats,
			groupChats: [...useChatStore.getState().groupChats, chat],
			activeChatRoom: useChatStore.getState().activeChatRoom
		});
	},
	addDirectChat: (chat: ChatRoomType) => {
		if (useChatStore.getState().directChats.includes(chat)) {
			return false;
		}
		useChatStore.setState({
			chats: useChatStore.getState().chats,
			directChats: [...useChatStore.getState().directChats, chat],
			groupChats: useChatStore.getState().groupChats,
			activeChatRoom: useChatStore.getState().activeChatRoom});

	},
	addUserToChatRoomBEcall: async (chatId: number, userId: number) => {
		const chatMessage: MessageType = {
			messageLogId: chatId,
			senderId: userId,
			content: null,
			type: EMessageType.JOIN,
			timestampInSeconds: Math.floor(Date.now() / 1000),
			messageReference: null,
		};

		//wait for response
		try {
			const response = await fetch("http://localhost:8085/chat/addUserToChat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(chatMessage),
			});

			if (!response.ok) {
				console.error(`Error adding user ${userId} to chat ${chatId}: ${response.statusText}`);
				return false;
			}

			console.log(`User ${userId} added to chat ${chatId}`);
			return true;
		} catch (error) {
			console.error(`Error adding user ${userId} to chat ${chatId}: ${error}`);
			return false;
		}
	},
};