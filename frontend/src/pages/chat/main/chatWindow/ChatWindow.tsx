import styled from "styled-components";
import { ChatHeader } from "./ChatHeader.tsx";
import { DirectChatDetail } from "../directChatDetail/DirectChatDetail.tsx";
import { GroupChatDetail } from "../groupChatDetail/GroupChatDetail.tsx";
import { ChatRoomStore, State } from "../../../../stores/ChatRoomStore.ts";
import { MessagesContainer } from "../messages/MessagesContainer.tsx";
import { MessageInput } from "../messages/MessageInput.tsx";
import { useChatLogStore } from "../../../../stores/ChatLogStore.ts";
import { EMessageType } from "../../../../model/enums/EMessageType.ts";
import { UserType } from "../../../../model/types/UserType.ts";
import { useSendMessage } from "../../../../hooks/useSendMessage.tsx";
import { useSendReply } from "../../../../hooks/useSendReply.tsx";
import {useState} from "react";
import {MessageReferenceType} from "../../../../model/types/MessageReference.ts";

const Styled = {
	ChatWindow: styled.section<{ $rightSectionVisible: boolean }>`
		display: flex;
		height: 100%;
	`,
	RightSection: styled.aside<{ $isVisible: boolean }>`
		border-left: 0.0625rem solid black;
		width: ${(props) => (props.$isVisible ? "40%" : "0")};
		transform: ${(props) => (props.$isVisible ? "translateX(0)" : "translateX(100%)")};
		transition:
			transform 0.3s ease-in-out,
			width 0.3s ease-in-out;
		overflow: hidden;
	`,
	Content: styled.div`
		flex-grow: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	`,
	Header: styled.div`
		position: sticky;
		top: 0;
		z-index: 1;
	`,
};

type ChatWindowProps = {
	rightSectionVisible: boolean;
	setRightSectionVisible: (visible: boolean) => void;
	selectedGroupUser: UserType | null;
	setSelectedGroupUser: (user: UserType | null) => void;
};

export const ChatWindow = ({ rightSectionVisible, setRightSectionVisible, selectedGroupUser, setSelectedGroupUser }: ChatWindowProps) => {
	const { activeChatLog } = useChatLogStore((state) => ({
		activeChatLog: state.activeChatLog,
	}));

	const { activeChatRoom } = ChatRoomStore.useStore((state: State) => ({
		activeChatRoom: state.activeChatRoom,
	}));

	const createMessageReference = (messageId : string, messageContent : string | null) : MessageReferenceType => {
		let first50 = messageContent?.substring(0, 50) || "";
		if (messageContent?.length && messageContent.length > 50) {
			first50 += "...";
		}
		return {
			referencedMessageId: messageId,
			referencedMessageContent: first50
		};
	}

	const [replyMessageReference, setReplyMessageReference] = useState(
		createMessageReference("", "")
	);

	const { sendMessage } = useSendMessage();
	const { sendReply } = useSendReply();


	const toggleRightSection = () => {
		setRightSectionVisible(!rightSectionVisible);
	};

	if (!activeChatLog) {
		//activeChat is null only when there are no chats
		return <div>Add friends to start chatting</div>;
	}

	const handleSendMessage = (message: string) => {
		if (!activeChatLog) return null;
		if (message && activeChatLog) {
			if (replyMessageReference.referencedMessageId !== "") {
				sendReply({
					chatLogId: activeChatLog.chatLogId,
					content: message,
					type: EMessageType.REPLY,
					messageReference: replyMessageReference
				});
			} else {
				sendMessage({
					chatLogId: activeChatLog.chatLogId,
					content: message,
					type: EMessageType.CHAT,
				});
			}
			setReplyMessageReference(
				createMessageReference("", "")
			);
		}
	};



	const handleReplyClick = (messageId : string, messageContent : string | null) => {
		console.log("Replying to message with id: " + messageId + " and content: " + messageContent);
		setReplyMessageReference(
			createMessageReference(messageId, messageContent)
		);
	}

	return (
		<Styled.ChatWindow $rightSectionVisible={rightSectionVisible}>
			<Styled.Content>
				<Styled.Header>
					<ChatHeader toggleRightSection={toggleRightSection} />
				</Styled.Header>
				<MessagesContainer handleReplyClick={handleReplyClick}/>
				<MessageInput onSend={handleSendMessage} replyMessageReference={replyMessageReference}/>
			</Styled.Content>
			<Styled.RightSection $isVisible={rightSectionVisible}>
				{activeChatRoom?.type === "ONE_ON_ONE" ? (
					<DirectChatDetail onBackClick={toggleRightSection} />
				) : (
					<GroupChatDetail
						onBackClick={toggleRightSection}
						selectedGroupUser={selectedGroupUser}
						setSelectedGroupUser={setSelectedGroupUser}
					/>
				)}
			</Styled.RightSection>
		</Styled.ChatWindow>
	);
};
