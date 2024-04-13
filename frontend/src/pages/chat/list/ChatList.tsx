import { SearchField } from "./SearchField.tsx";
import ChatListItems from "./ChatListItems.tsx";
import styled from "styled-components";
import { chats, groupChats } from "../../../MockData.ts";

const StyledChatListLayout = styled.div({
	padding: "2rem",
	display: "flex",
	flexDirection: "column",
	gap: "2rem",
	textAlign: "left",
	fontFamily: "Inter, sans-serif",
});

export const ChatList = () => {
	return (
		<StyledChatListLayout>
			<SearchField />
			<ChatListItems sectionName="Friends" chats={chats} displayRowsNumber={6} />
			<ChatListItems sectionName="Groups" chats={groupChats} displayRowsNumber={4} />
		</StyledChatListLayout>
	);
};
