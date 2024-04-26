import { ChatPageHeader } from "./header/ChatPageHeader.tsx";
import { ChatList } from "./list/ChatList.tsx";
import styled from "styled-components";
import { ChatWindow } from "./main/ChatWindow.tsx";
import { ProfileWindow } from "./main/ProfileWindow.tsx";
import { useState } from "react";
import {useChat} from "../../hooks/useChat.tsx";
import {UserStore} from "../../stores/UserStore.ts";

const Styled = {
	ChatPageContainer: styled("div")({
		fontFamily: "Inter, sans-serif",
		display: "grid",
		gridTemplateColumns: "2fr 4fr",
		gridTemplateRows: "1fr 14fr",
		gridTemplateAreas: `
            "header header"
            "leftSection main"
        `,
		height: "100vh",
	}),
	Header: styled("header")({
		gridArea: "header",
		borderBottom: "0.0625rem solid black",
	}),
	LeftSection: styled("section")({
		gridArea: "leftSection",
		borderRight: "0.0625rem solid black",
		height: "100%",
		overflowY: "auto",
	}),
	Main: styled("main")({
		gridArea: "main",
		height: "100%",
		overflowY: "auto",
		overflowX: "hidden",
		width: "100%",
	}),
};

export const ChatPage = () => {
	const [showProfile, setShowProfile] = useState(false);

	//useChat hook to register listeners to websocket communication
	const { sendMessage } = useChat({ userId: UserStore.getLoggedInUser().id });

	const showProfileWindow = () => {
		setShowProfile(true);
	};

	const showChatWindow = () => {
		setShowProfile(false);
	};

	return (
		<Styled.ChatPageContainer>
			<Styled.Header>
				<ChatPageHeader showProfileWindow={showProfileWindow} />
			</Styled.Header>
			<Styled.LeftSection>
				<ChatList showChatWindow={showChatWindow} />
			</Styled.LeftSection>
			<Styled.Main>{showProfile ? <ProfileWindow /> : <ChatWindow sendMessage={sendMessage}/>}</Styled.Main>
		</Styled.ChatPageContainer>
	);
};
