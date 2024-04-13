import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { UserAvatar } from "../../../components/UserAvatar.tsx";

type ChatItem = {
	id: number;
	avatar: string;
	name: string;
	lastMessage: string;
};

type ChatListItemsProps = {
	sectionName: string;
	chats: ChatItem[];
	displayRowsNumber: number;
};

const ChatListItems = ({ sectionName, chats, displayRowsNumber }: ChatListItemsProps) => {
	return (
		<List>
			<h3>{sectionName}</h3>
			{chats.slice(0, displayRowsNumber).map((chat) => (
				<ListItem key={chat.id} alignItems="flex-start" sx={{ padding: 0, paddingBottom: "22px" }}>
					<ListItemAvatar>
						<UserAvatar username={chat.name} photoUrl={null} />
					</ListItemAvatar>
					<div
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							maxWidth: "100%",
						}}
					>
						<ListItemText
							primary={chat.name}
							secondary={chat.lastMessage.substring(0, 30) + (chat.lastMessage.length > 20 ? "..." : "")}
						/>
					</div>
				</ListItem>
			))}
		</List>
	);
};

export default ChatListItems;
