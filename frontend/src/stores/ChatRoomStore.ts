import { create } from "zustand";
import { EChatType } from "../model/enums/EChatType";
import { ChatRoomType } from "../model/types/ChatRoomType.ts";
import { UserStore } from "./UserStore.ts";
import { UserType } from "../model/types/UserType.ts";
import { chatRoomsData as mockData } from "../MockData.ts";
import { ChatLogStore, useChatLogStore } from "./ChatLogStore.ts";
import { MessageType } from "../model/types/MessageType.ts";
import { EMessageType } from "../model/enums/EMessageType.ts";

export type State = {
	chats: ChatRoomType[];
	directChats: ChatRoomType[];
	groupChats: ChatRoomType[];
	activeChatRoom: ChatRoomType | null;
};

export const useChatStore = create<State>(() => ({
	chats: [],
	directChats: [],
	groupChats: [],
	activeChatRoom: null,
}));

export const ChatRoomStore = {
	useStore: useChatStore,
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
		useChatStore.setState({activeChatRoom: chat});
	},
	getChatUsers(chatId: number): UserType[] {
		const chat = this.findChat(chatId);
		if (chat) {
			return chat.members.map((userId : number) => UserStore.getUserById(userId)).filter((user): user is UserType => user !== undefined);
		}
		return [];
	},
	findChat: (chatId: number): ChatRoomType | undefined => {
		return useChatStore.getState().chats.find((chat) => chat.chatLogId === chatId);
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
	removeUserFromChat: (chatId: number, userId: number) => {
		const chat = ChatRoomStore.findChat(chatId);
		if (chat) {
			const updatedChat = {
				...chat,
				members: chat.members.filter((memberId) => memberId !== userId),
			};
			useChatStore.setState({
				chats: useChatStore.getState().chats.map((chat) => (chat.chatLogId === chatId ? updatedChat : chat)),
				directChats: useChatStore.getState().directChats,
				groupChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.GROUP),
				activeChatRoom: useChatStore.getState().activeChatRoom?.chatLogId === chatId ? updatedChat : useChatStore.getState().activeChatRoom,
			});
		}
	},
	addUserToChat: (chatId: number, userId: number) => {
		const chat = ChatRoomStore.findChat(chatId);
		if (chat) {
			const updatedChat = {
				...chat,
				members: [...chat.members, userId],
			};
			useChatStore.setState({
				chats: useChatStore.getState().chats.map((chat) => (chat.chatLogId === chatId ? updatedChat : chat)),
				directChats: useChatStore.getState().directChats,
				groupChats: useChatStore.getState().chats.filter((chat) => chat.type === EChatType.GROUP),
				activeChatRoom: useChatStore.getState().activeChatRoom?.chatLogId === chatId ? updatedChat : useChatStore.getState().activeChatRoom,
			});
		}
	},
	getChatRoom: async (chatId: number): Promise<ChatRoomType | null> => {
		try {
			console.log("Sending request to fetch chat room with id: ", chatId);
			const response = await fetch(`http://localhost:8080/chat-history/chatRoom/${chatId}`, {
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
			console.log(chatRoom);
			return chatRoom;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	addUserToChatRoomBEcall: async (chatId: number, userId: number) => {
		const chatMessage : MessageType = {
			messageLogId: chatId,
			senderId: userId,
			content: null,
			type: EMessageType.JOIN,
			timestampInSeconds: Math.floor(Date.now() / 1000)
		};

		//wait for response
		try {
			const response = await fetch('http://localhost:8080/chat/addUserToChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
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
	}
};