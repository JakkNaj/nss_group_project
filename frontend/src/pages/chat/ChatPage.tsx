import { ChatPageHeader } from "./header/ChatPageHeader.tsx";
import { ChatList } from "./list/ChatList.tsx";
import styled from "styled-components";
import { ChatWindow } from "./main/ChatWindow.tsx";
import { ProfileWindow } from "./main/profileWindow/ProfileWindow.tsx";
import { useState } from "react";
import { UserStore } from "../../stores/UserStore.ts";
import { UserType } from "../../model/types/UserType.ts";
import { useChatConnection } from "../../hooks/useChatConnection.tsx";

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
	const [showProfile, setShowProfile] = useState(true);
	const [selectedGroupUser, setSelectedGroupUser] = useState<UserType | null>(null);
	const [rightSectionVisible, setRightSectionVisible] = useState(false);

	//useChatConnection hook to register listeners to websocket communication
	useChatConnection({ userId: UserStore.getLoggedInUser().id });

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
			<Styled.Main>
				{showProfile ? (
					<ProfileWindow />
				) : (
					<ChatWindow
						rightSectionVisible={rightSectionVisible}
						setRightSectionVisible={setRightSectionVisible}
						selectedGroupUser={selectedGroupUser}
						setSelectedGroupUser={setSelectedGroupUser}
					/>
				)}
			</Styled.Main>
		</Styled.ChatPageContainer>
	);
};
