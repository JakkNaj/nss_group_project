import styled from "styled-components";
import { ChatHeader } from "./ChatHeader.tsx";
import { useState } from "react";
import { DirectChatDetail } from "./DirectChatDetail.tsx";

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

	const toggleRightSection = () => {
		setRightSectionVisible(!rightSectionVisible);
	};
	return (
		<Styled.ChatWindow $rightSectionVisible={rightSectionVisible}>
			<ChatHeader toggleRightSection={toggleRightSection} />
			{rightSectionVisible && (
				<Styled.RightSection>
					<DirectChatDetail />
				</Styled.RightSection>
			)}
		</Styled.ChatWindow>
	);
};
