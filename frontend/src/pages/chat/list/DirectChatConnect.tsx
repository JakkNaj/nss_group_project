import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";
import { useSendMessage } from "../../../hooks/useSendMessage.tsx";
import {UserStore} from "../../../stores/UserStore.ts";

interface DirectChatConnectProps {
	toggleProfileWindow: () => void;
}

export const DirectChatConnect = ({ toggleProfileWindow }: DirectChatConnectProps) => {
	const [chatId, setChatId] = useState("");

	const handleConnect = async () => {
		const id = parseInt(chatId);
		if (!isNaN(id)) {
			try {
				//add user to chat, then fetch chatRoom and chatLog
				await ChatRoomStore.addUserToChatRoomBEcall(id, UserStore.getLoggedInUser().id);
				const chatRoom = await ChatRoomStore.getChatRoom(id);
				if (chatRoom) {
					await ChatRoomStore.setActiveChatRoom(chatRoom);
					toggleProfileWindow();
				} else {
					console.error("Chat room not found");
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<div>
			<h3>Connect to Direct Chat</h3>
			<TextField variant="outlined" label="Chat ID" value={chatId} onChange={(e) => setChatId(e.target.value)} />
			<Button variant="contained" onClick={handleConnect}>
				Connect
			</Button>
		</div>
	);
};
