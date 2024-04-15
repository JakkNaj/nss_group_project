import { Card, CardContent, Typography } from "@mui/material";
import styled from "styled-components";
import { MessageType } from "../../../../model/types/MessageType.ts";
import { colors } from "../../../../styles/colors.ts";
import { useState } from "react";

const Styled = {
	MessageCardContainer: styled.div<{ $isUserMessage: boolean }>`
		align-self: ${(props) => (props.$isUserMessage ? "flex-end" : "flex-start")};
		margin: 1rem;
		display: flex;
		flex-direction: column;
		align-items: ${(props) => (props.$isUserMessage ? "flex-end" : "flex-start")};
	`,
	MessageCard: styled(Card)<{ $isUserMessage: boolean }>`
		border: 0.0625rem solid #000;
		box-shadow: 0.2315625rem 0.2315625rem 0 0 #000 !important;
		border-radius: ${(props) =>
			props.$isUserMessage ? "0.694625rem 0 0.694625rem 0.694625rem" : "0 0.694625rem 0.694625rem 0.694625rem"} !important;
	`,
	CardContent: styled(CardContent)<{ $isUserMessage: boolean }>`
		background-color: ${(props) => (props.$isUserMessage ? colors.darkerBackground : colors.lightBackground)};
		padding: 0.57875rem !important;
	`,
};

interface MessageProps {
	message: MessageType;
	userId: number;
}

export const Message = ({ message, userId }: MessageProps) => {
	const isUserMessage = message.idSender === userId;
	const [showTimestamp, setShowTimestamp] = useState(false);

	return (
		<Styled.MessageCardContainer $isUserMessage={isUserMessage}>
			{showTimestamp && (
				<Typography variant="caption" color="textSecondary">
					{message.timestamp.toLocaleString()}
				</Typography>
			)}
			<Styled.MessageCard $isUserMessage={isUserMessage} onClick={() => setShowTimestamp(!showTimestamp)}>
				<Styled.CardContent $isUserMessage={isUserMessage}>
					<Typography variant="body2">{message.text}</Typography>
				</Styled.CardContent>
			</Styled.MessageCard>
		</Styled.MessageCardContainer>
	);
};
