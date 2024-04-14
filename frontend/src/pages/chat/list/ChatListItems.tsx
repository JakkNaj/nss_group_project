import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { ChatType } from "../../../model/types/ChatType.ts";
import { ChatStore } from "../../../stores/ChatStore.ts";

type ChatListItemsProps = {
	sectionName: string;
	chats: ChatType[];
	displayRowsNumber: number;
};

const ChatListItems = ({ sectionName, chats, displayRowsNumber }: ChatListItemsProps) => {
	const getLastMessage = (chatId: number) => {
		const message = ChatStore.getLastMessageFromChat(chatId);
		if (message) {
			return message.text.substring(0, 30) + (message.text.length > 20 ? "..." : "");
		} else {
			return "no messages yet";
		}
	};

	return (
		<List>
			<h3>{sectionName}</h3>
			{chats.slice(0, displayRowsNumber).map((chat) => (
				<ListItem
					key={chat.id}
					alignItems="flex-start"
					sx={{ padding: 0, paddingBottom: "22px" }}
					onClick={() => ChatStore.updateActiveChat(chat.id)}
				>
					<ListItemAvatar>
						<UserAvatar username={ChatStore.getChatName(chat.id)} avatar={chat.avatar} />
					</ListItemAvatar>
					<div
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							maxWidth: "100%",
						}}
					>
						<ListItemText primary={ChatStore.getChatName(chat.id)} secondary={getLastMessage(chat.id)} />
					</div>
				</ListItem>
			))}
		</List>
	);
};

export default ChatListItems;
