import { SearchField } from "./SearchField.tsx";
import ChatListItems from "./ChatListItems.tsx";
import styled from "styled-components";
import { State } from "../../../stores/ChatRoomStore.ts";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";
import {DirectChatConnect} from "./DirectChatConnect.tsx";
import {ChatLogStore} from "../../../stores/ChatLogStore.ts";

const Styled = {
	ChatListLayout: styled("div")({
		padding: "2rem",
		display: "flex",
		flexDirection: "column",
		gap: "2rem",
		textAlign: "left",
		fontFamily: "Inter, sans-serif",
	}),
	ListSection: styled("section")({
		display: "flex",
		flexDirection: "column",
		width: "100%",
	}),
};

interface ChatListProps {
	showChatWindow: () => void;
}

export const ChatList = ({ showChatWindow }: ChatListProps) => {
	const { groupChats } = ChatRoomStore.useStore((state: State) => ({
		groupChats: state.groupChats,
	}));

	const sortedChats = [...groupChats].sort((a, b) => {
		const lastMessageA = ChatLogStore.getLastMessageFromChatLog(a.chatLogId);
		const lastMessageB = ChatLogStore.getLastMessageFromChatLog(b.chatLogId);

		// If a chat doesn't have any messages, set its timestamp to 0
		const timestampA = lastMessageA ? lastMessageA.timestampInSeconds : 0;
		const timestampB = lastMessageB ? lastMessageB.timestampInSeconds : 0;

		return timestampB - timestampA;
	});

	return (
		<Styled.ChatListLayout>
			<SearchField />
			<DirectChatConnect showChatWindow={showChatWindow}/>
			<Styled.ListSection>
				<ChatListItems
					sectionName="Joined Chats"
					chats={sortedChats}
					displayRowsNumber={10}
					showChatWindow={showChatWindow}
				/>
			</Styled.ListSection>
		</Styled.ChatListLayout>
	);
};
