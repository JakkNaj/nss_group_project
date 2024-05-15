import { FormEvent, useState } from "react";
import { Button } from "@mui/material";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";
import { UserStore } from "../../../stores/UserStore.ts";
import {colors} from "../../../styles/colors.ts";
import styled from "styled-components";
import {StyledInputField} from "./SearchField.tsx";


interface DirectChatConnectProps {
	toggleProfileWindow: () => void;
}

export const DirectChatConnect = ({ toggleProfileWindow }: DirectChatConnectProps) => {
	const [chatId, setChatId] = useState("");

	const handleConnect = async (event: FormEvent) => {
		event.preventDefault();
		const id = parseInt(chatId);
		if (!isNaN(id)) {
			try {
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