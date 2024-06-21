import { SearchField } from "./SearchField.tsx";
import ChatListItems from "./ChatListItems.tsx";
import styled from "styled-components";
import { State } from "../../../stores/ChatRoomStore.ts";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";
import {DirectChatConnect} from "./DirectChatConnect.tsx";

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

	console.log("in ChatList, groupChats: ", groupChats);

	return (
		<Styled.ChatListLayout>
			<SearchField />
			<DirectChatConnect showChatWindow={showChatWindow}/>
			<Styled.ListSection>
				<ChatListItems
					sectionName="Joined Chats"
					chats={groupChats}
					displayRowsNumber={10}
					showChatWindow={showChatWindow}
				/>
			</Styled.ListSection>
		</Styled.ChatListLayout>
	);
};
