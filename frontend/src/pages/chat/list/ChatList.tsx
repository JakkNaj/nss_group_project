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
	}),
};

interface ChatListProps {
	showChatWindow: () => void;
}

export const ChatList = ({ showChatWindow }: ChatListProps) => {
	const { directChats, groupChats } = ChatRoomStore.useStore((state: State) => ({
		directChats: state.directChats,
		groupChats: state.groupChats,
	}));

	const handleAddFriends = () => {
		console.log("Add more friends clicked");
	};

	const handleCreateGroupChat = () => {
		console.log("Create new group chat clicked");
	};

	return (
		<Styled.ChatListLayout>
			<SearchField />
			<DirectChatConnect toggleProfileWindow={showChatWindow}/>
			<Styled.ListSection>
				<ChatListItems
					sectionName="Friends"
					chats={directChats}
					displayRowsNumber={6}
					toggleProfileWindow={showChatWindow}
					buttonText="Add friends"
					buttonAction={handleAddFriends}
				/>
			</Styled.ListSection>
			<Styled.ListSection>
				<ChatListItems
					sectionName="Groups"
					chats={groupChats}
					displayRowsNumber={4}
					toggleProfileWindow={showChatWindow}
					buttonText="New group chat"
					buttonAction={handleCreateGroupChat}
				/>
			</Styled.ListSection>
		</Styled.ChatListLayout>
	);
};
