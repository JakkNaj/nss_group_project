import {Card, CardContent, Typography} from "@mui/material";
import styled from "styled-components";
import {MessageType} from "../../../../model/types/MessageType.ts";
import {colors} from "../../../../styles/colors.ts";
import {useEffect, useState} from "react";
import {UserAvatar} from "../../../../components/UserAvatar.tsx";
import {ChatRoomStore} from "../../../../stores/ChatRoomStore.ts";
import ReplyIcon from '@mui/icons-material/Reply';
import {UserStore} from "../../../../stores/UserStore.ts";
import {UserType} from "../../../../model/types/UserType.ts";

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
			props.$isUserMessage
				? "0.694625rem 0 0.694625rem 0.694625rem"
				: "0 0.694625rem 0.694625rem 0.694625rem"} !important;
		position: relative; /* Make the container relative for absolute positioning */
	`,
	CardContent: styled(CardContent)<{ $isUserMessage: boolean; $isReply: boolean }>`
		background-color: ${(props) =>
			props.$isUserMessage ? colors.darkerBackground : colors.lightBackground};
		padding: 0.8rem !important;
		border-left: ${(props) => (props.$isReply ? `0.25rem solid ${props.$isUserMessage ? colors.darkerBackground : colors.lightBackground}` : "none")};
		margin-left: ${(props) => (props.$isReply ? "0.5rem" : "0")};
		text-align: ${(props) => (props.$isUserMessage ? "right" : "left")};
	`,
	Avatar: styled(UserAvatar)`
		margin-right: 0;
	`,
	ReplyIcon: styled(ReplyIcon)<{ $isUserMessage: boolean;}>`
		cursor: pointer;
		margin-left: 0.5rem;
	`,
	ReplyContent: styled.div<{ $isUserMessage: boolean }>`
		background-color: ${props => props.$isUserMessage ? colors.lightBackground : colors.darkerBackground};
		padding: 0.75rem;
		padding-left: 0.5rem;
		border-bottom: 0.0625rem solid ${colors.primaryText};
	`,
	MessageCardWrapper: styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between
	`,
};

interface MessageProps {
	message: MessageType;
	userId: number;
	handleReplyClick: (messageId: string, messageContent: string | null) => void;
}

export const Message = ({ message, userId, handleReplyClick }: MessageProps) => {
	const isUserMessage = message.senderId === userId;
	const [showTimestamp, setShowTimestamp] = useState(false);
	const [sender, setSender] = useState<UserType | null>(null);
	const [showReplyIcon, setShowReplyIcon] = useState(false);

	const { activeChat } = ChatRoomStore.useStore((state) => ({
		activeChat: state.activeChatRoom,
	}));

	useEffect(() => {
		const fetchSender = async () => {
			const sender = await UserStore.fetchUserDetails(message.senderId);
			setSender(sender);
		}
		fetchSender();
	}, [message.senderId]);

	//should not happen
	if (!sender) {
		return <div>Error: not found sender of the message!</div>;
	}

	function formatDate(timestampInSeconds: number) {
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
		<Styled.MessageContainer
			$isUserMessage={isUserMessage}
			onMouseEnter={() => {
				if (!isUserMessage) {
					setShowReplyIcon(true);
				}
			}}
			onMouseLeave={() => {
				if (!isUserMessage) {
					setShowReplyIcon(false);
				}
			}}
		>
			{!isUserMessage && <Styled.Avatar name={sender.name} avatar={sender.avatar} width={2} />}
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
				<Styled.MessageCardWrapper>
					<Styled.MessageCard
						$isUserMessage={isUserMessage}
						onClick={() => setShowTimestamp(!showTimestamp)}
					>
						{message.type == "REPLY" && message.messageReference && (
							<Styled.ReplyContent $isUserMessage={isUserMessage}>
								<Typography variant="caption" color="textSecondary">
									Reply: {message.messageReference.referencedMessageContent}
								</Typography>
							</Styled.ReplyContent>
						)}
						<Styled.CardContent $isUserMessage={isUserMessage} $isReply={false}>
							<Typography variant="body2">{message.content}</Typography>
						</Styled.CardContent>
					</Styled.MessageCard>
					{showReplyIcon && (
						// <div>haha</div>
						<Styled.ReplyIcon onClick={() => handleReplyClick(message.id, message.content)} $isUserMessage={isUserMessage}/>
					)}
				</Styled.MessageCardWrapper>
			</Styled.MessageCardContainer>
		</Styled.MessageContainer>
	);
};
