import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { ChatType } from "../../../model/types/ChatType.ts";
import { ChatStore } from "../../../context/ChatStore.ts";
import { EChatType } from "../../../model/enums/EChatType.ts";
import { UserStore } from "../../../context/UserStore.ts";

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

	const getChatName = (chatId: number) => {
		const chat = chats.find((chat) => chat.id === chatId);
		if (chat && chat.type === EChatType.DIRECT) {
			for (let i = 0; i < chat.users.length; i++) {
				if (chat.users[i] !== UserStore.getLoggedInUser().id) {
					const otherUser = UserStore.getUserById(chat.users[i]);
					return otherUser ? otherUser.name : "Unknown user";
				}
			}
		}
		return chat ? chat.name : "Unknown chat";
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
						<UserAvatar username={getChatName(chat.id)} photoUrl={chat.avatar} />
					</ListItemAvatar>
					<div
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							maxWidth: "100%",
						}}
					>
						<ListItemText primary={getChatName(chat.id)} secondary={getLastMessage(chat.id)} />
					</div>
				</ListItem>
			))}
		</List>
	);
};

export default ChatListItems;
