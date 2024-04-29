import { Card, CardContent, Typography } from "@mui/material";
import styled from "styled-components";
import { MessageType } from "../../../../model/types/MessageType.ts";
import { colors } from "../../../../styles/colors.ts";
import { useState } from "react";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { UserStore } from "../../../../stores/UserStore.ts";
import { ChatRoomStore } from "../../../../stores/ChatRoomStore.ts";

const Styled = {
	MessageContainer: styled.div<{ $isUserMessage: boolean }>`
		align-self: ${(props) => (props.$isUserMessage ? "flex-end" : "flex-start")};
		display: flex;
		flex-direction: row;
		padding: 0.5rem;
		align-items: center;
	`,

	MessageCardContainer: styled.div<{ $isUserMessage: boolean }>`
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
	Avatar: styled(UserAvatar)`
		margin-right: 0;
	`,
};

interface MessageProps {
	message: MessageType;
	userId: number;
}

export const Message = ({ message, userId }: MessageProps) => {
	const isUserMessage = message.senderId === userId;
	const [showTimestamp, setShowTimestamp] = useState(false);
	const sender = UserStore.getUserById(message.senderId);

	const { activeChat } = ChatRoomStore.useStore((state) => ({
		activeChat: state.activeChatRoom,
	}));

	//should not happen
	if (!sender) {
		return <div>Error: not found sender of the message!</div>;
	}

	function formatDate(timestampInSeconds : number) {
		const date = new Date(timestampInSeconds * 1000);
		const year = date.getFullYear();
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const day = ("0" + date.getDate()).slice(-2);
		const hours = ("0" + date.getHours()).slice(-2);
		const minutes = ("0" + date.getMinutes()).slice(-2);
		const seconds = ("0" + date.getSeconds()).slice(-2);

		return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
	}

	return (
		<Styled.MessageContainer $isUserMessage={isUserMessage}>
			{!isUserMessage && <Styled.Avatar username={sender.name} avatar={sender.avatar} width={2} />}
			<Styled.MessageCardContainer $isUserMessage={isUserMessage}>
				{activeChat?.type === "GROUP" && !isUserMessage && (
					<Typography variant="caption" color="textSecondary">
						{sender.name}
					</Typography>
				)}
				{showTimestamp && (
					<Typography variant="caption" color="textSecondary">
						{formatDate(message.timestampInSeconds)}
					</Typography>
				)}
				<Styled.MessageCard $isUserMessage={isUserMessage} onClick={() => setShowTimestamp(!showTimestamp)}>
					<Styled.CardContent $isUserMessage={isUserMessage}>
						<Typography variant="body2">{message.content}</Typography>
					</Styled.CardContent>
				</Styled.MessageCard>
			</Styled.MessageCardContainer>
		</Styled.MessageContainer>
	);
};
