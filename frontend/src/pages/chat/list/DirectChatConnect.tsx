import {FormEvent, useEffect, useState} from "react";
import { Button } from "@mui/material";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";
import { UserStore } from "../../../stores/UserStore.ts";
import {colors} from "../../../styles/colors.ts";
import styled from "styled-components";
import {StyledInputField} from "./SearchField.tsx";


interface DirectChatConnectProps {
	showChatWindow: () => void;
}

export const DirectChatConnect = ({ showChatWindow }: DirectChatConnectProps) => {
	const [loggedInUserId, setLoggedInUserId] = useState(-1);
	const [chatId, setChatId] = useState("");

	const user = UserStore.getLoggedInUser();

	useEffect(() => {
		if (user) {
			setLoggedInUserId(user.id);
		}
	}, []);

	if(!(loggedInUserId >= 0)){
		return <div>Error: no user logged in.</div>;
	}

	const handleConnect = async (event: FormEvent) => {
		console.log("Connecting to chat");
		event.preventDefault();
		const id = parseInt(chatId);
		if (!isNaN(id)) {
			try {
				await ChatRoomStore.addUserToChatRoomBEcall(id, loggedInUserId);
				const chatRoom = await ChatRoomStore.getChatRoom(id);
				if (chatRoom) {
					ChatRoomStore.addGroupChat(chatRoom);
					await ChatRoomStore.setActiveChatRoom(chatRoom);
					showChatWindow();
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
			<h3>Connect directly to Chat</h3>
			<Styled.Form onSubmit={handleConnect}>
				<StyledInputField.TextField
					variant="outlined"
					label="Chat ID"
					value={chatId}
					onChange={(e) => setChatId(e.target.value)}
				/>
				<Styled.Button variant="contained" type="submit">
					Connect
				</Styled.Button>
			</Styled.Form>
		</div>
	);
};


const Styled = {
	Button: styled(Button)({
		marginTop: "0.5rem !important",
		backgroundColor: `${colors.darkerBackground} !important`,
		color: `${colors.primaryText} !important`,
		fontFamily: "Zilla Slab, sans-serif !important",
		width: "40%",
	}),
	Form: styled("form")({
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: "0.5rem"
	}),
}