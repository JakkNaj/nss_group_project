import {Button, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { ChatRoomType } from "../../../model/types/ChatRoomType.ts";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";
import {ChatLogStore} from "../../../stores/ChatLogStore.ts";
import styled from "styled-components";
import {colors} from "../../../styles/colors.ts";

type ChatListItemsProps = {
	sectionName: string;
	chats: ChatRoomType[];
	displayRowsNumber: number;
	showChatWindow: () => void;
};

const ChatListItems = ({ sectionName, chats, displayRowsNumber, showChatWindow }: ChatListItemsProps) => {
	const getLastMessage = (chatId: number) => {
		const message = ChatLogStore.getLastMessageFromChatLog(chatId);
		if (message && message.content) {
			return message.content.substring(0, 30) + (message.content.length > 20 ? "..." : "");
		} else {
			return "no messages yet";
		}
	};

	const handleChatItemClick = (chatId: number) => {
		ChatRoomStore.updateActiveChatRoom(chatId);
		showChatWindow();
	};


	const getChatName = (chat: ChatRoomType) => {
		const foundChat = chats.find(c => c.chatLogId === chat.chatLogId);
		if (foundChat && foundChat.name) {
			return foundChat.name;
		}
		return "No name";
	}

	return (
		<List>
			<Styled.TitleSection>
				<h3>{sectionName}</h3>
			</Styled.TitleSection>
			{chats.slice(0, displayRowsNumber).map((chat) => (
				<ListItem
					key={chat.chatLogId}
					alignItems="flex-start"
					sx={{ padding: 0, paddingBottom: "22px" }}
					onClick={() => handleChatItemClick(chat.chatLogId)}
				>
					<ListItemAvatar>
						<UserAvatar name={getChatName(chat)} avatar={chat.avatar} />
					</ListItemAvatar>
					<div
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							maxWidth: "100%",
						}}
					>
						<ListItemText primary={getChatName(chat)} secondary={getLastMessage(chat.chatLogId)} />
					</div>
				</ListItem>
			))}
		</List>
	);
};

export default ChatListItems;


const Styled = {
	Button: styled(Button)({
		backgroundColor: `${colors.darkerBackground} !important`,
		color: `${colors.primaryText} !important`,
		fontFamily: "Zilla Slab, sans-serif !important",
		width: "40%",
	}),
	TitleSection: styled("div")({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	}),
}