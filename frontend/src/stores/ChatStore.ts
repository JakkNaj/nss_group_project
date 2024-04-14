import { create } from "zustand";
import { chatsData } from "../MockData";
import { EChatType } from "../model/enums/EChatType";
import { ChatType } from "../model/types/ChatType";
import { UserStore } from "./UserStore.ts";
import { UserType } from "../model/types/UserType.ts";

export type State = {
	chats: typeof chatsData;
	directChats: ChatType[];
	groupChats: ChatType[];
	activeChat: ChatType | null;
};

const defaultState: State = {
	chats: chatsData,
	directChats: chatsData.filter((chat) => chat.type === EChatType.DIRECT),
	groupChats: chatsData.filter((chat) => chat.type === EChatType.GROUP),
	activeChat: chatsData[0] || null,
};

const useStore = create<State>(() => defaultState);

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
};

/* How to setup store zustand template

type StoreType = {
	test: boolean;
};

const defauState: StoreType = {
	test: false,
};

const useStore = create<StoreType>(() => defaultState);

export const tvujStore = {
	updateTest: (test: boolean) => useStore.setState({ test }),
	useStore,
};

//how to use test
// const test = tvujStore.useStore((state) => state.test);*/
