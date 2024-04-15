import styled from "styled-components";
import { ChatHeader } from "./ChatHeader.tsx";
import { useState } from "react";
import { DirectChatDetail } from "./DirectChatDetail.tsx";
import { GroupChatDetail } from "./groupChatDetail/GroupChatDetail.tsx";
import { ChatStore, State } from "../../../stores/ChatStore.ts";
import { MessagesContainer } from "./messages/MessagesContainer.tsx";

const Styled = {
	ChatWindow: styled.section<{ $rightSectionVisible: boolean }>`
		display: grid;
		grid-template-rows: 1fr auto;
		grid-template-columns: ${(props) => (props.$rightSectionVisible ? "1fr 1fr" : "1fr")};
		grid-template-areas: ${(props) => (props.$rightSectionVisible ? "'content rightSection'" : "'content' 'rightSection'")};
		height: 100%;
	`,
	RightSection: styled.aside`
		grid-area: rightSection;
		border-left: 0.0625rem solid black;
	`,
	Content: styled.div`
		grid-area: content;
	`,
};

export const ChatWindow = () => {
	const [rightSectionVisible, setRightSectionVisible] = useState(false);

	const { activeChat } = ChatStore.useStore((state: State) => ({
		activeChat: state.activeChat,
	}));

	const toggleRightSection = () => {
		setRightSectionVisible(!rightSectionVisible);
	};

	return (
		<Styled.ChatWindow $rightSectionVisible={rightSectionVisible}>
			<Styled.Content>
				<ChatHeader toggleRightSection={toggleRightSection} />
				<MessagesContainer />
			</Styled.Content>
			{rightSectionVisible && (
				<Styled.RightSection>{activeChat?.type === "DIRECT" ? <DirectChatDetail /> : <GroupChatDetail />}</Styled.RightSection>
			)}
		</Styled.ChatWindow>
	);
};
