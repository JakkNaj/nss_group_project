import styled from "styled-components";
import { ChatHeader } from "./ChatHeader.tsx";
import { useState } from "react";
import { DirectChatDetail } from "./DirectChatDetail.tsx";
import { GroupChatDetail } from "./GroupChatDetail/GroupChatDetail.tsx";
import { ChatStore, State } from "../../../stores/ChatStore.ts";

const Styled = {
	ChatWindow: styled.section<{ $rightSectionVisible: boolean }>`
		display: grid;
		grid-template-columns: ${(props) => (props.$rightSectionVisible ? "2fr 1fr" : "1fr")};
		grid-template-areas: "content rightSection";
		height: 100%;
	`,
	RightSection: styled.aside`
		grid-area: rightSection;
		border-left: 0.0625rem solid black;
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
			<ChatHeader toggleRightSection={toggleRightSection} />
			{rightSectionVisible && (
				<Styled.RightSection>{activeChat?.type === "DIRECT" ? <DirectChatDetail /> : <GroupChatDetail />}</Styled.RightSection>
			)}
		</Styled.ChatWindow>
	);
};
