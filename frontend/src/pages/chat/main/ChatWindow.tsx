import styled from "styled-components";
import {ChatHeader} from "./ChatHeader.tsx";
import {useState} from "react";
import {DirectChatDetail} from "./directChatDetail/DirectChatDetail.tsx";
import {GroupChatDetail} from "./groupChatDetail/GroupChatDetail.tsx";
import {ChatRoomStore, State} from "../../../stores/ChatRoomStore.ts";
import {MessagesContainer} from "./messages/MessagesContainer.tsx";
import {MessageInput} from "./messages/MessageInput.tsx";
import {useChatLogStore} from "../../../stores/ChatLogStore.ts";
import {EMessageType} from "../../../model/enums/EMessageType.ts";

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

type ChatWindowProps = {
	sendMessage: (message: { content: string, chatId : number, type: EMessageType }) => void;
}

export const ChatWindow = ({sendMessage} : ChatWindowProps) => {
	const [rightSectionVisible, setRightSectionVisible] = useState(false);

	const { activeChatLog } = useChatLogStore((state) => ({
		activeChatLog: state.activeChatLog,
	}));

	const { activeChatRoom } = ChatRoomStore.useStore((state: State) => ({
		activeChatRoom: state.activeChatRoom,
	}));

	if (!activeChatLog) {
		//activeChat is null only when there are no chats
		return (
			<div>
				Add friends to start chatting
			</div>
		);
	}


	const toggleRightSection = () => {
		setRightSectionVisible(!rightSectionVisible);
	};

	const handleSendMessage = (message: string) => {
		console.log("sending: " + message + " to chat: " + activeChatLog.id);
		if (!activeChatLog) return null;
		if (message && activeChatLog) {
			sendMessage({
				content:message,
				chatId: activeChatLog.id,
				type: EMessageType.CHAT
			});
		}
	};

	return (
		<Styled.ChatWindow $rightSectionVisible={rightSectionVisible}>
			<Styled.Content>
				<div>
					<ChatHeader toggleRightSection={toggleRightSection} />
					<MessagesContainer messages={activeChatLog.messages}/>
				</div>
				<MessageInput onSend={handleSendMessage} />
			</Styled.Content>
			<Styled.RightSection $isVisible={rightSectionVisible}>
				{activeChatRoom?.type === "ONE_ON_ONE" ? (
					<DirectChatDetail onBackClick={toggleRightSection} />
				) : (
					<GroupChatDetail onBackClick={toggleRightSection} />
				)}
			</Styled.RightSection>
		</Styled.ChatWindow>
	);
};
