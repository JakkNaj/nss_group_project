import styled from "styled-components";
import { ChatHeader } from "./ChatHeader.tsx";
import { useState } from "react";
import { DirectChatDetail } from "./directChatDetail/DirectChatDetail.tsx";
import { GroupChatDetail } from "./groupChatDetail/GroupChatDetail.tsx";
import { ChatStore, State } from "../../../stores/ChatStore.ts";
import { MessagesContainer } from "./messages/MessagesContainer.tsx";
import { MessageInput } from "./messages/MessageInput.tsx";
import {UserStore} from "../../../stores/UserStore.ts";
import {useChat} from "../../../hooks/useChat.tsx";

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
		justify-content: space-between;
	`,
};

export const ChatWindow = () => {
	const [rightSectionVisible, setRightSectionVisible] = useState(false);

	const { activeChat } = ChatStore.useStore((state: State) => ({
		activeChat: state.activeChat,
	}));

	if (!activeChat) {
		//activeChat is null only when there are no chats
		return (
			<div>
				Add friends to start chatting
			</div>
		);
	}

	const { sendMessage } = useChat({ username: UserStore.getLoggedInUser().username,
														  chatIds: ChatStore.useStore().chats.map(chat => chat.id) });

	const toggleRightSection = () => {
		setRightSectionVisible(!rightSectionVisible);
	};

	const handleSendMessage = (message: string) => {
		console.log("sending: " + message + " to chat: " + activeChat.id);
		if (!activeChat) return null;
		if (message && activeChat) {
			sendMessage({content: message, chatId: activeChat.id});
		}
	};

	return (
		<Styled.ChatWindow $rightSectionVisible={rightSectionVisible}>
			<Styled.Content>
				<div>
					<ChatHeader toggleRightSection={toggleRightSection} />
					<MessagesContainer messages={activeChat.messages}/>
				</div>
				<MessageInput onSend={handleSendMessage} />
			</Styled.Content>
			<Styled.RightSection $isVisible={rightSectionVisible}>
				{activeChat?.type === "DIRECT" ? (
					<DirectChatDetail onBackClick={toggleRightSection} />
				) : (
					<GroupChatDetail onBackClick={toggleRightSection} />
				)}
			</Styled.RightSection>
		</Styled.ChatWindow>
	);
};
