import { TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import styled from "styled-components";
import { useState } from "react";
import { colors } from "../../../../styles/colors.ts";

const Styled = {
	InputContainer: styled.div`
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-top: 1px solid #000;
		position: sticky;
		bottom: 0;
		background-color: ${colors.lightBackground};
	`,
};

interface MessageInputProps {
	onSend: (message: string) => void;
}

export const MessageInput = ({ onSend }: MessageInputProps) => {
	const [message, setMessage] = useState("");

	const handleSend = () => {
		if (message.trim() !== "") {
			onSend(message);
			setMessage("");
		}
	};

	return (
		<Styled.InputContainer>
			<TextField value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type in a message" fullWidth />
			<IconButton onClick={handleSend} style={{ color: "saddlebrown" }}>
				<Send />
			</IconButton>
		</Styled.InputContainer>
	);
};
