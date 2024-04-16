import { SearchField } from "./SearchField.tsx";
import ChatListItems from "./ChatListItems.tsx";
import styled from "styled-components";
import { State } from "../../../stores/ChatStore.ts";
import { ChatStore } from "../../../stores/ChatStore.ts";
import { colors } from "../../../styles/colors.ts";
import Button from "@mui/material/Button";

const Styled = {
	ChatListLayout: styled("div")({
		padding: "2rem",
		display: "flex",
		flexDirection: "column",
		gap: "2rem",
		textAlign: "left",
		fontFamily: "Inter, sans-serif",
	}),
	Button: styled(Button)({
		backgroundColor: `${colors.darkerBackground} !important`,
		color: `${colors.primaryText} !important`,
		fontFamily: "Zilla Slab, sans-serif !important",
		width: "100%",
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
	const { directChats, groupChats } = ChatStore.useStore((state: State) => ({
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
			<Styled.ListSection>
				<ChatListItems sectionName="Friends" chats={directChats} displayRowsNumber={6} toggleProfileWindow={showChatWindow} />
				<Styled.Button variant="contained" onClick={handleAddFriends}>
					Add friends
				</Styled.Button>
			</Styled.ListSection>
			<Styled.ListSection>
				<ChatListItems sectionName="Groups" chats={groupChats} displayRowsNumber={4} toggleProfileWindow={showChatWindow} />
				<Styled.Button variant="contained" onClick={handleCreateGroupChat}>
					New group chat
				</Styled.Button>
			</Styled.ListSection>
		</Styled.ChatListLayout>
	);
};
