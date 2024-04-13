import create from "zustand";
import { chatsData } from "../MockData";
import { EChatType } from "../model/enums/EChatType";
import { ChatType } from "../model/types/ChatType";

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
	updateActiveChat: (chatId: number) => useStore.setState({ activeChat: chatsData.find((chat) => chat.id === chatId) || null }),
	getLastMessageFromChat(chatId: number) {
		const chat = chatsData.find((chat) => chat.id === chatId);
		if (chat) {
			return chat.messages[chat.messages.length - 1];
		}
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
