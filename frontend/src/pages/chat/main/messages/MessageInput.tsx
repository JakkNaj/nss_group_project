import { TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import styled from "styled-components";
import React, { useState } from "react";
import { colors } from "../../../../styles/colors.ts";
import { MessageReferenceType } from "../../../../model/types/MessageReference.ts";

const Styled = {
	InputContainer: styled.div`
		display: flex;
	`,
	ReplyContainer: styled.div`
		padding: 25px;
		background-color: ${colors.darkerBackground}; 
		color: ${colors.primaryText};
		margin-bottom: 20px;
		width: 100%; 
		text-align: start;
		box-sizing: border-box;
		font-size: 0.875rem;
		box-shadow: 0.2315625rem 0.2315625rem 0 0 #000;
		border-bottom-right-radius: 1.4375rem;
		//50% opacity shadow on text
		text-shadow: 0.0625rem 0.0625rem 0 ${colors.lightBackground};
	`,
	InputWrapper: styled.div`
		display: flex;
		flex-direction: column;
		padding: 10px;
		border-top: 1px solid #000;
		position: sticky;
		bottom: 0;
		background-color: ${colors.lightBackground};
		border-bottom-right-radius: 1.4375rem;
	`,
};

interface MessageInputProps {
	onSend: (message: string) => void;
	replyMessageReference: MessageReferenceType;
}

export const MessageInput = ({ onSend, replyMessageReference }: MessageInputProps) => {
	const [message, setMessage] = useState("");

	const handleSend = () => {
		if (message.trim() !== "") {
			onSend(message);
			setMessage("");
		}
	};

	const handleKeyUp = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSend();
			e.preventDefault(); //prevent adding a new line
		}
	}

	const isReply = () => {
		return replyMessageReference.referencedMessageId !== ""
	}

	return (
		<Styled.InputWrapper>
			{isReply() && (
				<Styled.ReplyContainer> {/* Use the styled ReplyContainer */}
					Replying to: {replyMessageReference.referencedMessageContent}
				</Styled.ReplyContainer>
			)}

			<Styled.InputContainer>
				<TextField
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type in a message"
					onKeyUp={handleKeyUp}
					fullWidth />
				<IconButton onClick={handleSend} style={{ color: "saddlebrown" }}>
					<Send />
				</IconButton>
			</Styled.InputContainer>
		</Styled.InputWrapper>
	);
};
