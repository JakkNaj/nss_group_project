import { ChatPageHeader } from "./header/ChatPageHeader.tsx";
import { ChatList } from "./list/ChatList.tsx";
import styled from "styled-components";
import { ChatWindow } from "./main/chatWindow/ChatWindow.tsx";
import { ProfileWindow } from "./main/profileWindow/ProfileWindow.tsx";
import { useState } from "react";
import { UserStore } from "../../stores/UserStore.ts";
import { UserType } from "../../model/types/UserType.ts";
import { useChatConnection } from "../../hooks/useChatConnection.tsx";
import FriendsWindow from "./main/FriendsWindow/FriendsWindow.tsx";
import { MainState } from "./main/MainState.ts";
import GroupsWindow from "./main/GroupsWindow/GroupsWindow.tsx";

const Styled = {
	ChatPageContainer: styled("div")({
		fontFamily: "Inter, sans-serif",
		display: "grid",
		gridTemplateColumns: "minmax(0, 28rem) 1fr",
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
		maxWidth: "36rem",
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
	const [mainState, setMainState] = useState<MainState>(MainState.PROFILE);
	const [selectedGroupUser, setSelectedGroupUser] = useState<UserType | null>(null);
	const [rightSectionVisible, setRightSectionVisible] = useState(false);

	//useChatConnection hook to register listeners to websocket communication
	useChatConnection(UserStore.getLoggedInUser());

	const showProfileWindow = () => {
		setMainState(MainState.PROFILE);
	};

	const showChatWindow = () => {
		setMainState(MainState.CHAT);
	};

	const showFriendsWindow = () => {
		setMainState(MainState.FRIENDS);
	}

	const showGroupsWindow = () => {
		setMainState(MainState.GROUPS);
	}

	return (
		<Styled.ChatPageContainer>
			<Styled.Header>
				<ChatPageHeader showProfileWindow={showProfileWindow} />
			</Styled.Header>
			<Styled.LeftSection>
				<ChatList showChatWindow={showChatWindow} showFriendsWindow={showFriendsWindow} showGroupsWindow={showGroupsWindow} />
			</Styled.LeftSection>
			<Styled.Main>
				{mainState === MainState.FRIENDS ? (
					<FriendsWindow />
				) : mainState === MainState.PROFILE ? (
					<ProfileWindow />
				) : mainState === MainState.CHAT ? (
					<ChatWindow
						rightSectionVisible={rightSectionVisible}
						setRightSectionVisible={setRightSectionVisible}
						selectedGroupUser={selectedGroupUser}
						setSelectedGroupUser={setSelectedGroupUser}
					/>
				) : (
					<GroupsWindow />
				)}
			</Styled.Main>
		</Styled.ChatPageContainer>
	);
};
