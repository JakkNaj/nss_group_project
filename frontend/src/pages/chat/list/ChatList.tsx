import { SearchField } from "./SearchField.tsx";
import ChatListItems from "./ChatListItems.tsx";
import styled from "styled-components";
import { State } from "../../../stores/ChatStore.ts";

import { ChatStore } from "../../../stores/ChatStore.ts";

const StyledChatListLayout = styled.div({
	padding: "2rem",
	display: "flex",
	flexDirection: "column",
	gap: "2rem",
	textAlign: "left",
	fontFamily: "Inter, sans-serif",
});

interface ChatListProps {
	showChatWindow: () => void;
}

export const ChatList = ({ showChatWindow }: ChatListProps) => {
	const { directChats, groupChats } = ChatStore.useStore((state: State) => ({
		directChats: state.directChats,
		groupChats: state.groupChats,
	}));

	return (
		<StyledChatListLayout>
			<SearchField />
			<ChatListItems sectionName="Friends" chats={directChats} displayRowsNumber={6} toggleProfileWindow={showChatWindow} />
			<ChatListItems sectionName="Groups" chats={groupChats} displayRowsNumber={4} toggleProfileWindow={showChatWindow} />
		</StyledChatListLayout>
	);
};
