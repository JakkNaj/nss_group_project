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

export const ChatList = () => {
	const { directChats, groupChats } = ChatStore.useStore((state: State) => ({
		directChats: state.directChats,
		groupChats: state.groupChats,
	}));

	return (
		<StyledChatListLayout>
			<SearchField />
			<ChatListItems sectionName="Friends" chats={directChats} displayRowsNumber={6} />
			<ChatListItems sectionName="Groups" chats={groupChats} displayRowsNumber={4} />
		</StyledChatListLayout>
	);
};
